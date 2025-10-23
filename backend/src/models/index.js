const Empleado = require('./Empleado');
const Sector = require('./Sector');
const Rol = require('./Rol');
const EmpleadoRol = require('./EmpleadoRol');
const Usuario = require('./Usuario');
const Asistencia = require('./Asistencia');
const HistorialSueldo = require('./HistorialSueldo');
const ReciboSueldo = require('./ReciboSueldo');
const Indemnizacion = require('./Indemnizacion');
const HistorialSector = require('./HistorialSector');

// Relaciones básicas
Sector.hasMany(Empleado, { foreignKey: 'idSector' });
Empleado.belongsTo(Sector, { foreignKey: 'idSector' });

// Auto-referencia para supervisores
Empleado.hasMany(Empleado, { 
  as: 'Supervisados', 
  foreignKey: 'idSupervisor' 
});
Empleado.belongsTo(Empleado, { 
  as: 'Supervisor', 
  foreignKey: 'idSupervisor' 
});

// Relación muchos a muchos
Empleado.belongsToMany(Rol, { 
  through: EmpleadoRol, 
  foreignKey: 'idEmpleado' 
});
Rol.belongsToMany(Empleado, { 
  through: EmpleadoRol, 
  foreignKey: 'idRol' 
});

// Relación para autenticación
Empleado.hasOne(Usuario, { foreignKey: 'idEmpleado' });
Usuario.belongsTo(Empleado, { foreignKey: 'idEmpleado' });

// Relaciones para asistencia
Empleado.hasMany(Asistencia, { foreignKey: 'idEmpleado' });
Asistencia.belongsTo(Empleado, { foreignKey: 'idEmpleado', as: 'Empleado' });
Asistencia.belongsTo(Empleado, { foreignKey: 'registradoPor', as: 'Registrador' });

// Relaciones para historial de sueldos
Empleado.hasMany(HistorialSueldo, { foreignKey: 'idEmpleado' });
HistorialSueldo.belongsTo(Empleado, { foreignKey: 'idEmpleado' });

// Relaciones para recibos de sueldo
Empleado.hasMany(ReciboSueldo, { foreignKey: 'idEmpleado' });
ReciboSueldo.belongsTo(Empleado, { foreignKey: 'idEmpleado' });

// Relaciones para indemnizaciones
Empleado.hasMany(Indemnizacion, { foreignKey: 'idEmpleado' });
Indemnizacion.belongsTo(Empleado, { foreignKey: 'idEmpleado' });

// Relaciones para historial de sectores
Sector.hasMany(HistorialSector, { foreignKey: 'idSector' });
HistorialSector.belongsTo(Sector, { foreignKey: 'idSector' });
Empleado.hasMany(HistorialSector, { foreignKey: 'idGerente' });
HistorialSector.belongsTo(Empleado, { foreignKey: 'idGerente', as: 'Gerente' });

module.exports = {
  Empleado,
  Sector,
  Rol,
  EmpleadoRol,
  Usuario,
  Asistencia,
  HistorialSueldo,
  ReciboSueldo,
  Indemnizacion,
  HistorialSector
};