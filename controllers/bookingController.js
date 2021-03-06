const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsync = require('../utils/catchAsync');
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne
} = require('../controllers/handlerFactory');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // get currently booked tour
  const { tourID } = req.params;
  const tour = await Tour.findById(tourID);

  if (!tour) {
    return next(new AppError('Cannot find any tours with that ID.', '404'));
  }

  // create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // payment went successfully
    // success_url: `${req.protocol}://${req.get('host')}/bookings`,
    success_url: `${req.protocol}://${req.get('host')}/bookings?alert=booking`,
    // TEST - NOT SECURE
    /*
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    */
    // payment was declined
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    // users email
    customer_email: req.user.email,
    // recreate some data in order to make booking in DB
    client_reference_id: req.params.tourID,
    // item description for stripe
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // send it to the client
  res.status(200).json({
    status: 'success',
    data: {
      session: session
    }
  });
});

/*

// create Booking once checkout went successful, redirect to safe root URL
// do that process again, but now without query strings so return root URL
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // TEMPORARY SOLUTION - UNSAFE
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();

  await Booking.create({ tour: tour, user: user, price: price });
  res.redirect(req.originalUrl.split('?')[0]);

  // return next();
});

*/

const createBookingCheckout = async session => {
  // extract tour id from session
  const tourId = session.client_reference_id;

  // extract user email and then id from session
  const userId = (await User.findOne({ email: session.customer_email })).id;

  // extract product price from session
  // const prodPrice = session.line_items[0].amount / 100;
  const prodPrice = session.display_items[0].amount / 100;

  // create booking using extracted data
  await Booking.create({ tour: tourId, user: userId, price: prodPrice });
};

exports.getWebhookCheckout = (req, res, next) => {
  // read signature out of headers
  const signature = req.headers['stripe-signature'];
  // get event outer scoped
  let event;
  try {
    // call stripe fuinction with body, signature and hook secret
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    // catch error if any
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  // exactly the type that we defined on webhook creation
  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);
  // send response to stripe
  res.status(200).json({ received: true });
};

// get all bookings
exports.getAllBookings = getAll(Booking);

// get one booking by ID
exports.getOneBooking = getOne(Booking);

// create one booking
exports.createOneBooking = createOne(Booking);

// update one booking
exports.updateOneBooking = updateOne(Booking);

// delete one booking
exports.deleteOneBooking = deleteOne(Booking);
