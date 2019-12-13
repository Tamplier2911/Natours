const express = require('express');

const {
  getPasswordReset,
  getPasswordForgot,
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getUser,
  getBookings,
  alerts
  // updateUserData
} = require('../controllers/viewController');

// const { createBookingCheckout } = require('../controllers/bookingController');
const { isLoggedIn, protect } = require('../controllers/authController');

const router = express.Router();

// middleware that runs for each req that going to pick allert from query
router.use(alerts);

// password forgot
router.get('/forgot', getPasswordForgot);

// password reset route
router.get('/reset', getPasswordReset);

// render user menu in header if logged in else | login signup buttons
router.use(isLoggedIn);

// get all tours
router.get('/', getOverview);

// UNSAFE TEMPORARY MIDDLEWARE - createBookingCheckout
// router.get('/', createBookingCheckout, getOverview);

// get single tour
router.get('/tour/:slug', getTour);

// log in | sign up
router.get('/login', getLoginForm);
router.get('/signup', getSignupForm);

// user page
router.get('/user', protect, getUser);

// user bookings
router.get('/bookings', protect, getBookings);

/*

// update user info, using traditional form methods
router.post('/submit-user-data', protect, updateUserData);

*/

module.exports = router;
