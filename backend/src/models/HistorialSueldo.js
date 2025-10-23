const { DataTypes } = require('sequelize');
const db = require('../config/db');

const HistorialSueldo = db.define('HistorialSueldo', {
  idHistorialSueldo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Empleados',
      key: 'idEmpleado'
    }
  },
  sueldoAnterior: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  sueldoNuevo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fechaCambio: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  motivo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  registradoPor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Empleados',
      key: 'idEmpleado'
    }
  }
}, {
  tableName: 'historialsueldos',
  timestamps: true,
  createdAt: 'fechaRegistro',
  updatedAt: false
});

module.exports = HistorialSueldo;