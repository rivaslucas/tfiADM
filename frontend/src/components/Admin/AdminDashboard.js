// components/Admin/AdminDashboard.jsx
import React, { useState } from 'react';
import EmpleadosABM from '../EmpleadosABM';
import SectoresManager from './SectoresManager';
import CalculadorIndemnizacion from './CalculadorIndemnizacion';
import AsignacionRoles from './AsignacionRoles';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('empleados');

    const menuItems = [
        { id: 'empleados', label: '👥 Gestión Empleados', path: 'empleados' },
        { id: 'sectores', label: '🏢 Gestión Sectores', path: 'sectores' },
        { id: 'roles', label: '🔧 Asignación Roles', path: 'roles' },
        { id: 'indemnizacion', label: '💰 Calculador Indemnización', path: 'indemnizacion' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'empleados':
                return <EmpleadosABM />;
            case 'sectores':
                return <SectoresManager />;
            case 'roles':
                return <AsignacionRoles />;
            case 'indemnizacion':
                return <CalculadorIndemnizacion />;
            default:
                return <EmpleadosABM />;
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Sidebar Navigation */}
            <nav className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Panel Administrador</h2>
                </div>
                <ul className="sidebar-menu">
                    {menuItems.map(item => (
                        <li key={item.id} className={activeTab === item.id ? 'active' : ''}>
                            <button 
                                onClick={() => setActiveTab(item.id)}
                                className="sidebar-btn"
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Main Content */}
            <main className="admin-content">
                <div className="content-header">
                    <h1>
                        {activeTab === 'empleados' && 'Gestión de Empleados'}
                        {activeTab === 'sectores' && 'Gestión de Sectores'}
                        {activeTab === 'roles' && 'Asignación de Roles'}
                        {activeTab === 'indemnizacion' && 'Calculador de Indemnización'}
                    </h1>
                    <div className="breadcrumb">
                        Admin / {menuItems.find(item => item.id === activeTab)?.label}
                    </div>
                </div>

                <div className="content-body">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;