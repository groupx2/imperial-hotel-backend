const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: [true, 'Booking must belong to a Room!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  },
  checkIn: {
    type: Date,
    required: [true,'Booking must have a checkIn Date']
  },
  checkOut: {
    type: Date,
    required: [true,'Booking must have a checkOut Date']
  },
  numberOfCustomer: {
    type: Number,
    default: 1
  }
});



bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate('room');
  next();
});



const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
