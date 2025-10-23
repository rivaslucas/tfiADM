const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.get('/verify', authenticateToken, authController.verify);
router.put('/change-password', authenticateToken, authController.changePassword);

module.exports = router;