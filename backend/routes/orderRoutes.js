const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderHistory, updateOrderStatus } = require('../controllers/orderController');

// Create a new order
router.post('/', createOrder);

// Get all orders
router.get('/', getOrders);

// Get order history
router.get('/history', getOrderHistory);

// Update order status
router.put('/update/:orderId', updateOrderStatus);

module.exports = router;