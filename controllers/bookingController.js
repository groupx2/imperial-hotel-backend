const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Room = require('../models/roomModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require("./../utils/appError");
 

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked room
  const room = await Room.findById(req.params.roomId);
  //console.log(room);



  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'lkr',
          product_data: {
            name: `Room Number: ${room.roomNumber}`,
            images: [`${req.protocol}://${req.get('host')}/img/roomCategories/${room.roomCategory.photo}`,`${req.protocol}://${req.get('host')}/img/rooms/${room.images}`],
          },
          unit_amount: room.roomCategory.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `https://imperial-hotel.netlify.app` || `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.roomId,
    metadata: {
      checkIn: req.query.checkIn,
      checkOut: req.query.checkOut
    }
  });


  

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

//  exports.createBookingCheckout = catchAsync(async session => {
//   const room = session.client_reference_id;
//   const user = (await User.findOne({ email: session.customer_email })).id;
//   const price = session.display_items[0].amount;
//   await Booking.create({ room, user, price });
// });

const createBookingCheckout = async session => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const price = session.display_items[0].amount / 100;
  const room = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const {checkIn,checkOut} = session.metadata;
  await Booking.create({ room, user, price,checkIn,checkOut });
  await Room.findByIdAndUpdate(room,{checkIn,checkOut});
 
};


exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};



exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
