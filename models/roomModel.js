const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const roomSchema = new mongoose.Schema(
  {
    slug: String,
    roomNumber: {
      type: Number,
      unique: true,
      required: [true, 'A room must have a room number']
    },
    images: String, 
    checkIn: Date,
    checkOut: Date,
    roomCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'RoomCategory',
    required: [true, 'Room must belong to a Category!']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


roomSchema.pre(/^find/, function(next) {
  this.populate('roomCategory').populate();
  next();
});








const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
