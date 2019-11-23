const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // Get tour data from collection
  const tours = await Tour.find();

  // Build template

  // Render that template using tour data.
  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours
  });
});

exports.getTour = (req, res, next) => {
  res.status(200).render('tour', {
    title: 'Forest Hiker Tour'
  });
};
