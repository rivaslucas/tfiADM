const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');
const { authenticateToken, requireRole } = require('../middleware/auth'); // Tu archivo auth
const requireGerente = require('../middleware/gerenteMiddleware');

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// Registrar asistencia - solo gerentes
router.post('/registrar', requireGerente, asistenciaController.registrarAsistencia);

// Actualizar asistencia - solo gerentes
router.put('/actualizar/:id', requireGerente, asistenciaController.actualizarAsistencia);

// Obtener asistencias - gerentes pueden ver todas, empleados solo las propias
router.get('/listar',requireGerente, asistenciaController.obtenerAsistencias);

// Obtener mis propias asistencias (para empleados no gerentes)
router.get('/mis-asistencias', asistenciaController.obtenerMisAsistencias);

module.exports = router;