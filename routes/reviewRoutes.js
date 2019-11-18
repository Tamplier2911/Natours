const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');

const {
  getAllReviews,
  addNewReview,
  deleteReview,
  updateReview,
  getSingleReview,
  setTourUserIds
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, addNewReview);

router
  .route('/:id')
  .get(getSingleReview)
  .patch(protect, restrictTo('admin', 'user'), updateReview)
  .delete(protect, restrictTo('admin', 'user'), deleteReview);

module.exports = router;
