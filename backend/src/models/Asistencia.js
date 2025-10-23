const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Empleado = require('./Empleado'); // Asegúrate de importar el modelo Empleado

const Asistencia = db.define('Asistencia', {
  idAsistencia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'empleados',
      key: 'idempleado'
    }
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('PRESENTE', 'AUSENTE', 'TARDANZA', 'VACACIONES', 'LICENCIA', 'JUSTIFICADO'),
    allowNull: false
  },
  hora_entrada: {
    type: DataTypes.TIME,
    allowNull: true
  },
  hora_salida: {
    type: DataTypes.TIME,
    allowNull: true,
    defaultValue: '17:00:00'
  },
  horas_trabajadas: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  registradoPor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID del gerente que registró',
    references: {
      model: 'empleados',
      key: 'idempleado'
    }
  },
  fechaRegistro: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'asistencias',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['idEmpleado', 'fecha']
    },
    {
      fields: ['fecha']
    },
    {
      fields: ['idEmpleado']
    },
    {
      fields: ['estado']
    }
  ]
});

// Definir las asociaciones con alias
Asistencia.belongsTo(Empleado, {
  foreignKey: 'idEmpleado',
  as: 'empleado'
});

Asistencia.belongsTo(Empleado, {
  foreignKey: 'registradoPor',
  as: 'registrante'
});

module.exports = Asistencia;