const AppError = require('./../utils/appError');

// Invalid ID - wwww
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Duplicates
const handleDuplicateFieldDB = err => {
  const duplicate = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${duplicate}. Please use another value.`;
  return new AppError(message, 400);
};

// Validations
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// JWT Error
const handleJWTError = err => {
  const message = `${err.message[0].toUpperCase()}${err.message.slice(
    1
  )}, please log in again.`;
  return new AppError(message, 401);
};

// JWT Exired
const handleJWTExired = err => {
  const message = `${err.message.toUpperCase().slice(0, 3)} ${err.message.slice(
    4
  )}, please try to relog.`;
  return new AppError(message, 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, truested error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programmatic or other unknown error: don't leak error details
  } else {
    // 1) Log error
    // console.error('ERROR ಥ_ಥ', err);
    console.error('ERROR ಥ_ಥ -', err.name, err.message);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Oops! How unfortunate!'
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack); <-- stack trace
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Take copy of original error object, and work with it since now
    let error = JSON.parse(JSON.stringify(err));
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
      sendErrorProd(error, res);
    } else if (error.code === 11000) {
      error = handleDuplicateFieldDB(error);
      sendErrorProd(error, res);
    } else if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
      sendErrorProd(error, res);
    } else if (err.name === 'JsonWebTokenError') {
      error = handleJWTError(error);
      sendErrorProd(error, res);
    } else if (err.name === 'TokenExpiredError') {
      error = handleJWTExired(error);
      sendErrorProd(error, res);
    } else {
      sendErrorProd(err, res);
    }
  }
};
