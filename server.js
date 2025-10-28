require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
// Allow configured FRONTEND_URL in production. In development (no FRONTEND_URL) allow the request origin
const FRONTEND_URL = process.env.FRONTEND_URL;
const corsOrigin = FRONTEND_URL || (process.env.NODE_ENV !== 'production' ? true : 'https://college-guide-frontend.onrender.com');
app.use(cors({
    origin: corsOrigin,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main page for all routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

// Database connection
// Prefer MONGODB_URI from env for security. If not present, fall back to the repo's sample URI.
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://vikashbhandari367:5Vikash~12@collegeguide.kj0brla.mongodb.net/college-guide?retryWrites=true&w=majority';
console.log(`Using MongoDB URI from ${process.env.MONGODB_URI ? 'environment' : 'fallback (hardcoded)'} - not printing credentials`);

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000, // Increase timeout to 60 seconds
    socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
    connectTimeoutMS: 60000, // Connection timeout
    retryWrites: true,
    w: 'majority'
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'https://college-guide-frontend.onrender.com'}`);
});



