const express = require('express');
const {
  getAllTours,
  addNewTour,
  getSingleTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
} = require('../controllers/tourController');
const { protect } = require('../controllers/authController');

const router = express.Router();

// router.param('id', checkID);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/montly-plan/:year').get(getMonthlyPlan);

router
  .route('/')
  .get(protect, getAllTours)
  .post(addNewTour);

router
  .route('/:id')
  .get(getSingleTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
