const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const roomCategorySchema = new mongoose.Schema(
  {
    slug: String,
    name: {
      type: String,
      required: [true, 'A roomCategory must have a room number']
    },
    photo: String,
    price: {
      type: Number,
      required: [true, 'A roomCategory must have a price']
    },
    type: {
        type: String,
        enum: ['Single','Double','Triple'],
        default: 'Single',
        required: [true,'A roomCategory must have a type']
      },
    description: {
        type: String,
        trim: true
      },
    amenity: [String]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);


roomCategorySchema.index({ price: 1 });



const RoomCategory = mongoose.model('RoomCategory', roomCategorySchema);

module.exports = RoomCategory;
