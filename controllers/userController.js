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
