const Review = require('../models/reviewModel');

// handlers
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne
} = require('./handlerFactory');

// get all reviews || single review from tours route
exports.getAllReviews = getAll(Review);

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// add new review using tour id and user id || add new review from tours route
exports.addNewReview = createOne(Review);

// get one review using id
exports.getSingleReview = getOne(Review);

// delete one review using id
exports.deleteReview = deleteOne(Review);

// update one review using id
exports.updateReview = updateOne(Review);
