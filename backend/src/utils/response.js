// Standard Success Response
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

// Standard Error Response
const errorResponse = (res, message = 'Something went wrong', statusCode = 500, error = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: error ? error.message || error : null
    });
};

module.exports = {
    successResponse,
    errorResponse
};
