const express = require('express');
const roomController = require('./../controllers/roomController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', roomController.checkID);

// POST /room/234fad4/reviews
// GET /room/234fad4/reviews

//router.use('/:roomId/reviews', reviewRouter);



router.route('/availableRoomCategories').get(roomController.getAvailabeRoomCategories);
router.route('/availableRooms').get(roomController.getAvailabeRooms,roomController.getAllRooms);
//router.route('/getStats').get(roomController.getStats);

router
  .route('/')
  .get(roomController.getAllRooms)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    roomController.createRoom
  );

router
  .route('/:id')
  .get(roomController.getRoom)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    roomController.uploadRoomImages,
    roomController.resizeRoomImages,
    roomController.updateRoom
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    roomController.deleteRoom
  );

module.exports = router;
