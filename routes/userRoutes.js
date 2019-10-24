const express = require('express');
const {
  getAllUsers,
  createNewUser,
  getSingleUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const { signup, login } = require('./../controllers/authController');

const router = express.Router();

// signup
router.post('/signup', signup);

// login
router.post('/login', login);

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
