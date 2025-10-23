// components/Empleado/EmpleadoDashboard.jsx
import React from 'react';
import './EmpleadoDashboard.css';

const EmpleadoDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="empleado-dashboard">
            <div className="empleado-header">
                <h1>👤 Panel Empleado</h1>
                <p>Bienvenido, {user.nombre || user.username}</p>
            </div>
            
            <div className="empleado-content">
                <div className="info-card">
                    <h3>Tu Información</h3>
                    <p><strong>Sector:</strong> {user.sector}</p>
                    <p><strong>Rol:</strong> {user.rol}</p>
                </div>
                
                <div className="sueldo-card">
                    <h3>💰 Próximamente: Historial de Sueldos</h3>
                    <p>Aquí podrás ver tu recibo de sueldo y historial</p>
                </div>
            </div>
        </div>
    );
};

export default EmpleadoDashboard;