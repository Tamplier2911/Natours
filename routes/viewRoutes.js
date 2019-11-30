const express = require('express');

const {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getUser
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
router.get('/user/:id', protect, getUser);

module.exports = router;
