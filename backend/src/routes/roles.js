const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

// GET /api/roles - Obtener todos los roles
router.get('/', rolController.getAllRoles);

module.exports = router;