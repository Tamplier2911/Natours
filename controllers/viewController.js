const Tour = require('../models/tourModel');
const User = require('../models/userModel');
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
exports.getUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError('There is no user with that id.', '404'));
  }

  res.status(200).render('account', {
    title: 'Your account',
    user: user
  });

  // Can expose user object in protect handler to res.locals.user
  // so it will be already rendered.
  /*
  res.status(200).render('account', {
    title: 'Your account',
  })
  */
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
