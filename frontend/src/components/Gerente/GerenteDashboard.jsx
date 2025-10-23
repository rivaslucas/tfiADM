// components/Gerente/GerenteDashboard.jsx
import React, { useState } from 'react';
import AsistenciaEmpleados from './AsistenciaEmpleados';
import CalculadorSueldo from './CalculadorSueldo';
import VisualizarEmpleados from './VisualizarEmpleados';
import './GerenteDashboard.css';

const GerenteDashboard = () => {
    const [activeTab, setActiveTab] = useState('asistencia');
    
    const user = JSON.parse(localStorage.getItem('user'));

    const menuItems = [
        { id: 'asistencia', label: '📋 Registrar Asistencia', path: 'asistencia' },
        { id: 'sueldos', label: '💰 Calculador Sueldos', path: 'sueldos' },
        { id: 'empleados', label: '👥 Visualizar Empleados', path: 'empleados' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'asistencia':
                return <AsistenciaEmpleados />;
            case 'sueldos':
                return <CalculadorSueldo />;
            case 'empleados':
                return <VisualizarEmpleados />;
            default:
                return <AsistenciaEmpleados />;
        }
    };

    return (
        <div className="gerente-dashboard">
            {/* Header del Gerente */}
            <div className="gerente-header">
                <div className="gerente-info">
                    <h1>Panel Gerente - {user?.sector}</h1>
                    <p>Gestión de personal y asistencia de tu sector</p>
                </div>
                <div className="gerente-stats">
                    <div className="stat">
                        <span className="stat-value">15</span>
                        <span className="stat-label">Empleados</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">92%</span>
                        <span className="stat-label">Asistencia</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">3</span>
                        <span className="stat-label">Ausentes Hoy</span>
                    </div>
                </div>
            </div>

            {/* Navegación */}
            <nav className="gerente-nav">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className={activeTab === item.id ? 'nav-item active' : 'nav-item'}
                        onClick={() => setActiveTab(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Contenido Principal */}
            <div className="gerente-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default GerenteDashboard;