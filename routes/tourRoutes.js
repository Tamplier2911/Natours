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
  getToursWithin,
  getDistance,
  uploadTourImages,
  resizeTourImages
} = require('../controllers/tourController');

// auth controller
const { protect, restrictTo } = require('../controllers/authController');

// reviews router
const reviewRouter = require('../routes/reviewRoutes');

// tours router
const router = express.Router();

// if we match tours/:tourId/reviews we should use review router
router.use('/:tourId/reviews', reviewRouter);

// top 5 cheap tours
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

// tour statistics
router.route('/tour-stats').get(getTourStats);

// monthly plan
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

// find tour within certain distance aroud center point
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

// calculate distance from certain point to all tour starter points
router.route('/distances/:latlng/unit/:unit').get(getDistance);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), addNewTour);

router
  .route('/:id')
  .get(getSingleTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
