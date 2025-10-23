const jwt = require('jsonwebtoken');
const { Usuario, Empleado } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura_cambiar_en_produccion_2024';

// Middleware para verificar token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id, {
      include: [{
        model: Empleado,
        attributes: ['idEmpleado', 'nombre', 'apellido', 'idSector', 'activo']
      }]
    });

    if (!usuario || !usuario.activo || !usuario.Empleado.activo) {
      return res.status(403).json({ error: 'Usuario no autorizado o inactivo' });
    }

    req.user = {
      id: usuario.idUsuario,
      idEmpleado: usuario.Empleado.idEmpleado,
      email: usuario.email,
      rol: usuario.rol,
      nombre: usuario.Empleado.nombre,
      apellido: usuario.Empleado.apellido,
      idSector: usuario.Empleado.idSector
    };
    
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

// Middleware para verificar roles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'Permisos insuficientes. Rol requerido: ' + roles.join(', ') 
      });
    }
    next();
  };
};

module.exports = { authenticateToken, requireRole, JWT_SECRET };