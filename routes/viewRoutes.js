const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');


const router = express.Router();



router.get('/login',  (req, res) => {
  res.render("login");
}
);



module.exports = router;
