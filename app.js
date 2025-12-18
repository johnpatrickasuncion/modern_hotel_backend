const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser'); 
const connectDB = require('./config/db');

// Route files
const roomRoutes = require('./routes/room.js');
const guestRoutes = require('./routes/guest.js');
const bookingRoutes = require('./routes/booking.js');

dotenv.config();
const app = express();

// --- 🔒 CORS Configuration ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://hmsluxe.vercel.app" // 🚀 FIXED: Removed the trailing slash "/"
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps)
        if (!origin) return callback(null, true); 
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            console.log("Blocked by CORS: ", origin); // Helpful for debugging
            return callback(new Error('Not allowed by CORS'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 204
};

// --- 🛠️ MIDDLEWARE ORDER (CRITICAL) ---
// 1. CORS MUST be first to handle Preflight (OPTIONS) requests
app.use(cors(corsOptions)); 

// 2. Body Parsers
app.use(express.json());
app.use(bodyParser.json());

// --- 📍 ROUTES ---
app.get('/', (req, res) => {
    res.send('<h1>🏨 Hotel Management API is running!</h1>');
});

app.use('/api/rooms', roomRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/bookings', bookingRoutes);

// --- 🚀 SERVER START (Fixed for Vercel) ---
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    const startServer = async () => {
        try {
            await connectDB();
            app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
        } catch (err) {
            console.error('Failed to connect to database:', err.message);
        }
    };
    startServer();
} else {
    // For Vercel Production, just connect to DB
    connectDB();
}

// ALWAYS export the app
module.exports = app;