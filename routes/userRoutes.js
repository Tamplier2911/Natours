const express = require('express');

// user controller
const {
  getAllUsers,
  updateMe,
  deleteMe,
  restoreMe,
  getMe,
  createNewUser,
  getSingleUser,
  updateUser,
  deleteUser,
  uploadUserPhoto,
  resizeUserPhoto
} = require('../controllers/userController');

// auth controller
const {
  protect,
  signup,
  restrictTo,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('./../controllers/authController');

const router = express.Router();

// signup
router.post('/signup', signup);

// login
router.post('/login', login);

// logout
router.get('/logout', logout);

// forgot password
router.post('/forgotPassword', forgotPassword);

// reset password
router.patch('/resetPassword/:token', resetPassword);

// restore user by email and password
router.patch('/restoreMe', restoreMe);

// PROTECTED

// authentication required for routes below
router.use(protect);

// update password
router.patch('/updateMyPassword', updatePassword);

// get
router.get('/me', getMe, getSingleUser);

// update currently logged user data
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);

// delete currently logged user
router.delete('/deleteMe', deleteMe);

// RESTRICTED

// routes for admin manipulations
router.use(restrictTo('admin'));

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
