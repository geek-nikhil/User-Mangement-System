const { verifyToken } = require('../config/jwt');
const { errorResponse } = require('../utils/response');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Bearer <token>
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return errorResponse(res, 'Access Denied: No Token Provided', 401);
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return errorResponse(res, 'Invalid or Expired Token', 403);
    }
};

module.exports = authenticateToken;
