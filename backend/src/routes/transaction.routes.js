const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
// Authenticated? Maybe admin only.
const authenticateToken = require('../middleware/auth.middleware');
const authorizeRole = require('../middleware/role.middleware');

// GET /api/transactions
// Assuming this is an admin dashboard feature
router.get('/', authenticateToken, authorizeRole(['admin']), transactionController.getAnalytics);

module.exports = router;
