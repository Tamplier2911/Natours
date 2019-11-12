const Review = require('../models/reviewModel');
// const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews: reviews
    }
  });
});

exports.addNewReview = catchAsync(async (req, res, next) => {
  const { review, rating, tour, user } = req.body;

  // allow nested routing
  const { _id } = req.user;
  const userOutput = user || _id;

  const { tourId } = req.params;
  const tourOutput = tour || tourId;

  // const newReview = await Review.create(req.body);

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
