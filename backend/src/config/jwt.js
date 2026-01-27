const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'your_super_secret_key_for_dev';
const EXPIRES_IN = '1d'; // Token validity

// Generate JWT Token
const generateToken = (user) => {
    // Payload includes user ID and role for quick access in permission checks
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: EXPIRES_IN }
    );
};

// Verify JWT Token
const verifyToken = (token) => {
    return jwt.verify(token, SECRET_KEY);
};

module.exports = {
    generateToken,
    verifyToken,
    SECRET_KEY
};
