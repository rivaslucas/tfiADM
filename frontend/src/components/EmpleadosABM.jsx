// components/EmpleadosABM.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const EmpleadosABM = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  // Estado del formulario adaptado a tu modelo
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    direccion: '',
    telefono: '',
    email: '',
    fechaIngreso: '',
    sueldoBase: '',
    idSector: '',
    idSupervisor: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadEmployees();
    loadSectors();
    loadSupervisors();
  }, []);

  // Filtrar empleados
  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, sectorFilter, roleFilter]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/empleados');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error cargando empleados:', error);
      alert('Error al cargar empleados');
    } finally {
      setLoading(false);
    }
  };

  const loadSectors = async () => {
    try {
      const response = await fetch('/api/sectores');
      if (response.ok) {
        const data = await response.json();
        setSectors(data);
      }
    } catch (error) {
      console.error('Error cargando sectores:', error);
    }
  };

  const loadSupervisors = async () => {
    try {
      const response = await fetch('/api/empleados/supervisores');
      if (response.ok) {
        const data = await response.json();
        setSupervisors(data);
      }
    } catch (error) {
      console.error('Error cargando supervisores:', error);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.dni?.includes(searchTerm) ||
        emp.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sectorFilter) {
      filtered = filtered.filter(emp => emp.Sector?.idSector === parseInt(sectorFilter));
    }

    setFilteredEmployees(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre || !formData.apellido || !formData.dni || !formData.sueldoBase) {
      alert('Por favor complete los campos obligatorios: Nombre, Apellido, DNI y Sueldo Base');
      return;
    }

    try {
      setLoading(true);
      const employeeData = {
        ...formData,
        sueldoBase: parseFloat(formData.sueldoBase),
        idSector: formData.idSector ? parseInt(formData.idSector) : null,
        idSupervisor: formData.idSupervisor ? parseInt(formData.idSupervisor) : null,
        fechaIngreso: formData.fechaIngreso || new Date().toISOString().split('T')[0]
      };

      let response;
      if (editingEmployee) {
        // Editar empleado existente
        response = await fetch(`/api/empleados/${editingEmployee.idEmpleado}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(employeeData)
        });
      } else {
        // Crear nuevo empleado
        response = await fetch('/api/empleados', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(employeeData)
        });
      }

      if (response.ok) {
        await loadEmployees(); // Recargar la lista
        resetForm();
        alert(editingEmployee ? 'Empleado actualizado correctamente' : 'Empleado creado correctamente');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error guardando empleado:', error);
      alert('Error al guardar empleado');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      dni: '',
      direccion: '',
      telefono: '',
      email: '',
      fechaIngreso: '',
      sueldoBase: '',
      idSector: '',
      idSupervisor: ''
    });
    setEditingEmployee(null);
    setShowForm(false);
  };

  const editEmployee = (employee) => {
    setFormData({
      nombre: employee.nombre || '',
      apellido: employee.apellido || '',
      dni: employee.dni || '',
      direccion: employee.direccion || '',
      telefono: employee.telefono || '',
      email: employee.email || '',
      fechaIngreso: employee.fechaIngreso || '',
      sueldoBase: employee.sueldoBase?.toString() || '',
      idSector: employee.idSector?.toString() || '',
      idSupervisor: employee.idSupervisor?.toString() || ''
    });
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const deleteEmployee = async (employeeId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este empleado?')) {
      try {
        const response = await fetch(`/api/empleados/${employeeId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await loadEmployees();
          alert('Empleado eliminado correctamente');
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        console.error('Error eliminando empleado:', error);
        alert('Error al eliminar empleado');
      }
    }
  };

  const toggleEmployeeStatus = async (employee) => {
    try {
      const response = await fetch(`/api/empleados/${employee.idEmpleado}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activo: !employee.activo
        })
      });

      if (response.ok) {
        await loadEmployees();
        alert(`Empleado ${employee.activo ? 'desactivado' : 'activado'} correctamente`);
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar estado del empleado');
    }
  };

  if (loading && employees.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Cargando empleados...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #e1e5e9',
        paddingBottom: '20px'
      }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Gestión de Empleados</h1>
        <button
          onClick={() => setShowForm(true)}
          disabled={loading}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            opacity: loading ? 0.6 : 1
          }}
        >
          + Nuevo Empleado
        </button>
      </div>

      {/* Filtros */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr auto',
        gap: '15px',
        alignItems: 'end'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Buscar (DNI, Nombre, Email)
          </label>
          <input
            type="text"
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Sector
          </label>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="">Todos los sectores</option>
            {sectors.map(sector => (
              <option key={sector.idSector} value={sector.idSector}>
                {sector.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setSearchTerm('');
            setSectorFilter('');
            setRoleFilter('');
          }}
          style={{
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Limpiar
        </button>
      </div>

      {/* Formulario de empleado */}
      {showForm && (
        <div style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          border: '1px solid #e1e5e9'
        }}>
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>
            {editingEmployee ? 'Editar Empleado' : 'Nuevo Empleado'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  DNI *
                </label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Sueldo Base *
                </label>
                <input
                  type="number"
                  name="sueldoBase"
                  value={formData.sueldoBase}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Teléfono
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Sector
                </label>
                <select
                  name="idSector"
                  value={formData.idSector}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Seleccionar sector</option>
                  {sectors.map(sector => (
                    <option key={sector.idSector} value={sector.idSector}>
                      {sector.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Supervisor
                </label>
                <select
                  name="idSupervisor"
                  value={formData.idSupervisor}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Sin supervisor</option>
                  {supervisors.map(supervisor => (
                    <option key={supervisor.idEmpleado} value={supervisor.idEmpleado}>
                      {supervisor.nombre} {supervisor.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Fecha de Ingreso
                </label>
                <input
                  type="date"
                  name="fechaIngreso"
                  value={formData.fechaIngreso}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Guardando...' : (editingEmployee ? 'Actualizar' : 'Crear Empleado')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de empleados */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e1e5e9'
        }}>
          <h3 style={{ margin: 0, color: '#2c3e50' }}>
            Lista de Empleados ({filteredEmployees.length})
          </h3>
        </div>

        {filteredEmployees.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
            No se encontraron empleados
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e1e5e9' }}>DNI</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e1e5e9' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e1e5e9' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e1e5e9' }}>Sector</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e1e5e9' }}>Sueldo Base</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e1e5e9' }}>Estado</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e1e5e9' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(employee => (
                  <tr key={employee.idEmpleado} style={{ borderBottom: '1px solid #f1f2f6' }}>
                    <td style={{ padding: '12px' }}>{employee.dni}</td>
                    <td style={{ padding: '12px' }}>
                      {employee.nombre} {employee.apellido}
                    </td>
                    <td style={{ padding: '12px' }}>{employee.email || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      {employee.Sector?.nombre || 'Sin sector'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      ${employee.sueldoBase?.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: employee.activo ? '#d4edda' : '#f8d7da',
                        color: employee.activo ? '#155724' : '#721c24'
                      }}>
                        {employee.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => editEmployee(employee)}
                          style={{
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => toggleEmployeeStatus(employee)}
                          style={{
                            backgroundColor: employee.activo ? '#e74c3c' : '#27ae60',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          {employee.activo ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => deleteEmployee(employee.idEmpleado)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpleadosABM;