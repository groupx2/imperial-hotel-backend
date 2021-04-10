const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet')
const path = require('path');



const AppError = require("./utils/appError");
const errorHandler = require("./controllers/errorController");

const userRouter = require("./routes/userRoutes");
const roomRouter = require("./routes/roomRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const roomCategoryRouter = require("./routes/roomCategoryRoutes");
const viewRouter = require("./routes/viewRoutes");


var MongoClient = require('mongodb').MongoClient;


app.set('trust proxy');

const corsOptions = {
  origin: ['https://imperial-hotel.netlify.app','https://imperial-hotel.netlify.app/login','https://groupx2.github.io'],
  methods: ["POST,GET,PATCH"],
  credentials: true,
};

app.use(cors(corsOptions));

app.options('*', cors()) ;

app.set('view engine', 'ejs');

app.use(express.static(`${__dirname}/public`));


app.use(helmet());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(compression());







app.post("/enquiries", function (req, res) {
  const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
  MongoClient.connect(DB, function (err, db) {
    if (err) throw err;
    var dbo = db.db("hotel_db");
    dbo.collection("contactUs").insertOne(req.body, function (err, res) {
      if (err) throw err;
      db.close();
    });
    res.end();
  });

  
});

app.use('/api/rooms', roomRouter);
app.use('/api/users', userRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/roomCategories', roomCategoryRouter);
app.use('/', viewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't fid ${req.originalUrl} on this server`, 404));
});


app.use(errorHandler);

module.exports = app;
