const Tour = require('../models/tourModel');
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

// 127.0.0.1:3000/api/v1/tours?limit=5&sort=-ratingsAverage,price&price[lt]=1000
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,description,difficulty';
  req.query.price = { lt: 1000 };
  next();
};

// Get All Tours
exports.getAllTours = getAll(Tour);

// Get Single Tour
exports.getSingleTour = getOne(Tour, 'reviews');

// Add New Tour
exports.addNewTour = createOne(Tour);

// Update Tour
// Not completely replaces, but uses PATCH method
// to update already exsisting fields
exports.updateTour = updateOne(Tour);

// Remove Tour
exports.deleteTour = deleteOne(Tour);

// Get Tours Within
// '/tours-within/:distance/center/:latlng/unit/:unit'
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // in order to get radians we need to divide distance by radius of earth
  const radius = unit === 'mi' ? distance / 3958.8 : distance / 6371;

  if (!lat || !lng) {
    next(
      new AppError(
        'Coordinates must be provided in format - "lat,lng". Units in format - "km" or "mi".'
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

// Aggregation PipeLine
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    // stages
    {
      $match: { ratingsAverage: { $gte: 4.4 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats: stats
    }
  });
});

// Aggregation PipeLine - Busiest month of the year
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021
  // const stats = 2;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: {
          $month: '$startDates'
        },
        numTourStarts: {
          $sum: 1
        },
        tours: { $push: `$name` }
      }
    },
    {
      $addFields: {
        month: '$_id'
      }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        numTourStarts: -1
      }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan: plan
    }
  });
});

// Agregation Pipeline - calculate disnce from certain point to all tour start points
exports.getDistance = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Coordinates must be provided in format - "lat,lng". Units in format - "km" or "mi".'
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        name: 1,
        distance: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});
