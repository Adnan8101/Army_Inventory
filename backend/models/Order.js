const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    name: { type: String, required: true, minlength: 3, maxlength: 100 },
    quantity: { type: Number, required: true, min: 1 },
    expectedDeliveryDate: { type: Date, required: true },
    maxPrice: { type: Number, required: true, min: 1 },
    description: { type: String, required: true, minlength: 3, maxlength: 1000 },
    status: { type: String, required: true, default: 'Active' }
});

module.exports = mongoose.model('Order', orderSchema);