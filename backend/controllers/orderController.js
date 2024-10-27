const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    const { name, quantity, expectedDeliveryDate, maxPrice, description } = req.body;
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`; // Generate Order ID in required format
    try {
        const newOrder = new Order({ orderId, name, quantity, expectedDeliveryDate, maxPrice, description });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: 'Error creating order', error: error.errors });
        } else {
            res.status(500).json({ message: 'Error creating order', error: 'Internal Server Error' });
        }
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: 'Active' });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders', error: 'Internal Server Error' });
    }
};

exports.getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ status: { $ne: 'Active' } });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching order history', error: 'Internal Server Error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
        const updatedOrder = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order status', error: 'Internal Server Error' });
    }
};