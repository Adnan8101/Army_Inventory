const Quotation = require('../models/Quotation');
const Order = require('../models/Order');

// Create a new quotation
exports.createQuotation = async (req, res) => {
    try {
        const { orderId, wmName, email, summary } = req.body;

        // Input validation
        if (!orderId || !wmName || !email || !summary) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new quotation
        const newQuotation = new Quotation({ orderId, wmName, email, summary });

        // Save the quotation
        const savedQuotation = await newQuotation.save();

        // Update order status to "Quotation Submitted"
        await Order.findOneAndUpdate({ orderId }, { status: 'Quotation Submitted' });

        // Return the saved quotation
        res.status(201).json(savedQuotation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create quotation' });
    }
};

// Get all quotations
exports.getQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find();
        res.status(200).json(quotations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve quotations' });
    }
};

// Update quotation status
exports.updateQuotationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Update quotation status
        const updatedQuotation = await Quotation.findByIdAndUpdate(id, { status }, { new: true });

        // Return the updated quotation
        res.status(200).json(updatedQuotation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update quotation status' });
    }
};
