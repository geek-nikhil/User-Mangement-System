const productService = require('../services/product.service');
const { successResponse, errorResponse } = require('../utils/response');

// Create Product
const createProduct = async (req, res) => {
    try {
        // Basic validation
        const { name, price, category } = req.body;
        if (!name || !price || !category) {
            return errorResponse(res, 'Name, price, and category are required', 400);
        }

        const newProduct = await productService.createProduct(req.body);
        return successResponse(res, newProduct, 'Product created successfully', 201);
    } catch (error) {
        return errorResponse(res, 'Failed to create product', 500, error);
    }
};

// Get All Products (with filters)
const getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, sortBy, sortOrder, page, limit } = req.query;
        
        const result = await productService.getProducts({
            category,
            minPrice,
            maxPrice,
            sortBy,
            sortOrder,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10
        });

        return successResponse(res, {
            products: result.data,
            total: result.count,
            page: parseInt(page) || 1,
            totalPages: Math.ceil(result.count / (parseInt(limit) || 10))
        }, 'Products retrieved successfully');

    } catch (error) {
        return errorResponse(res, 'Failed to fetch products', 500, error);
    }
};

// Get Product By ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);
        
        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        return successResponse(res, product, 'Product fetched');
    } catch (error) {
        return errorResponse(res, 'Failed to fetch product', 500, error);
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await productService.updateProduct(id, req.body);
        return successResponse(res, updated, 'Product updated successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to update product', 500, error);
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await productService.deleteProduct(id);
        return successResponse(res, null, 'Product deleted successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to delete product', 500, error);
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
