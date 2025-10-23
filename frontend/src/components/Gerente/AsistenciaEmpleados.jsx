// components/Gerente/AsistenciaEmpleados.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AsistenciaEmpleados.css';

const AsistenciaEmpleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [asistencia, setAsistencia] = useState({});
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarEmpleadosSector();
        cargarAsistenciaDelDia();
    }, [fechaSeleccionada]);

    const cargarEmpleadosSector = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axios.get(`/api/empleados?sector=${user.sector}`);
            setEmpleados(response.data.filter(emp => emp.rol !== 'gerente'));
        } catch (error) {
            console.error('Error cargando empleados:', error);
        }
    };

    const cargarAsistenciaDelDia = async () => {
        try {
            const response = await axios.get(`/api/asistencia?fecha=${fechaSeleccionada}`);
            const asistenciaMap = {};
            response.data.forEach(item => {
                asistenciaMap[item.empleado_id] = item.estado;
            });
            setAsistencia(asistenciaMap);
        } catch (error) {
            console.error('Error cargando asistencia:', error);
        }
    };

    const handleAsistenciaChange = (empleadoId, estado) => {
        setAsistencia(prev => ({
            ...prev,
            [empleadoId]: estado
        }));
    };

    const guardarAsistencia = async () => {
        setLoading(true);
        try {
            await axios.post('/api/asistencia', {
                fecha: fechaSeleccionada,
                registros: Object.entries(asistencia).map(([empleadoId, estado]) => ({
                    empleado_id: empleadoId,
                    estado: estado
                }))
            });
            alert('Asistencia guardada exitosamente');
        } catch (error) {
            alert('Error guardando asistencia');
        } finally {
            setLoading(false);
        }
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'P': return '#28a745'; // Verde
            case 'A': return '#dc3545'; // Rojo
            case 'J': return '#ffc107'; // Amarillo
            default: return '#6c757d'; // Gris
        }
    };

    return (
        <div className="asistencia-empleados">
            <div className="asistencia-header">
                <h2>📋 Registro de Asistencia</h2>
                <div className="controles-fecha">
                    <label>Fecha:</label>
                    <input
                        type="date"
                        value={fechaSeleccionada}
                        onChange={(e) => setFechaSeleccionada(e.target.value)}
                    />
                    <button 
                        onClick={guardarAsistencia} 
                        disabled={loading}
                        className="guardar-btn"
                    >
                        {loading ? 'Guardando...' : '💾 Guardar Asistencia'}
                    </button>
                </div>
            </div>

            <div className="leyenda-estados">
                <div className="leyenda-item">
                    <div className="color-box" style={{backgroundColor: '#28a745'}}></div>
                    <span>P = Presente</span>
                </div>
                <div className="leyenda-item">
                    <div className="color-box" style={{backgroundColor: '#dc3545'}}></div>
                    <span>A = Ausente</span>
                </div>
                <div className="leyenda-item">
                    <div className="color-box" style={{backgroundColor: '#ffc107'}}></div>
                    <span>J = Justificado</span>
                </div>
            </div>

            <div className="empleados-asistencia">
                {empleados.map(empleado => (
                    <div key={empleado.id} className="empleado-asistencia-card">
                        <div className="empleado-info">
                            <h4>{empleado.nombre} {empleado.apellido}</h4>
                            <p>DNI: {empleado.dni} | {empleado.sector}</p>
                        </div>
                        
                        <div className="controles-asistencia">
                            <select
                                value={asistencia[empleado.id] || ''}
                                onChange={(e) => handleAsistenciaChange(empleado.id, e.target.value)}
                                style={{
                                    borderColor: getEstadoColor(asistencia[empleado.id]),
                                    backgroundColor: getEstadoColor(asistencia[empleado.id]) + '20'
                                }}
                            >
                                <option value="">Seleccionar</option>
                                <option value="P">P - Presente</option>
                                <option value="A">A - Ausente</option>
                                <option value="J">J - Justificado</option>
                            </select>
                            
                            <div 
                                className="estado-indicador"
                                style={{backgroundColor: getEstadoColor(asistencia[empleado.id])}}
                            >
                                {asistencia[empleado.id] || 'Sin registrar'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {empleados.length === 0 && (
                <div className="sin-empleados">
                    <p>No hay empleados en tu sector</p>
                </div>
            )}
        </div>
    );
};

export default AsistenciaEmpleados;