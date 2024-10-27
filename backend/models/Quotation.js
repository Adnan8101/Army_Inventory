const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    wmName: { type: String, required: true },
    email: { type: String, required: true },
    summary: { type: String, required: true },
    status: { type: String, required: true, default: 'Pending' }
});

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;
