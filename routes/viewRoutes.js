const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm
} = require('../controllers/viewController');

const router = express.Router();

router.get('/', getOverview);
router.get('/tour/:slug', getTour);

router.get('/login', getLoginForm);
router.get('/signup', getSignupForm);

module.exports = router;
