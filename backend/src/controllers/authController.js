const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Empleado } = require('../models');
const { JWT_SECRET } = require('../middleware/auth');

const authController = {
  // Login de usuario
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validar campos
      if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
      }

      // Buscar usuario
      const usuario = await Usuario.findOne({
        where: { email },
        include: [{
          model: Empleado,
          attributes: ['idEmpleado', 'nombre', 'apellido', 'idSector', 'activo']
        }]
      });
   // En la función login, DESPUÉS de buscar el usuario:
console.log('=== DEBUG LOGIN ===');
console.log('Email ingresado:', email);
console.log('Password ingresado:', password);
console.log('Usuario encontrado:', {
  id: usuario.idUsuario,
  email: usuario.email,
  activo: usuario.activo,
  empleadoActivo: usuario.Empleado.activo,
  passwordHash: usuario.passwordHash
});

      if (!usuario || !usuario.Empleado.activo || !usuario.activo) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Verificar contraseña
      const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
    console.log('Resultado de bcrypt.compare:', passwordValida);
console.log('=== FIN DEBUG ===');
      if (!passwordValida) {
      
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Actualizar último acceso
      await usuario.update({ ultimoAcceso: new Date() });

      // Generar token
      const token = jwt.sign(
        { 
          id: usuario.idUsuario, 
          email: usuario.email, 
          rol: usuario.rol 
        },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: usuario.idUsuario,
          idEmpleado: usuario.Empleado.idEmpleado,
          email: usuario.email,
          rol: usuario.rol,
          nombre: usuario.Empleado.nombre,
          apellido: usuario.Empleado.apellido,
          idSector: usuario.Empleado.idSector
        }
      });

    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Verificar token (para el frontend)
  verify: async (req, res) => {
    res.json({
      user: req.user,
      message: 'Token válido'
    });
  },

  // Cambiar contraseña
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Ambas contraseñas son requeridas' });
      }

      const usuario = await Usuario.findByPk(req.user.id);

      // Verificar contraseña actual
      const passwordValida = await bcrypt.compare(currentPassword, usuario.passwordHash);
      if (!passwordValida) {
        return res.status(400).json({ error: 'Contraseña actual incorrecta' });
      }

      // Hashear nueva contraseña
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Actualizar contraseña
      await usuario.update({ passwordHash: newPasswordHash });

      res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

module.exports = authController;