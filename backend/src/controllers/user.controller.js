const userService = require('../services/user.service');
const { successResponse, errorResponse } = require('../utils/response');

// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return successResponse(res, users, 'Users retrieved successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to fetch users', 500, error);
    }
};

// Get Current User Profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From JWT middleware
        const user = await userService.findUserById(userId);
        
        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        return successResponse(res, user, 'Profile retrieved');
    } catch (error) {
        return errorResponse(res, 'Failed to fetch profile', 500, error);
    }
};

// Update User (User editing own profile or Admin)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body }; // Shallow copy to avoid side effects
        
        // Security check: Only allow users to update themselves, OR admins can update anyone
        if (req.user.role !== 'admin' && req.user.id !== id) {
             return errorResponse(res, 'Access Denied', 403);
        }

        // Logic for Role Update
        if (req.user.role !== 'admin') {
            // Check for Admin Secret to upgrade role
            if (updates.adminSecret === '123456') {
                updates.role = 'admin';
            } else {
                delete updates.role; // Block role update if no secret or invalid
            }
        }

        // ALWAYS remove sensitive/virtual fields before sending to DB
        delete updates.password; 
        delete updates.adminSecret;
        delete updates.id; 
        delete updates.email; // Usually don't allow email change here without verification

        const updatedUser = await userService.updateUser(id, updates);

        // Generate a new token with updated role/details
        const { generateToken } = require('../config/jwt');
        const newToken = generateToken(updatedUser);

        return successResponse(res, { user: updatedUser, token: newToken }, 'User updated successfully');

    } catch (error) {
        console.error("Update User Error:", error); // Log actual error for debugging
        return errorResponse(res, 'Failed to update user', 500, error.message);
    }
};

// Delete User (Admin only)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userService.deleteUser(id);
        return successResponse(res, null, 'User deleted successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to delete user', 500, error);
    }
};

module.exports = {
    getAllUsers,
    getProfile,
    updateUser,
    deleteUser
};
