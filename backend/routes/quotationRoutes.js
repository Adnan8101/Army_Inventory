const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');

// Create a new quotation
router.post('/', quotationController.createQuotation);

// Get all quotations
router.get('/', quotationController.getQuotations);

// Update quotation status
router.put('/:id', quotationController.updateQuotationStatus);

module.exports = router;
