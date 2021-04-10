
const Room = require('../models/roomModel');
const RoomCategory = require('../models/roomCategoryModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const { query } = require('express');

const multer = require('multer');
const sharp = require('sharp');

const {promisify} = require("util");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadRoomImages = upload.single('images');

exports.resizeRoomImages = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `room-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/rooms/${req.file.filename}`);

    req.body.images = req.file.filename;  

  next();
});

exports.getAvailabeRooms = catchAsync(async (req,res,next) => {
  res.cookie('jwt', "token", {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: "none",
    domain: ''
  });
     req.query = Object.assign(req.query,{$or: [{"checkOut" : { lt : Date.now() }},{"checkOut" : { $eq : null}}]});
     next();
});

exports.getAvailabeRoomCategories = catchAsync(async (req, res, next) => {
  const availableRooms = await Room.aggregate([
    {
     $match:{$or: [{"checkOut" : { $lt : Date.now() }},{"checkOut" : { $eq : null}}]}
    },
    {
      $group: {
         _id: "$roomCategory",
         numAvailableRooms: { $sum: 1 }
      }
    },
    {
       $sort: { numAvailableRooms: 1 }
    }
  ]).exec(function(err, roomCategories) {
    RoomCategory.populate(roomCategories, {path: '_id'}, function(err, populatedRoomCategories) {
      if (err) next(new AppError('Unexpected error',500));
      try{
        const availableRoomsCategories = populatedRoomCategories.filter(function getFilteredRooms(value) {
          if (!req.query.type) return true;
          return value._id.type.toLowerCase() === req.query.type.toLowerCase();
        })

        res.status(200).json({
          status: 'success',
          results: availableRoomsCategories.length,
          data: {
            availableRoomsCategories
          }
        });
      } catch(err) {
        res.status(500).json({
          status: 'fail'
        });
      }  
    });
});;

// res.status(200).json({
//   status: 'success',
//   results: availableRooms.length,
//   data: {
//     availableRooms
//   }
// });
  
  
});


function getFilteredRooms(value) {
  return value._id.type === "Single";
}

exports.getAllRooms = factory.getAll(Room);
exports.getRoom = factory.getOne(Room);
exports.createRoom = factory.createOne(Room);
exports.updateRoom = factory.updateOne(Room);
exports.deleteRoom = factory.deleteOne(Room);
