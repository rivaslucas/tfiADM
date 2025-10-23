const { DataTypes } = require('sequelize');
const db = require('../config/db');

const ReciboSueldo = db.define('ReciboSueldo', {
  idRecibo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  año: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sueldoBase: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  diasTrabajados: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  diasAusentes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  diasJustificados: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  descuentos: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  totalLiquidado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  generadoPor: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'recibossueldos',
  timestamps: true,
  createdAt: 'fechaGeneracion',
  updatedAt: false
});

module.exports = ReciboSueldo;