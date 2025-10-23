// routes/empleados.js
const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const db = require('../config/db');
const empleadoController = require('../controllers/empleadoController');

// GET - Listar empleados (con filtros)

// routes/empleados.js - CORREGIDO para Sequelize
const { Empleado, Usuario, Sector } = require('../models'); // Importa tus modelos
const { Op } = require('sequelize');

// GET - Listar empleados (con filtros) - USANDO SEQUELIZE
router.get('/', authenticateToken, requireRole(['admin', 'gerente','administrador']), async (req, res) => {
    try {
        const { dni, sector, rol, search, currentPage = 1, pageSize = 10 } = req.query;
        const offset = (currentPage - 1) * pageSize;
        
        // Construir condiciones WHERE
        let whereCondition = {
            activo: true
        };

        // Filtro por rol del usuario
        if (req.user.rol === 'gerente') {
            whereCondition.idSector = req.user.idSector;
        }

        // Filtro por DNI
        if (dni) {
            whereCondition.dni = { [Op.like]: `%${dni}%` };
        }

        // Filtro por sector (solo admin)
        if (sector && req.user.rol === 'administrador') {
            whereCondition.idSector = parseInt(sector);
        }

        // Búsqueda general
        if (search) {
            whereCondition[Op.or] = [
                { dni: { [Op.like]: `%${search}%` } },
                { nombre: { [Op.like]: `%${search}%` } },
                { apellido: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        // Condiciones para el Usuario (si se filtra por rol)
        let usuarioWhere = {};
        if (rol && req.user.rol === 'administrador') {
            usuarioWhere.rol = rol;
        }

        // Consulta con Sequelize
        const { count, rows: empleados } = await Empleado.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: Usuario,
                    attributes: ['idUsuario', 'email', 'rol', 'activo'],
                    where: usuarioWhere
                },
                {
                    model: Sector,
                    attributes: ['idSector', 'nombreSector']
                }
            ],
            limit: parseInt(pageSize),
            offset: offset,
            order: [['apellido', 'ASC'], ['nombre', 'ASC']]
        });

        res.json({
            empleados,
            totalCount: count,
            currentPage: parseInt(currentPage),
            totalPages: Math.ceil(count / pageSize),
            pageSize: parseInt(pageSize)
        });

    } catch (error) {
        console.error('Error listando empleados:', error);
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
});
// GET - Obtener un empleado específico
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const empleado = await Empleado.findByPk(req.params.id, {
            include: [
                {
                    model: Usuario,
                    attributes: ['idUsuario', 'email', 'rol', 'activo']
                },
                {
                    model: Sector,
                    attributes: ['idSector', 'nombreSector']
                }
            ]
        });

        if (!empleado) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }

        res.json(empleado);

    } catch (error) {
        console.error('Error obteniendo empleado:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST - Crear nuevo empleado (usa el controlador de Sequelize)
router.post('/', authenticateToken, requireRole(['administrador']), empleadoController.createEmpleado);
// PUT - Actualizar empleado
router.put('/:id', authenticateToken, requireRole(['administrador']),empleadoController.updateEmpleado);

// DELETE - Eliminar empleado (borrado lógico)
router.delete('/:id', authenticateToken, requireRole(['administrador']),empleadoController.deleteEmpleado);



module.exports = router;