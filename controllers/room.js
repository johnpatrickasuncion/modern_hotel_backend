const Room = require('../models/room.js');

// @desc    Get all rooms
// @route   GET /api/rooms
exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
exports.getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new room
// @route   POST /api/rooms
exports.createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (error) {
        // Handle duplicate key error (room number)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Room number already exists' });
        }
        res.status(400).json({ message: 'Invalid room data', error: error.message });
    }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true // Ensure schema validation runs on update
        });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json(room);
    } catch (error) {
        res.status(400).json({ message: 'Invalid update data', error: error.message });
    }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json({ message: 'Room removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
