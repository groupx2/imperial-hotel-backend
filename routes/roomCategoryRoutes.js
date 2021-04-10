const express = require('express');


const roomCategoryController = require('./../controllers/roomCategoryController');
const authController = require('./../controllers/authController');


const router = express.Router();

router.route('/')
.get(roomCategoryController.getAllRoomCategories)
.post(roomCategoryController.createRoomCategory);


router.route('/:id')
.get(roomCategoryController.getRoomCategory)
.patch(authController.protect,
    authController.restrictTo('admin'),
    roomCategoryController.uploadRoomCategoryPhoto,
    roomCategoryController.resizeRoomCategoryPhoto,
    roomCategoryController.updateRoomCategory)
.delete(roomCategoryController.deleteRoomCategory);

module.exports = router;