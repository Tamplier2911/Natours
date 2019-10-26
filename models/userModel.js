const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email must match validation.']
  },
  photo: {
    type: String,
    default: 'https://bit.ly/2oa8ScE',
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please enter your password.'],
    minlength: [8, 'Password must have at least 8 characters.'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    // keep in mind, that this is ONLY going to work on create and save.
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Confirmation password must match original.'
    }
  },
  passwordChangedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// instance method, available on all docs of this collection
// this points to current document (if selected)
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // if JWT less than Changed - then return true (password was changed)
    // if JWT greater than Changed - then return false (password was not changed before issuing)
    return JWTTimestamp < changedTimestamp;
  }

  // false means password has not been changed
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
