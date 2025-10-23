const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Sector = db.define('Sector', {
  idSector: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombreSector: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'sectores',
  timestamps: false
});

module.exports = Sector;