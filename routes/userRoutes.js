const express = require('express');
const {
  getAllUsers,
  createNewUser,
  getSingleUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const {
  signup,
  login,
  forgotPassword,
  resetPassword
} = require('./../controllers/authController');

const router = express.Router();

// signup
router.post('/signup', signup);

// login
router.post('/login', login);

// forgot password
router.post('/forgotPassword', forgotPassword);

// reset password
router.post('/resetPassword', resetPassword);

router
  .route('/')
  .get(getAllUsers)
  .post(createNewUser);

router
  .route('/:id')
  .get(getSingleUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
