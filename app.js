const express = require('express');

const app = express();
const morgan = require('morgan');

// rate limiting | security headers
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// data sanitization
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// error handlers
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// GLOBAL MIDDLEWARES

// security http headers
app.use(helmet());

// dev logger feature
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// rate-limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in a hour.'
});

app.use('/api', limiter);

// body parser (read data from body into req.body)
app.use(express.json({ limit: '10kb' }));

// data sanitization against NoSQL query injections
app.use(mongoSanitize());

// data sanitization against XSS (cross site scripting) attacks
app.use(xss());

// serving static files
app.use(express.static(`${__dirname}/public`));

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// HANDLING UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  const error = new AppError(
    `Can't find ${req.originalUrl} route on this server.`,
    404
  );

  next(error);
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
