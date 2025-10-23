const { DataTypes } = require('sequelize');
const db = require('../config/db');

const EmpleadoRol = db.define('EmpleadoRoles', {
  idEmpleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'empleados',
      key: 'idEmpleado'
    }
  },
  idRol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'idRol'
    }
  }
}, {
  tableName: 'empleadoroles',
  timestamps: false
});

module.exports = EmpleadoRol;