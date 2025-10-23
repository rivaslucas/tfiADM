const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Indemnizacion = db.define('Indemnizacion', {
  idIndemnizacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fechaCalculo: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  tipoDespido: {
    type: DataTypes.ENUM('justificado', 'injustificado'),
    allowNull: false
  },
  fechaIngreso: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  fechaEgreso: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  mejorSueldo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  sueldoActual: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  antiguedadAnios: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  antiguedadMeses: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  diasVacaciones: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalIndemnizacion: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  calculadoPor: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'indemnizaciones',
  timestamps: true,
  createdAt: 'fechaRegistro',
  updatedAt: false
});

module.exports = Indemnizacion;