const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
// const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObject = (obj, ...allowedFields) => {
  const filtered = {};

  Object.keys(obj).forEach(field => {
    if (allowedFields.includes(field)) {
      filtered[field] = obj[field];
    }
  });

  return filtered;
};

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Get All Users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  // BUILD THE QUERY
  // const features = new APIFeatures(User.find(), req.query)
  //   .filter()
  //   .sort()
  //   .limit()
  //   .paginate();

  // EXECUTE THE QUERY (await)
  // const users = await features.query;

  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // if user trying to update password - throw error
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'You cannot update password on this route, please use /updateMyPassword.',
        400
      )
    );
  }

  // filter request body in case of avoiding unwanted fields
  const filteredBody = filterObject(req.body, 'name', 'email', 'photo');

  // find user by id and update document using filtered body
  const userID = req.user._id;
  const updatedUser = await User.findByIdAndUpdate(userID, filteredBody, {
    new: true,
    runValidators: true
  });

  // send response with updated user
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.restoreMe = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  const currentUser = await User.findOne({ email: email })
    .select('+password')
    .select('+active');

  if (
    !currentUser ||
    !(await currentUser.correctPassword(password, currentUser.password)) ||
    currentUser.active === true
  ) {
    return next(
      new AppError('Incorrect email or password or user is active.', 401)
    );
  }

  const restoredUser = await User.findByIdAndUpdate(currentUser._id, {
    active: true
  });

  const token = signToken(currentUser._id);

  // THINK ON REFACTORING THIS INTO SEPARATE FUNCTION

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(201).json({
    status: 'success',
    token: token,
    message: 'Your account successfully restored.',
    data: {
      user: {
        name: restoredUser.name,
        email: restoredUser.email
      }
    }
  });

  /////////////////////////////////////////////////////////
});

exports.createNewUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.getSingleUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
