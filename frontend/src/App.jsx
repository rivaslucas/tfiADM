import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // ← useAuth correcto
import Login from './components/Login';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#3498db'
      }}>
        🔄 Cargando aplicación...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/empleados" element={<EmployeeList />} />
          <Route path="/empleados/nuevo" element={<EmployeeForm />} />
          <Route path="/empleados/editar/:id" element={<EmployeeForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;