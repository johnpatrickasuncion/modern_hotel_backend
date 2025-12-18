const Guest = require('../models/guest.js');

// @desc    Get all guests
// @route   GET /api/guests
exports.getGuests = async (req, res) => {
    try {
        const guests = await Guest.find();
        res.status(200).json(guests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single guest by ID
// @route   GET /api/guests/:id
exports.getGuest = async (req, res) => {
    try {
        const guest = await Guest.findById(req.params.id);
        if (!guest) {
            return res.status(404).json({ message: 'Guest not found' });
        }
        res.status(200).json(guest);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new guest
// @route   POST /api/guests
exports.createGuest = async (req, res) => {
    try {
        const guest = await Guest.create(req.body);
        res.status(201).json(guest);
    } catch (error) {
        // Handle duplicate key error (email)
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email address already registered' });
        }
        res.status(400).json({ message: 'Invalid guest data', error: error.message });
    }
};

// @desc    Update a guest
// @route   PUT /api/guests/:id
exports.updateGuest = async (req, res) => {
    try {
        const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!guest) {
            return res.status(404).json({ message: 'Guest not found' });
        }
        res.status(200).json(guest);
    } catch (error) {
        // Handle duplicate key error (email) on update
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email address already in use by another guest' });
        }
        res.status(400).json({ message: 'Invalid update data', error: error.message });
    }
};

// @desc    Delete a guest
// @route   DELETE /api/guests/:id
exports.deleteGuest = async (req, res) => {
    try {
        const guest = await Guest.findByIdAndDelete(req.params.id);
        if (!guest) {
            return res.status(404).json({ message: 'Guest not found' });
        }
        res.status(200).json({ message: 'Guest removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
