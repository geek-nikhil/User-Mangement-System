const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log for debugging

    // Standardize error message
    const message = err.message || 'Internal Server Error';
    const statusCode = err.status || 500;

    return errorResponse(res, message, statusCode, err);
};

module.exports = errorHandler;
