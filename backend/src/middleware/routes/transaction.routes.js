const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/transaction.controller');
// Authenticated? Maybe admin only.
const authenticateToken = require('../auth.middleware');
const authorizeRole = require('../role.middleware');

// GET /api/transactions/analytics (Admin only)
router.get('/analytics', authenticateToken, authorizeRole(['admin']), transactionController.getAnalytics);

// GET /api/transactions (Paginated List - Admin only)
router.get('/', authenticateToken, authorizeRole(['admin']), transactionController.getTransactions);

module.exports = router;
