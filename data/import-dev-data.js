const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const RoomCategory = require('./../models/roomCategoryModel');
const Room = require("./../models/roomModel");

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
const roomCategories = JSON.parse(fs.readFileSync(`${__dirname}/roomCategories.json`, 'utf-8'));
const rooms = JSON.parse(fs.readFileSync(`${__dirname}/rooms.json`, 'utf-8'));
//const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
// );

// IMPORT DATA INTO DB
const importData = async () => {
  try {
  //  await RoomCategory.create(roomCategories);
    await Room.create(rooms);
    // await User.create(users, { validateBeforeSave: false });
    // await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Room.deleteMany();
    await RoomCategory.deleteMany();
    //await User.deleteMany();
    //await Review.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
