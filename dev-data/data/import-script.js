const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel.js');

dotenv.config({ path: '../../config.env' });

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connected successfully!'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    // if not using {} it will accept array of objects
    await Tour.create(tours);
    console.log('Data successfully loaded.');
  } catch (err) {
    // error handling
    console.log(err);
  }
  // agressive way of stopping app
  process.exit();
};

// CEAN UP ALL DOCUMENTS IN A COLLECTION
const deleteData = async () => {
  try {
    // delete all data from collection
    await Tour.deleteMany();
    console.log('Data successfully deleted.');
  } catch (err) {
    // error handling
    console.log(err);
  }
  // agressive way of stopping app
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
