const { Empleado, Sector, Rol, EmpleadoRol, Usuario } = require('../models');
const{getAllRoles}= require('./rolController');
const { Op, DATE } = require('sequelize');

const empleadoController = {
  // Obtener todos los empleados (con filtros por rol de usuario)
  getAllEmpleados: async (req, res) => {
    try {
      let whereCondition = { activo: true };
      
      // Filtro por rol de usuario
      if (req.user.rol === 'gerente') {
        whereCondition.idSector = req.user.idSector;
      }
  
        // Filtro por rol de usuario
      if (req.user.rol === 'empleado') {
        whereCondition.idSector = req.user.idSector;
      }
      const empleados = await Empleado.findAll({
        where: whereCondition,
        include: [
          { 
            model: Sector,
            attributes: ['idSector', 'nombreSector']
          },
          { 
            model: Rol,
            attributes: ['idRol', 'nombreRol'],
            through: { attributes: [] }
          },
          { 
            model: Empleado, 
            as: 'Supervisor',
            attributes: ['idEmpleado', 'nombre', 'apellido']
          }
        ],
        order: [['apellido', 'ASC'], ['nombre', 'ASC']]
      });

      res.json(empleados);
    } catch (error) {
      console.error('Error obteniendo empleados:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Obtener empleado por ID
  getEmpleadoById: async (req, res) => {
    try {
      const empleado = await Empleado.findByPk(req.params.id, {
        include: [
          { 
            model: Sector,
            attributes: ['idSector', 'nombreSector']
          },
          { 
            model: Rol,
            attributes: ['idRol', 'nombreRol'],
            through: { attributes: [] }
          },
          { 
            model: Empleado, 
            as: 'Supervisor',
            attributes: ['idEmpleado', 'nombre', 'apellido']
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
  },

createEmpleado: async (req, res) => {
  try {
    const {
      nombre, apellido, dni, direccion, telefono, email,
      fechaIngreso, sueldoBase, idSector, idSupervisor, roles,
       password
    } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !dni) {
      return res.status(400).json({ error: 'Nombre, apellido y DNI son obligatorios' });
    }

    // Validar que se proporcione email (que será el usuario de ingreso)
    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio ya que será el usuario de ingreso' });
    }

    // Validar password si se va a crear usuario
    if (!password) {
      return res.status(400).json({ error: 'La contraseña es obligatoria para crear el usuario' });
    }

    // Verificar si el DNI ya existe
    const empleadoExistente = await Empleado.findOne({ where: { dni } });
    if (empleadoExistente) {
      return res.status(400).json({ error: 'El DNI ya está registrado' });
    }

    // Verificar si el email ya existe (como usuario de ingreso)
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado como usuario' });
    }

    // Crear empleado
    const nuevoEmpleado = await Empleado.create({
      nombre,
      apellido,
      dni,
      direccion: direccion || null,
      telefono: telefono || null,
      email: email, // Este es el email del empleado
      fechaIngreso: fechaIngreso || null,
      sueldoBase: sueldoBase || 0,
      idSector: idSector || null,
      idSupervisor: idSupervisor || null,
      activo: true
    });

    // Crear usuario automáticamente (el email es el usuario de ingreso)
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 12);

    const usuarioCreado = await Usuario.create({
      idEmpleado: nuevoEmpleado.idEmpleado,
      email: email,  // El email es el usuario de ingreso
      passwordHash: passwordHash,
      rol: 'empleado', // Por defecto se crea como 'empleado'
      activo: true
    });

    // ASIGNAR ROLES EN LA TABLA EMPLEADOROLES - CORREGIDO
    if (roles && roles.length > 0) {
      await nuevoEmpleado.setRols(roles); // ← setRols con L minúscula
      console.log(`Roles asignados al empleado ${nuevoEmpleado.idEmpleado}:`, roles);
    }

    // Obtener el empleado creado con sus relaciones
    const empleadoCreado = await Empleado.findByPk(nuevoEmpleado.idEmpleado, {
      include: [
        { model: Sector },
        { model: Rol },
        { 
          model: Empleado, 
          as: 'Supervisor',
          attributes: ['idEmpleado', 'nombre', 'apellido']
        }
      ]
    });

    // Preparar respuesta
    const respuesta = {
      message: 'Empleado y usuario creados exitosamente',
      empleado: empleadoCreado,
      credenciales: {
        email: email,     // Usuario de ingreso
        password: password, // Contraseña (solo en desarrollo)
        rol: 'empleado'   // Rol por defecto
      }
    };

    res.status(201).json(respuesta);

  } catch (error) {
    console.error('Error creando empleado:', error);
    res.status(400).json({ error: 'Error al crear el empleado: ' + error.message });
  }
},
// Actualizar empleado - VERSIÓN MEJORADA
updateEmpleado: async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre, apellido, dni, direccion, telefono, email,
      sueldoBase, idSector, idSupervisor, roles, activo
    } = req.body;

    // Verificar si el empleado existe
    const empleado = await Empleado.findByPk(id);
    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    // Verificar si el DNI ya existe (excluyendo el actual)
    if (dni && dni !== empleado.dni) {
      const dniExistente = await Empleado.findOne({ 
        where: { 
          dni, 
          idEmpleado: { [Op.ne]: id } 
        } 
      });
      if (dniExistente) {
        return res.status(400).json({ error: 'El DNI ya está registrado' });
      }
    }

    // Verificar si el email ya existe (excluyendo el actual)
    if (email && email !== empleado.email) {
      const emailExistente = await Empleado.findOne({ 
        where: { 
          email, 
          idEmpleado: { [Op.ne]: id } 
        } 
      });
      if (emailExistente) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
    }

    // Actualizar empleado
    await empleado.update({
      nombre: nombre || empleado.nombre,
      apellido: apellido || empleado.apellido,
      dni: dni || empleado.dni,
      direccion: direccion !== undefined ? direccion : empleado.direccion,
      telefono: telefono !== undefined ? telefono : empleado.telefono,
      email: email !== undefined ? email : empleado.email,
      sueldoBase: sueldoBase !== undefined ? sueldoBase : empleado.sueldoBase,
      idSector: idSector !== undefined ? idSector : empleado.idSector,
      idSupervisor: idSupervisor !== undefined ? idSupervisor : empleado.idSupervisor,
      activo: activo !== undefined ? activo : empleado.activo
    });

    // Actualizar roles si se proporcionaron
    if (roles !== undefined) {
      console.log('🔄 Actualizando roles:', roles);
      
      if (Array.isArray(roles) && roles.length > 0) {
        // Asignar nuevos roles (reemplaza los existentes)
        await empleado.setRols(roles);
        console.log(`✅ Roles actualizados para empleado ${id}:`, roles);
      } else if (roles === null || roles.length === 0) {
        // Remover todos los roles si se envía array vacío o null
        await empleado.setRols([]);
        console.log(`✅ Todos los roles removidos del empleado ${id}`);
      }
    }

    // Obtener el empleado actualizado con todas las relaciones
    const empleadoActualizado = await Empleado.findByPk(id, {
      include: [
        { 
          model: Sector,
          attributes: ['idSector', 'nombreSector'] 
        },
        { 
          model: Rol,
          attributes: ['idRol', 'nombreRol'],
          through: { attributes: [] } // No incluir atributos de la tabla intermedia
        },
        { 
          model: Empleado, 
          as: 'Supervisor',
          attributes: ['idEmpleado', 'nombre', 'apellido']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Empleado actualizado exitosamente',
      data: empleadoActualizado
    });

  } catch (error) {
    console.error('❌ Error actualizando empleado:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar el empleado: ' + error.message 
    });
  }
},

 // Eliminar empleado (baja lógica)
deleteEmpleado: async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Solicitando eliminación del empleado:', id);

    // Buscar empleado incluyendo el campo activo
    const empleado = await Empleado.findByPk(id);
    
    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    // Verificar si el empleado ya está dado de baja
    if (!empleado.activo) {
      return res.status(400).json({ 
        error: `El empleado ${empleado.nombre} ${empleado.apellido} ya se encuentra dado de baja` 
      });
    }

    // Baja lógica del empleado
    await empleado.update({ activo: false });
    console.log(`Empleado ${empleado.nombre} ${empleado.apellido} dado de baja`);

    // También desactivar el usuario asociado si existe
    const usuario = await Usuario.findOne({ where: { idEmpleado: id } });
    if (usuario && usuario.activo) {
      await usuario.update({ activo: false });
      console.log('Usuario desactivado:', usuario.idUsuario);
    }

    res.json({ 
      message: `Empleado ${empleado.nombre} ${empleado.apellido} eliminado exitosamente`,
      empleadoId: id
    });

  } catch (error) {
    console.error('Error eliminando empleado:', error);
    res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
},


  // Asignar roles a empleado
  asignarRoles: async (req, res) => {
    try {
      const { id } = req.params;
      const { roles } = req.body;

      const empleado = await Empleado.findByPk(id);
      if (!empleado) {
        return res.status(404).json({ error: 'Empleado no encontrado' });
      }

      await empleado.setRols(roles);

      res.json({ message: 'Roles asignados correctamente' });
    } catch (error) {
      console.error('Error asignando roles:', error);
      res.status(400).json({ error: 'Error al asignar roles' });
    }
  },

  // Obtener supervisores
  getSupervisores: async (req, res) => {
    try {
      const supervisores = await Empleado.findAll({
        where: { activo: true },
        attributes: ['idEmpleado', 'nombre', 'apellido', 'idSector'],
        include: [
          {
            model: Sector,
            attributes: ['nombreSector']
          }
        ],
        order: [['apellido', 'ASC'], ['nombre', 'ASC']]
      });

      res.json(supervisores);
    } catch (error) {
      console.error('Error obteniendo supervisores:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

module.exports = empleadoController;