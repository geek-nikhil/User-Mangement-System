const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./src/middleware/error.middleware');

// Import Routes
const authRoutes = require('./src/middleware/routes/auth.routes');
const userRoutes = require('./src/middleware/routes/user.routes');
const productRoutes = require('./src/middleware/routes/product.routes');
const transactionRoutes = require('./src/middleware/routes/transaction.routes');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Routes
// We prefix all API routes with /api
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send({ message: 'API is running...' });
});

// Error Handling Middleware (Should be last)
app.use(errorHandler);

module.exports = app;
