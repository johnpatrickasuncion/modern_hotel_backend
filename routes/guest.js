const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.js');

// All routes are prefixed with /api/guests

router.route('/')
    .get(guestController.getGuests)   // GET all guests
    .post(guestController.createGuest); // POST a new guest

router.route('/:id')
    .get(guestController.getGuest)    // GET a single guest
    .put(guestController.updateGuest)  // UPDATE a guest
    .delete(guestController.deleteGuest); // DELETE a guest

module.exports = router;
