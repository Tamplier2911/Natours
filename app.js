const express = require('express');
const path = require('path');

// request status logger
const morgan = require('morgan');

// rate limiting | security headers
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// data sanitization
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// avoiding parameter polution
const hpp = require('hpp');

// cookie parser middleware
const cookieParser = require('cookie-parser');

// text compression
const compression = require('compression');

// cross origin request sharing
const cors = require('cors');

// error handlers
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// webhook handler
const { getWebhookCheckout } = require('./controllers/bookingController');

// our app instance
const app = express();

// trust proxy
app.enable('trust proxy');

// html rendering engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES

// implemeting cross-origin resource sharing for simple-requests on all routes
// Access-Control-Allow-Origin
app.use(cors());

// implementing simple request cross-origin for specific route
// app.use(cors({ origin: 'https://natours-live-s.herokuapp.com/' }));

// respond to OPTIONS request with Access-Control-Allow-Origin header
// implementing non-simple request cross-origin for all routes
app.options('*', cors());

// respond to OPTIONS with Access-Control-Allow-Origin only to specific route
// implementing non-simple request cross-origin for specific route
// preflight phase can be done ONLY on this route
// app.options('/api/v1/tours/:id', cors());

// serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

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

// parse body in raw format
// requires data in raw format
app.post('/webhook-checkout', express.raw(), getWebhookCheckout);

// body parser (parse data from body into req.body as JSON)
app.use(express.json({ limit: '10kb' }));
// parse data from urlencoded FORM
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
// cookie parser (parses data from cookie)
app.use(cookieParser());

// data sanitization against NoSQL query injections
app.use(mongoSanitize());

// data sanitization against XSS (cross site scripting) attacks
app.use(xss());

// preventing http parameter polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// text compression middleware
app.use(compression());

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // CONSOLE LOG COOKIES ON EACH REQUEST
  // console.log(req.cookies);
  next();
});

// ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRoutes);

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
