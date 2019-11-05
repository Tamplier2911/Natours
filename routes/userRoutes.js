const express = require('express');
const {
  getAllUsers,
  updateMe,
  deleteMe,
  restoreMe,
  createNewUser,
  getSingleUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const {
  protect,
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword
} = require('./../controllers/authController');

const router = express.Router();

// signup
router.post('/signup', signup);

// login
router.post('/login', login);

// forgot password
router.post('/forgotPassword', forgotPassword);

// reset password
router.patch('/resetPassword/:token', resetPassword);

// update password
router.patch('/updateMyPassword', protect, updatePassword);

// update currently logged user data
router.patch('/updateMe', protect, updateMe);

// delete currently logged user
router.delete('/deleteMe', protect, deleteMe);

// restore user by email and password
router.patch('/restoreMe', restoreMe);

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
