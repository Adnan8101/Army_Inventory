const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/check-uid', userController.checkUID);
router.put('/approve-or-reject', userController.approveOrRejectRegistration); // Changed to PUT method
router.get('/pending-registrations', userController.getPendingRegistrations);

module.exports = router;
