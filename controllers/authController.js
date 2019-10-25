const { promisify } = require('util');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo || 'https://bit.ly/2oa8ScE',
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      // user: newUser
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  // check if user with exist && password is correct
  const user = await User.findOne({ email: email }).select('+password');
  // const correct = await user.correctPassword(password, user.password);

  // return error if user not found or password is not correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  // create sign jwt
  const token = signToken(user._id);

  // if everything is matching - sent jwt token
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Get token and check if it exists.
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You have to login, in order to view this route.', 401)
    );
  }

  // Verification of token. If token correct -returns object with id of the user.
  // { id: '5db1b0aca0a9f72504ef5eb9', iat: 1572020435, exp: 1579796435 }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log(token);
  console.log(decoded);

  // Check if user still exists.

  // Check if user changed password after then token was issued.

  next();
});
