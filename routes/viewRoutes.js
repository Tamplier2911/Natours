const express = require('express');

const {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getUser
  // updateUserData
} = require('../controllers/viewController');

const { isLoggedIn, protect } = require('../controllers/authController');

const router = express.Router();

// render user menu in header if logged in else | login signup buttons
router.use(isLoggedIn);

// get all tours
router.get('/', getOverview);

// get single tour
router.get('/tour/:slug', getTour);

// log in | sign up
router.get('/login', getLoginForm);
router.get('/signup', getSignupForm);

// user page
router.get('/user/:name', protect, getUser);
// router.get('/user', protect, getUser);

/*

// update user info, using traditional form methods
router.post('/submit-user-data', protect, updateUserData);

*/

module.exports = router;
