const express = require('express');
const router = express.Router();
const sectorController = require('../controllers/sectorController');

// GET /api/sectores - Obtener todos los sectores
router.get('/', sectorController.getAllSectores);

// GET /api/sectores/:id/empleados - Obtener empleados por sector
router.get('/:id/empleados', sectorController.getEmpleadosBySector);

module.exports = router;