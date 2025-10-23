// components/Admin/SectoresManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SectoresManager.css';

const SectoresManager = () => {
    const [sectores, setSectores] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [sectorSeleccionado, setSectorSeleccionado] = useState(null);
    const [showHistorial, setShowHistorial] = useState(false);

    useEffect(() => {
        cargarSectores();
        cargarEmpleados();
    }, []);

    const cargarSectores = async () => {
        try {
            const response = await axios.get('/api/sectores');
            setSectores(response.data);
        } catch (error) {
            console.error('Error cargando sectores:', error);
        }
    };

    const cargarEmpleados = async () => {
        try {
            const response = await axios.get('/api/empleados');
            setEmpleados(response.data);
        } catch (error) {
            console.error('Error cargando empleados:', error);
        }
    };

    const getGerenteSector = (sectorNombre) => {
        return empleados.find(emp => 
            emp.sector === sectorNombre && emp.rol === 'gerente' && emp.activo
        );
    };

    const getEmpleadosSector = (sectorNombre) => {
        return empleados.filter(emp => 
            emp.sector === sectorNombre && emp.activo
        );
    };

    const handleSectorClick = (sector) => {
        setSectorSeleccionado(sector);
        setShowHistorial(false);
    };

    return (
        <div className="sectores-manager">
            {/* Vista principal - Cuadros de sectores */}
            {!sectorSeleccionado && (
                <div className="sectores-grid">
                    <h2>Sectores de la Empresa</h2>
                    <div className="sectores-cards">
                        {sectores.map(sector => {
                            const gerente = getGerenteSector(sector.nombre);
                            const empleadosCount = getEmpleadosSector(sector.nombre).length;
                            
                            return (
                                <div 
                                    key={sector.id} 
                                    className="sector-card"
                                    onClick={() => handleSectorClick(sector)}
                                >
                                    <h3>{sector.nombre}</h3>
                                    <div className="sector-info">
                                        <p>👤 Gerente: {gerente ? `${gerente.nombre} ${gerente.apellido}` : 'Sin asignar'}</p>
                                        <p>👥 Empleados: {empleadosCount}</p>
                                        <p>📊 Asistencia mes: 85%</p> {/* Ejemplo */}
                                    </div>
                                    <button className="ver-detalle-btn">
                                        Ver Detalles →
                                    </button>
                                </div>
                            );
                        })}
                        
                        {/* Card para agregar nuevo sector */}
                        <div className="sector-card add-sector">
                            <h3>+ Nuevo Sector</h3>
                            <p>Agregar nuevo sector a la empresa</p>
                            <button className="add-btn">Crear Sector</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Vista detalle del sector */}
            {sectorSeleccionado && !showHistorial && (
                <div className="sector-detalle">
                    <div className="detalle-header">
                        <button onClick={() => setSectorSeleccionado(null)} className="back-btn">
                            ← Volver a Sectores
                        </button>
                        <h2>Sector: {sectorSeleccionado.nombre}</h2>
                        <button 
                            onClick={() => setShowHistorial(true)} 
                            className="historial-btn"
                        >
                            📊 Ver Historial
                        </button>
                    </div>

                    <div className="detalle-content">
                        <div className="encargado-section">
                            <h3>👤 Encargado del Sector</h3>
                            <div className="encargado-info">
                                {getGerenteSector(sectorSeleccionado.nombre) ? (
                                    <div className="gerente-card">
                                        <h4>{getGerenteSector(sectorSeleccionado.nombre).nombre} {getGerenteSector(sectorSeleccionado.nombre).apellido}</h4>
                                        <p>Email: {getGerenteSector(sectorSeleccionado.nombre).email}</p>
                                        <p>Tel: {getGerenteSector(sectorSeleccionado.nombre).telefono}</p>
                                        <button className="cambiar-gerente-btn">
                                            Cambiar Gerente
                                        </button>
                                    </div>
                                ) : (
                                    <div className="sin-gerente">
                                        <p>No hay gerente asignado</p>
                                        <button className="asignar-gerente-btn">
                                            Asignar Gerente
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="empleados-section">
                            <h3>👥 Empleados del Sector</h3>
                            <div className="empleados-list">
                                {getEmpleadosSector(sectorSeleccionado.nombre)
                                    .filter(emp => emp.rol !== 'gerente')
                                    .map(empleado => (
                                    <div key={empleado.id} className="empleado-card">
                                        <div className="empleado-info">
                                            <strong>{empleado.nombre} {empleado.apellido}</strong>
                                            <span>DNI: {empleado.dni}</span>
                                            <span>Rol: {empleado.rol}</span>
                                        </div>
                                        <button className="mover-sector-btn">
                                            Mover Sector
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Vista historial del sector */}
            {sectorSeleccionado && showHistorial && (
                <div className="sector-historial">
                    <div className="historial-header">
                        <button onClick={() => setShowHistorial(false)} className="back-btn">
                            ← Volver al Sector
                        </button>
                        <h2>Historial - {sectorSeleccionado.nombre}</h2>
                    </div>

                    <div className="historial-content">
                        <div className="filtros-historial">
                            <select>
                                <option>Enero 2024</option>
                                <option>Febrero 2024</option>
                                <option>Marzo 2024</option>
                            </select>
                            <button>Exportar Reporte</button>
                        </div>

                        <div className="historial-data">
                            <div className="estadisticas-mes">
                                <h3>Estadísticas Marzo 2024</h3>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <h4>Asistencia Total</h4>
                                        <div className="stat-value">85%</div>
                                        <div className="stat-chart">
                                            {/* Gráfico simple */}
                                            <div className="chart-bar" style={{width: '85%'}}></div>
                                        </div>
                                    </div>
                                    <div className="stat-card">
                                        <h4>Presentes</h4>
                                        <div className="stat-value">78%</div>
                                    </div>
                                    <div className="stat-card">
                                        <h4>Ausentes</h4>
                                        <div className="stat-value">12%</div>
                                    </div>
                                    <div className="stat-card">
                                        <h4>Justificados</h4>
                                        <div className="stat-value">10%</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grafico-torta">
                                <h3>Distribución Asistencia</h3>
                                <div className="pie-chart-placeholder">
                                    {/* Aquí iría el gráfico de torta */}
                                    🎯 Gráfico de Asistencia por Empleados
                                </div>
                            </div>
                        </div>

                        <div className="historial-mensual">
                            <h3>Historial Mensual</h3>
                            <table className="historial-table">
                                <thead>
                                    <tr>
                                        <th>Mes</th>
                                        <th>Gerente</th>
                                        <th>Asistencia</th>
                                        <th>Empleados</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Marzo 2024</td>
                                        <td>Juan Pérez</td>
                                        <td>85%</td>
                                        <td>15</td>
                                        <td>
                                            <button>Ver Detalle</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Febrero 2024</td>
                                        <td>Juan Pérez</td>
                                        <td>82%</td>
                                        <td>14</td>
                                        <td>
                                            <button>Ver Detalle</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Enero 2024</td>
                                        <td>María García</td>
                                        <td>88%</td>
                                        <td>13</td>
                                        <td>
                                            <button>Ver Detalle</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectoresManager;