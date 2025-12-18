const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.js');

// All routes are prefixed with /api/rooms

router.route('/')
    .get(roomController.getRooms)   // GET all rooms
    .post(roomController.createRoom); // POST a new room

router.route('/:id')
    .get(roomController.getRoom)    // GET a single room
    .put(roomController.updateRoom)  // UPDATE a room
    .delete(roomController.deleteRoom); // DELETE a room

module.exports = router;
