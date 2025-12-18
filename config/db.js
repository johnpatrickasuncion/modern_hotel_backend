// ...existing code...
const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error('MONGO_URI environment variable is not set');
    }

    // Reuse existing connection in serverless environments
    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }
    if (global._mongoosePromise) {
        return global._mongoosePromise;
    }

    global._mongoosePromise = mongoose.connect(uri)
        .then(conn => {
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return mongoose;
        })
        .catch(err => {
            console.error('MongoDB connection failed:', err);
            global._mongoosePromise = null;
            throw err;
        });

    return global._mongoosePromise;
};

module.exports = connectDB;
// ...existing code...