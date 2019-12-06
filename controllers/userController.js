const multer = require('multer');
const sharp = require('sharp');

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// handlers
const {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne
} = require('./handlerFactory');

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
exports.getAllUsers = getAll(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

// MULTER CONFIGURATION - IMAGE PROCESSING

/*

// storage properties - SAVING STRIGHT TO THE DISC
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    // user - userID - timestamp - extension
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
  }
});

*/

// storage properties - SAVING IN MEMORY BUFFER
const multerStorage = multer.memoryStorage();

// filter rpoperties. Is file image?
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('File must be an image.', 400), false);
  }
};

// user properties for upload
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// Phtoto upload middleware for /updateMe route
exports.uploadUserPhoto = upload.single('photo');

// Photo resizing and conversion
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// Update logged in User
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file); - ref to file object
  // console.log(req.body); - ref to body
  // console.log(req.user); - ref to user object from protect
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
  const filteredBody = filterObject(req.body, 'name', 'email');

  // if we have req.file from multer middleware
  // we store filename as a photo property
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }

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

// Remove logged in User
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Restore logged in User
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

// actions to perform by admin

// get single user by id
exports.getSingleUser = getOne(User);

// create user
exports.createNewUser = createOne(User);

// delete user using id
exports.deleteUser = deleteOne(User);

// update user using id - do NOT update pw with this.
exports.updateUser = updateOne(User);
