const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Empleado = db.define('Empleado', {
  idEmpleado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  dni: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  direccion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  fechaIngreso: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  sueldoBase: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  idSector: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  idSupervisor: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'empleados',  // ← Nombre exacto de la tabla
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: false
});

module.exports = Empleado;