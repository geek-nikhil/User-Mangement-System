const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticateToken = require('../middleware/auth.middleware');
const authorizeRole = require('../middleware/role.middleware');

// Apply auth middleware to all routes below
router.use(authenticateToken);

// GET /api/users/profile - Get own profile
router.get('/profile', userController.getProfile);

// GET /api/users - Get all users (Admin only)
router.get('/', authorizeRole(['admin']), userController.getAllUsers);

// PUT /api/users/:id - Update user
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', authorizeRole(['admin']), userController.deleteUser);

module.exports = router;
