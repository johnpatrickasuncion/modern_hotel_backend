const mongoose = require('mongoose');

/**
 * Defines the schema for a Guest entity.
 * Email is required and must be unique.
 */
const guestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'] // Basic email validation
    },
    phone: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);
