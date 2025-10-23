import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { empleadoService, sectorService } from '../api';

const EmployeeList = () => {
  const [empleados, setEmpleados] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [empleadosRes, sectoresRes] = await Promise.all([
        empleadoService.getAll(),
        sectorService.getAll()
      ]);
      setEmpleados(empleadosRes.data);
      setSectores(sectoresRes.data);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) {
      try {
        await empleadoService.delete(id);
        setEmpleados(empleados.filter(emp => emp.idEmpleado !== id));
      } catch (err) {
        setError('Error al eliminar el empleado');
      }
    }
  };

  const getSectorName = (idSector) => {
    const sector = sectores.find(s => s.idSector === idSector);
    return sector ? sector.nombreSector : 'Sin sector';
  };

  const getRolesNames = (roles) => {
    return roles.map(rol => rol.nombreRol).join(', ') || 'Sin roles';
  };

  if (loading) return <div className="loading">Cargando empleados...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Empleados</h2>
        <Link to="/empleados/nuevo" className="btn btn-primary">
          ➕ Nuevo Empleado
        </Link>
      </div>

      {empleados.length === 0 ? (
        <div className="text-center">
          <p>No hay empleados registrados</p>
          <Link to="/empleados/nuevo" className="btn btn-success">
            Agregar primer empleado
          </Link>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Sector</th>
              <th>Roles</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.idEmpleado}>
                <td>{empleado.idEmpleado}</td>
                <td>{empleado.nombre} {empleado.apellido}</td>
                <td>{empleado.dni}</td>
                <td>{empleado.email}</td>
                <td>{getSectorName(empleado.idSector)}</td>
                <td>{getRolesNames(empleado.Rols)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link 
                      to={`/empleados/editar/${empleado.idEmpleado}`}
                      className="btn btn-warning"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(empleado.idEmpleado, `${empleado.nombre} ${empleado.apellido}`)}
                      className="btn btn-danger"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
