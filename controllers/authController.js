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
    // use following in order to play with pass change data   !!! IMPORTANT
    // or let user set role when signing up
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      // user: newUser
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        // use following in order to play with pass change data !!! IMPORTANT
        // or let user set role when signing up
        passwordChangedAt: newUser.passwordChangedAt,
        role: newUser.role
      }
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
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYjFiMGFjYTBhOW...
  // console.log(token);
  // { id: '5db1b0aca0a9f72504ef5eb9', iat: 1572020435, exp: 1579796435 }
  // console.log(decoded);

  // Check if user still exists.
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('User with that ID is no longer exists.', 401));
  }

  // Check if user changed password after then token was issued.
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    // if roles not includes user.role of 'admin' or 'lead-guide' - throw error
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have premission to perform this action.', 403)
      );
    }
    next();
  };
};
