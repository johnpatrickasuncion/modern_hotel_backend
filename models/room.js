const mongoose = require('mongoose');

/**
 * Defines the schema for a Room entity.
 * Status is an enum to ensure consistency: 'available' or 'occupied'.
 */
const roomSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Single', 'Double', 'Suite', 'Deluxe'] // Restricting room types
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available'
    }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
