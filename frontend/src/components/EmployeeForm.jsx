import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { empleadoService, sectorService, rolService } from '../api';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    direccion: '',
    telefono: '',
    email: '',
    fechaIngreso: '',
    idSector: '',
    idSupervisor: ''
  });

  const [sectores, setSectores] = useState([]);
  const [roles, setRoles] = useState([]);
  const [supervisores, setSupervisores] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadInitialData();
    if (isEdit) {
      loadEmployeeData();
    }
  }, [id]);

  const loadInitialData = async () => {
    try {
      const [sectoresRes, rolesRes, empleadosRes] = await Promise.all([
        sectorService.getAll(),
        rolService.getAll(),
        empleadoService.getAll()
      ]);
      
      setSectores(sectoresRes.data);
      setRoles(rolesRes.data);
      setSupervisores(empleadosRes.data);
    } catch (err) {
      setError('Error al cargar datos iniciales');
    }
  };

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      const response = await empleadoService.getById(id);
      const empleado = response.data;
      
      setFormData({
        nombre: empleado.nombre || '',
        apellido: empleado.apellido || '',
        dni: empleado.dni || '',
        direccion: empleado.direccion || '',
        telefono: empleado.telefono || '',
        email: empleado.email || '',
        fechaIngreso: empleado.fechaIngreso ? empleado.fechaIngreso.split('T')[0] : '',
        idSector: empleado.idSector || '',
        idSupervisor: empleado.idSupervisor || ''
      });

      setSelectedRoles(empleado.Rols ? empleado.Rols.map(rol => rol.idRol) : []);
    } catch (err) {
      setError('Error al cargar datos del empleado');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (rolId) => {
    setSelectedRoles(prev =>
      prev.includes(rolId)
        ? prev.filter(id => id !== rolId)
        : [...prev, rolId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isEdit) {
        await empleadoService.update(id, formData);
        await empleadoService.asignarRoles(id, selectedRoles);
        setSuccess('Empleado actualizado correctamente');
      } else {
        const response = await empleadoService.create(formData);
        const newEmployeeId = response.data.idEmpleado;
        await empleadoService.asignarRoles(newEmployeeId, selectedRoles);
        setSuccess('Empleado creado correctamente');
      }

      setTimeout(() => {
        navigate('/empleados');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el empleado');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) return <div className="loading">Cargando...</div>;

  return (
    <div className="card">
      <h2>{isEdit ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-6">
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label className="form-label">Apellido *</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="form-group">
              <label className="form-label">DNI *</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label className="form-label">Fecha de Ingreso</label>
              <input
                type="date"
                name="fechaIngreso"
                value={formData.fechaIngreso}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="row">
          <div className="col-6">
            <div className="form-group">
              <label className="form-label">Sector</label>
              <select
                name="idSector"
                value={formData.idSector}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Seleccionar sector</option>
                {sectores.map(sector => (
                  <option key={sector.idSector} value={sector.idSector}>
                    {sector.nombreSector}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-6">
            <div className="form-group">
              <label className="form-label">Supervisor</label>
              <select
                name="idSupervisor"
                value={formData.idSupervisor}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Sin supervisor</option>
                {supervisores
                  .filter(emp => !isEdit || emp.idEmpleado !== parseInt(id))
                  .map(empleado => (
                    <option key={empleado.idEmpleado} value={empleado.idEmpleado}>
                      {empleado.nombre} {empleado.apellido}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Roles</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {roles.map(rol => (
              <label key={rol.idRol} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(rol.idRol)}
                  onChange={() => handleRoleChange(rol.idRol)}
                />
                {rol.nombreRol}
              </label>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <button
            type="button"
            onClick={() => navigate('/empleados')}
            className="btn btn-warning"
          >
            ↩️ Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-success"
          >
            {loading ? 'Guardando...' : (isEdit ? '💾 Actualizar' : '✅ Crear Empleado')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;