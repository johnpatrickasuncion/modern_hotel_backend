const mongoose = require('mongoose');

/**
 * Defines the schema for a Booking entity.
 * It links to the Guest and Room models using their ObjectId references.
 */
const bookingSchema = new mongoose.Schema({
    guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest', // Reference to the Guest model
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room', // Reference to the Room model
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

// Ensures checkOut is after checkIn (basic validation)
bookingSchema.path('checkOut').validate(function(value) {
    return value > this.checkIn;
}, 'Check-out date must be after check-in date.');

module.exports = mongoose.model('Booking', bookingSchema);
