const express = require('express');

// tour controller
const {
  getAllTours,
  addNewTour,
  getSingleTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin
} = require('../controllers/tourController');

// auth controller
const { protect, restrictTo } = require('../controllers/authController');

// reviews router
const reviewRouter = require('../routes/reviewRoutes');

// tours router
const router = express.Router();

// if we match tours/:tourId/reviews we should use review router
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router
  .route('/montly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), addNewTour);

router
  .route('/:id')
  .get(getSingleTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
