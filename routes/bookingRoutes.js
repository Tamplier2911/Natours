const express = require('express');

const {
  getCheckoutSession,
  getAllBookings,
  getOneBooking,
  createOneBooking,
  updateOneBooking,
  deleteOneBooking
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();

// PROTECTED
router.use(protect);

router.get('/checkout-session/:tourID', getCheckoutSession);

// RESTRICTED
router.use(restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(getAllBookings)
  .post(createOneBooking);

router
  .route('/:id')
  .get(getOneBooking)
  .patch(updateOneBooking)
  .delete(deleteOneBooking);

module.exports = router;
