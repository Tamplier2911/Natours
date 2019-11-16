const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

// const User = require('./userModel');

// SCHEMAS
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name.'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'Tour name must have less than or equal to 40 characters.'
      ],
      minlength: [
        10,
        'Tour name must have more than or equal to 10 characters.'
      ]
      // validate: [validator.isAlpha, 'Tour name must only contain characters.']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have duration.']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size.']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty.'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.1'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price.']
    },
    priceDiscout: {
      type: Number,
      validate: {
        validator: function(value) {
          // this ONLY poits to current doc on NEW document creation
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) must be below regular price.'
      }
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary.'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image.']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
      select: false // doublcheck
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    // guides: Array
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexed fields
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

// Virtual Properties
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE pre | post (doc, query, agrr, model)
// document middleware runs before .save() and .create() | NOT including .insertMany()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// IF WE ADDED GUIDES BY EMBEDING
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log('First chained post-save-hook middleware.');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(this.slug);
//   next();
// });

// QUERY MIDDLEWARE pre | post (doc, query, agrr, model)
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  // this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  this.end = Date.now();
  // console.log((this.end - this.start) / 1000);
  next();
});

// AGGREGATION MIDDLEWARE pre | post (doc, query, agrr, model)
tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// MODELS
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;

/*
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997
});

testTour
  .save()
  .then(doc => console.log(doc))
  .catch(err => console.log(err));
*/
