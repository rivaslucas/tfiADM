const { DataTypes } = require('sequelize');
const db = require('../config/db');

const HistorialSector = db.define('HistorialSector', {
  idHistorialSector: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idSector: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  idGerente: {
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
  porcentajeAsistencia: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  totalEmpleados: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'historialessectores',
  timestamps: true,
  createdAt: 'fechaRegistro',
  updatedAt: false
});

module.exports = HistorialSector;