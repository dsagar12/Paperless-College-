// server/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db/connect');

// Import routes
const candidateRoutes = require('./routes/candidates');
const electionRoutes = require('./routes/elections');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
connectDB();

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('College Election System API');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal Server Error' 
  });
});

// Server Configuration
const PORT = process.env.PORT || 5000;

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});