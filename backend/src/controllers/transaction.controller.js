const transactionService = require('../services/transaction.service');
const { successResponse, errorResponse } = require('../utils/response');

// Get Analytics
const getAnalytics = async (req, res) => {
    try {
        const stats = await transactionService.getTransactionStats();
        return successResponse(res, stats, 'Transaction analytics retrieved');
    } catch (error) {
        return errorResponse(res, 'Failed to fetch analytics', 500, error);
    }
};

// Get Transactions List
const getTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { month, year, sort } = req.query;

        const result = await transactionService.getTransactions(page, limit, { month, year, sort });
        return successResponse(res, result, 'Transactions retrieved successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to fetch transactions', 500, error);
    }
};

module.exports = {
    getAnalytics,
    getTransactions
};
