const express = require('express');
const {
  getAllUsers,
  createNewUser,
  getSingleUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const { signup } = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', signup);

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
