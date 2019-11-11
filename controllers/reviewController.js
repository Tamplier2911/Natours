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
  //   const currentUserId = req.body.user._id;
  //   const currentTour = await Tour.find({ name: req.body.tourName });

  // USING PROTECT SO HAVING USER OBJECT WITH ID HERE

  const newReview = await Review.create(req.body);

  //   const newReview = await Review.create({
  //     review: req.body.params,
  //     rating: req.body.rating,
  //     user: currentUserId,
  //     tour: currentTour
  //   });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});
