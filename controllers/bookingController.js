const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
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
    success_url: `${req.protocol}://${req.get('host')}/`,
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
        images: ['https://bit.ly/2rs15Iy'],
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
