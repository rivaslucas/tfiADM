import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="card">
      <h1>📊 Dashboard</h1>
      <div style={styles.welcome}>
        <h2>Bienvenido, {user.nombre} {user.apellido}</h2>
        <p>Rol: <strong>{user.rol}</strong></p>
        <p>Email: {user.email}</p>
      </div>
      
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <h3>👥 Empleados</h3>
          <p>Gestión completa de empleados</p>
        </div>
        <div style={styles.statCard}>
          <h3>📅 Asistencia</h3>
          <p>Control de presencia</p>
        </div>
        <div style={styles.statCard}>
          <h3>💰 Sueldos</h3>
          <p>Cálculo y liquidación</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  welcome: {
    backgroundColor: '#e8f4fd',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #e9ecef'
  }
};

export default Dashboard;