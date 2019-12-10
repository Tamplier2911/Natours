const Tour = require('../models/tourModel');
// const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// get all tours
exports.getOverview = catchAsync(async (req, res, next) => {
  // Get tour data from collection
  const tours = await Tour.find();

  // Build template

  if (!tours) {
    return next(new AppError('Cannot find any tours.', '404'));
  }

  // Render that template using tour data.
  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours
  });
});

// get single tour by slug
exports.getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    select: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', '404'));
  }

  res.status(200).render('tour', {
    title: tour.name,
    tour: tour
  });
});

// get user page
exports.getUser = (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

// get user bookings
exports.getBookings = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  // find all bookings by current user id
  const bookings = await Booking.find({ user: id });
  // return tour id from each booking as array
  const tourIds = bookings.map(booking => booking.tour.id);

  // find tours related to returned IDs, passing array of IDs
  const tours = await Tour.find({ _id: { $in: tourIds } });

  // return found tours in order to display them to user using overview template
  // can implement delete booking functionality here
  res.status(200).render('overview', {
    title: 'Your bookings',
    tours: tours
  });
});

// get login form
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

// get signup form
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create new account'
  });
};

// get forgot password form
exports.getPasswordForgot = (req, res) => {
  res.status(200).render('passwordForgotForm', {
    title: 'Renew password'
  });
};

// get reset password form
exports.getPasswordReset = (req, res) => {
  res.status(200).render('passwordResetForm', {
    title: 'Reset password'
  });
};
/*

// update user data using traditional form methods
exports.updateUserData = catchAsync(async (req, res, next) => {
  const { name, email, photo } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: name,
      email: email,
      photo: photo || 'https://bit.ly/2oa8ScE'
    },
    { new: true, runValidators: true }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

*/
