const factory = require('./handlerFactory');

const RoomCategory = require('../models/roomCategoryModel');
const catchAsync = require('../utils/catchAsync');

const multer = require('multer');
const sharp = require('sharp');

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

exports.uploadRoomCategoryPhoto = upload.single('photo');

exports.resizeRoomCategoryPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `roomCategory-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/roomCategories/${req.file.filename}`);

    req.body.photo = req.file.filename;  

  next();
});

exports.getAllRoomCategories = factory.getAll(RoomCategory);
exports.getRoomCategory = factory.getOne(RoomCategory);
exports.createRoomCategory = factory.createOne(RoomCategory);
exports.updateRoomCategory = factory.updateOne(RoomCategory);
exports.deleteRoomCategory = factory.deleteOne(RoomCategory);