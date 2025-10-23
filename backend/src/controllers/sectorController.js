const { Sector, Empleado } = require('../models');

// Obtener todos los sectores
exports.getAllSectores = async (req, res) => {
  try {
    const sectores = await Sector.findAll({
      include: [{
        model: Empleado,
        attributes: ['idEmpleado', 'nombre', 'apellido', 'dni']
      }]
    });
    res.json(sectores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener empleados por sector
exports.getEmpleadosBySector = async (req, res) => {
  try {
    const sector = await Sector.findByPk(req.params.id, {
      include: [{
        model: Empleado,
        include: [{ model: Rol }]
      }]
    });
    
    if (!sector) {
      return res.status(404).json({ error: 'Sector no encontrado' });
    }
    
    res.json(sector.Empleados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};