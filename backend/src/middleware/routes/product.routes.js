const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const authenticateToken = require('../auth.middleware');
const authorizeRole = require('../role.middleware');

// Public Routes (Anyone can view products)
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected Routes (Only Admin can manage products)
router.use(authenticateToken);
router.use(authorizeRole(['admin']));

router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
