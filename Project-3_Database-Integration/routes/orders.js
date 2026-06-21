const express = require('express');
const router  = express.Router();

const { createOrder, getAllOrders, getOrderById, deleteOrder } = require('../controllers/orderController');
const { validateOrder } = require('../middleware/validate');

// GET    /api/orders        → get all orders (joined with user + product info)
// GET    /api/orders/:id    → get one order
// POST   /api/orders        → create a new order (with validation + stock check)
// DELETE /api/orders/:id    → delete an order

router.get('/',       getAllOrders);
router.get('/:id',    getOrderById);
router.post('/',      validateOrder, createOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
