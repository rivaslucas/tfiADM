const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Rol = db.define('Rol', {
  idRol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombreRol: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Rol;