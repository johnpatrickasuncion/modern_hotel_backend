const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.js');

// All routes are prefixed with /api/bookings

router.route('/')
    .get(bookingController.getBookings)   // GET all bookings
    .post(bookingController.createBooking); // POST a new booking

router.route('/:id')
    .get(bookingController.getBooking)    // GET a single booking
    .put(bookingController.updateBooking)  // UPDATE a booking
    .delete(bookingController.deleteBooking); // DELETE a booking

module.exports = router;
