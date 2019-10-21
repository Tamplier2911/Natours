const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name.'],
    trim: true,
    maxlength: [40, 'Name must not consists of more than 40 characters.'],
    minlength: [2, 'Name must consists of 2 characters or more.']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail(), 'Email must match validation.']
  },
  photo: {
    type: String,
    default: 'https://bit.ly/2oa8ScE',
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please enter your password.'],
    minlength: [8, 'Password must have at least 8 characters.']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
