const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
// Authenticated? Maybe admin only.
const authenticateToken = require('../middleware/auth.middleware');
const authorizeRole = require('../middleware/role.middleware');

// GET /api/transactions/analytics (Admin only)
router.get('/analytics', authenticateToken, authorizeRole(['admin']), transactionController.getAnalytics);

// GET /api/transactions (Paginated List - Everyone can access, filtered in controller)
router.get('/', authenticateToken, transactionController.getTransactions);

// POST /api/transactions/buy (Authenticated users)
router.post('/buy', authenticateToken, transactionController.buyProduct);

module.exports = router;
