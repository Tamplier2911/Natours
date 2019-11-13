const Review = require('../models/reviewModel');
// const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

// handlers
const { deleteOne } = require('./handlerFactory');

// get all reviews || single review from tours route
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const reviews = tourId
    ? await Review.find({ tour: tourId })
    : await Review.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews: reviews
    }
  });
});

// add new review using tour id and user id || add new review from tours route
exports.addNewReview = catchAsync(async (req, res, next) => {
  const { review, rating, tour, user } = req.body;

  // allow nested routing
  const { _id } = req.user;
  const userOutput = user || _id;

  const { tourId } = req.params;
  const tourOutput = tour || tourId;

  const newReview = await Review.create({
    review: review,
    rating: rating,
    user: userOutput,
    tour: tourOutput
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});

// delete one review using id
exports.deleteReview = deleteOne(Review);
