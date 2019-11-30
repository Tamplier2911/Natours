const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getUser
} = require('../controllers/viewController');

const { isLoggedIn } = require('../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

// get all tours
router.get('/', getOverview);

// get single tour
router.get('/tour/:slug', getTour);

// log in | sign up
router.get('/login', getLoginForm);
router.get('/signup', getSignupForm);

// user page
router.get('/user/:id', getUser);

module.exports = router;
