const { errorResponse } = require('../utils/response');

const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(res, 'Unauthorized', 401);
        }

        if (!roles.includes(req.user.role)) {
            return errorResponse(res, 'Access Denied: Isufficient Permissions', 403);
        }

        next();
    };
};

module.exports = authorizeRole;
