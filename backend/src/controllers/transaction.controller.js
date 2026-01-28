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
        
        // If not admin, restrict to own ID
        const userId = req.user.role === 'admin' ? null : req.user.id;

        const result = await transactionService.getTransactions(page, limit, { month, year, sort }, userId);
        return successResponse(res, result, 'Transactions retrieved successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to fetch transactions', 500, error);
    }
};

// Buy Product
const buyProduct = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
             return errorResponse(res, 'ProductId and quantity are required', 400);
        }
        
        const transaction = await transactionService.purchaseTransaction(req.user.id, productId, parseInt(quantity));
        return successResponse(res, transaction, 'Purchase successful', 201);
    } catch (error) {
         if (error.message === 'Insufficient stock') return errorResponse(res, error.message, 400);
         if (error.message === 'Product not found') return errorResponse(res, error.message, 404);
         return errorResponse(res, 'Purchase failed', 500, error);
    }
};

module.exports = {
    getAnalytics,
    getTransactions,
    buyProduct
};
