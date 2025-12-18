const Booking = require('../models/booking.js');
const Room = require('../models/room.js');

// Helper function to update room status
const updateRoomStatus = async (roomId, status) => {
    await Room.findByIdAndUpdate(roomId, { status });
};

// @desc    Get all bookings (with populated references)
// @route   GET /api/bookings
exports.getBookings = async (req, res) => {
    try {
        // Use populate to fetch actual guest and room details
        const bookings = await Booking.find()
            .populate('guestId', 'name email phone') // Select specific guest fields
            .populate('roomId', 'number type price'); // Select specific room fields
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('guestId', 'name email phone')
            .populate('roomId', 'number type price');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new booking and set room status to 'occupied'
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
    // FIX: Explicitly destructure all required fields, including guestId
    try{ 
    const { guestId, roomId, checkIn, checkOut } = req.body; 
        const newBooking = await Booking.create(req.body);

        await updateRoomStatus(roomId, 'occupied');
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(400).json({ message: 'Invalid booking data or schema mismatch', error: error.message });
    }


    try {
        // 1. Check if the room is available
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
         if (!room || room.status !== 'available') {
             return res.status(200).json({ message: 'Room is not available for booking' });
        }

        // 2. Create the booking (passing the entire validated req.body)
        const newBooking = await Booking.create(req.body);

        // 3. Update room status to occupied
        await updateRoomStatus(roomId, 'occupied');
        
        // 4. Return the new booking object (populated for context)
        const populatedBooking = await newBooking.populate('guestId', 'name email').populate('roomId', 'number type price');

        res.status(201).json(populatedBooking);

    } catch (error) {
        // Mongoose validation errors end up here
        res.status(400).json({ message: 'Invalid booking data or schema mismatch', error: error.message });
    }
};

// @desc    Update a booking
// @route   PUT /api/bookings/:id
exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Optional: Implement complex logic here to handle status changes (e.g., if status changes to 'checked_out', set room status to 'available')

        const populatedBooking = await booking.populate('guestId', 'name email').populate('roomId', 'number type price');
        res.status(200).json(populatedBooking);
    } catch (error) {
        res.status(400).json({ message: 'Invalid update data', error: error.message });
    }
};

// @desc    Delete a booking and set room status back to 'available'
// @route   DELETE /api/bookings/:id
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Set the room back to available
        await updateRoomStatus(booking.roomId, 'available');

        res.status(200).json({ message: 'Booking cancelled and room status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
