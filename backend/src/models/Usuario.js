const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Usuario = db.define('Usuario', {
  idUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idEmpleado: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('administrador', 'gerente', 'empleado'),
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ultimoAcceso: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'usuarios',  // ← Nombre exacto de la tabla
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: false
});

module.exports = Usuario;