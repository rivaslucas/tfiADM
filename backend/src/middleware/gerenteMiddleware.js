const { Empleado } = require('../models');

// Middleware para verificar que el usuario es gerente
const requireGerente = async (req, res, next) => {
  try {
    // Verificar si el usuario tiene rol de gerente o es supervisor
    if (req.user.rol !== 'gerente' && req.user.rol !== 'administrador') {
      // O verificar por sector (asumiendo que idSector 1 es gerencia)
      const empleado = await Empleado.findByPk(req.user.idEmpleado);
      if (!empleado || empleado.idSector !== 1) {
        return res.status(403).json({ 
          error: 'Solo los gerentes pueden realizar esta acción' 
        });
      }
    }
    next();
  } catch (error) {
    console.error('Error en middleware de gerente:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = requireGerente;