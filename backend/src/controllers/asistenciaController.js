const { Op, where } = require('sequelize');
const Asistencia = require('../models/Asistencia');
const Empleado = require('../models/Empleado');

const asistenciaController = {
  
  // Registrar nueva asistencia (solo gerentes)
  registrarAsistencia: async (req, res) => {
    try {
      const { idEmpleado, fecha, estado, hora_entrada, observaciones } = req.body;
      const registradoPor = req.user.idEmpleado; // ID del empleado gerente desde el token

      // Verificar que el empleado existe
      const empleado = await Empleado.findByPk(idEmpleado);
      if (!empleado) {
        return res.status(404).json({
          success: false,
          message: 'Empleado no encontrado'
        });
      }

      // Verificar que no existe ya un registro para ese empleado en esa fecha
      const existeRegistro = await Asistencia.findOne({
        where: {
          idEmpleado,
          fecha
        }
      });

      if (existeRegistro) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un registro de asistencia para este empleado en la fecha especificada'
        });
      }

      // Crear el registro de asistencia
      const nuevaAsistencia = await Asistencia.create({
        idEmpleado,
        fecha,
        estado,
        hora_entrada: (estado === 'PRESENTE' || estado === 'TARDANZA') ? hora_entrada : null,
        observaciones,
        registradoPor
      });

      res.status(201).json({
        success: true,
        message: 'Asistencia registrada correctamente',
        data: nuevaAsistencia
      });

    } catch (error) {
      console.error('Error al registrar asistencia:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Actualizar asistencia existente (solo gerentes)
  actualizarAsistencia: async (req, res) => {
    try {
      const { id } = req.params;
      const { estado, hora_entrada, observaciones } = req.body;

      // Buscar la asistencia
      const asistencia = await Asistencia.findByPk(id);
      if (!asistencia) {
        return res.status(404).json({
          success: false,
          message: 'Registro de asistencia no encontrado'
        });
      }

      // Actualizar la asistencia
      await asistencia.update({
        estado,
        hora_entrada: (estado === 'PRESENTE' || estado === 'TARDANZA') ? hora_entrada : null,
        observaciones
      });

      res.json({
        success: true,
        message: 'Asistencia actualizada correctamente',
        data: asistencia
      });

    } catch (error) {
      console.error('Error al actualizar asistencia:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  // Obtener asistencias (gerentes ven todas, empleados solo las propias)
 obtenerAsistencias: async (req, res) => {
    try {
      const { fecha, idEmpleado, mes, anio, idSector } = req.query;

      console.log('🔍 Parámetros de consulta:', { fecha, idEmpleado, mes, anio, idSector });
      console.log('👤 Usuario:', req.user);

      let whereClause = {};
      let includeEmpleado = {
        model: Empleado,
        as: 'empleado',
        attributes: ['idempleado', 'nombre', 'apellido', 'dni', 'idSector']
      };

      // Si es administrador, puede ver todo
      if (req.user.rol === 'administrador') {
        console.log('👑 Administrador - viendo todas las asistencias');
        
        // Filtro por sector para administrador
        if (idSector) {
          includeEmpleado.where = {
            idSector: idSector
          };
          console.log('🏢 Administrador filtrando por sector:', idSector);
        }
        
        if (idEmpleado) {
          whereClause.idEmpleado = idEmpleado;
        }
      } 
      // Si es gerente/supervisor, solo ve asistencias de su sector
      else if (req.user.rol === 'gerente' || req.user.idSector) {
        console.log('👨‍💼 Gerente/Supervisor - filtrando por sector:', req.user.idSector);
        
        // Incluir filtro por sector del empleado
        includeEmpleado.where = {
          idSector: req.user.idSector
        };
        
        if (idEmpleado) {
          // Verificar que el empleado pertenece a su sector
          const empleado = await Empleado.findByPk(idEmpleado);
          if (!empleado || empleado.idSector !== req.user.idSector) {
            return res.status(403).json({
              success: false,
              message: 'No puedes ver asistencias de empleados de otros sectores'
            });
          }
          whereClause.idEmpleado = idEmpleado;
        }
      }
      // Si es empleado normal, solo ve sus propias asistencias
      else {
        console.log('👤 Empleado normal - viendo solo sus asistencias');
        whereClause.idEmpleado = req.user.idEmpleado;
      }

      // Filtro por fecha específica
      if (fecha) {
        whereClause.fecha = fecha;
        console.log('📅 Filtrando por fecha:', fecha);
      }

      // Filtro por mes y año
      if (mes && anio) {
        const fechaInicio = `${anio}-${mes.padStart(2, '0')}-01`;
        const fechaFin = `${anio}-${mes.padStart(2, '0')}-31`;
        
        whereClause.fecha = {
          [Op.between]: [fechaInicio, fechaFin]
        };
        console.log('📊 Filtrando por mes/año:', fechaInicio, 'a', fechaFin);
      }

      console.log('🎯 Where clause final:', JSON.stringify(whereClause, null, 2));

      const asistencias = await Asistencia.findAll({
        where: whereClause,
        include: [
          includeEmpleado,
          {
            model: Empleado,
            as: 'registrante',
            attributes: ['idempleado', 'nombre', 'apellido', 'idSector']
          }
        ],
        order: [['fecha', 'DESC'], ['idEmpleado', 'ASC']]
      });

      console.log('📋 Asistencias encontradas:', asistencias.length);

      res.json({
        success: true,
        data: asistencias
      });

    } catch (error) {
      console.error('❌ Error al obtener asistencias:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },
  // Obtener solo las asistencias del empleado logueado
  obtenerMisAsistencias: async (req, res) => {
    try {
      const { mes, anio } = req.query;
      const idEmpleado = req.user.idEmpleado;

      let whereClause = { idEmpleado };

      // Filtro por mes y año
      if (mes && anio) {
        const fechaInicio = `${anio}-${mes.padStart(2, '0')}-01`;
        const fechaFin = `${anio}-${mes.padStart(2, '0')}-31`;
        
        whereClause.fecha = {
          [Op.between]: [fechaInicio, fechaFin]
        };
      }

      const asistencias = await Asistencia.findAll({
        where: whereClause,
        include: [
          {
            model: Empleado,
            as: 'empleado',
            attributes: ['nombre', 'apellido', 'dni']
          }
        ],
        order: [['fecha', 'DESC']]
      });

      res.json({
        success: true,
        data: asistencias
      });

    } catch (error) {
      console.error('Error al obtener mis asistencias:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }
};

module.exports = asistenciaController;