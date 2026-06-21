const express = require('express');
const router  = express.Router();

const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');
const { validateProduct } = require('../middleware/validate');

// GET    /api/products               → get all products
// GET    /api/products?category=xyz  → filter by category
// GET    /api/products/:id           → get one product
// POST   /api/products               → create a new product (with validation)
// PUT    /api/products/:id           → update a product      (with validation)
// DELETE /api/products/:id           → delete a product

router.get('/',       getAllProducts);
router.get('/:id',    getProductById);
router.post('/',      validateProduct, createProduct);
router.put('/:id',    validateProduct, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
