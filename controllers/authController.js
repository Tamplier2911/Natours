const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// new email class
const Email = require('../utils/email');

// old email function
// const sendEmail = require('../utils/email');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token: token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    // photo: req.body.photo || 'https://bit.ly/2oa8ScE',
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm

    // use following in order to play with pass change data   !!! IMPORTANT
    // or let user set role when signing up
    // passwordChangedAt: req.body.passwordChangedAt,
    // role: req.body.role
  });

  // defining url
  const url = `${req.protocol}://${req.get('host')}/user`;
  // creating instance of Email with current user and url
  const sendEmail = new Email(newUser, url);
  // sending emal
  await sendEmail.sendWelcome();

  // await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  // check if user exist && password is correct
  const user = await User.findOne({ email: email }).select('+password');
  // const correct = await user.correctPassword(password, user.password);

  // return error if user not found or password is not correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  // create sign jwt - sent jwt token
  createSendToken(user, 200, res);
});

// sending empty JWT in order to rewrite one that currently in browser and perform logout
exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    msg: 'You have logged out securely.'
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // Get token and check if it exists.
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  // Get token and check if it exists.
  if (req.cookies.jwt) {
    try {
      // Verification of token. If token correct -returns object with id of the user.
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // Check if user still exists.
      const currentUser = await User.findById(decoded.id);

      // if no just go to next middleware
      if (!currentUser) {
        return next();
      }

      // Check if user changed password after then token was issued.
      if (currentUser.changePasswordAfter(decoded.iat)) {
        // if did just go to next middleware
        return next();
      }

      // if we get here - We have a logged in user
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on POSTed email.
  const currentUser = await User.findOne({ email: req.body.email });
  if (!currentUser) {
    next(new AppError('User with that email address does not exists.', 404));
  } else {
    // Generate random token.
    const resetToken = currentUser.createPasswordResetToken();

    // Saving all changes from this.resetToken this.tokenExpires, deactivate all validators
    await currentUser.save({ validateBeforeSave: false });

    /*

    // Send token as an email.
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    */

    const url = `${req.protocol}://${req.get('host')}/reset`;

    /*

    const message = `
    Your email was requested for password reset. 
    If this wasn't you - just ignore this message.

    Else send new password and password confirm to - 
    ${resetURL}`;

    */

    try {
      // create instance of email with current user and reset url
      const sendEmail = new Email(currentUser, url, { resetToken: resetToken });

      // perform password reset method on email instance
      await sendEmail.sendPasswordReset();

      /*

      await sendEmail({
        email: req.body.email,
        subject: 'Your password reset token (valid for 10 min)',
        message: message
      });

      */

      res.status(200).json({
        status: 'success',
        message: 'Reset token was sent to email!'
      });
    } catch (err) {
      currentUser.passwordResetToken = undefined;
      currentUser.passwordResetExpired = undefined;
      await currentUser.save({ validateBeforeSave: false });

      return next(
        new AppError('Error occured, when tryed to send email. Try again.', 500)
      );
    }
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const currentUser = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() }
  });

  // Set new password if token not expired and user exists
  if (!currentUser) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  currentUser.password = req.body.password;
  currentUser.passwordConfirm = req.body.passwordConfirm;
  currentUser.passwordResetToken = undefined;
  currentUser.passwordResetExpired = undefined;
  await currentUser.save();

  // Update passwordChangedAt property ( inside of userModel as pre middleware)

  // Log the user in, send JWT
  createSendToken(currentUser, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { passwordCurrent, newPassword, newPasswordConfirm } = req.body;

  // Get user from collection. We passing user object from protect.
  // const userIDTest = req.user._id;
  const userID = req.user._id;
  const currentUser = await User.findById(userID).select('+password');

  // Check if posted password is correct.
  if (
    !currentUser ||
    !(await currentUser.correctPassword(passwordCurrent, currentUser.password))
  ) {
    return next(new AppError('Your password is incorrect.', 401));
  }

  // If so, update password.
  currentUser.password = newPassword;
  currentUser.passwordConfirm = newPasswordConfirm;
  await currentUser.save();

  // Log in user with new JWT.
  createSendToken(currentUser, 200, res);
});
