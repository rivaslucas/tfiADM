import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-brand">
          🏢 Gestión Personal
        </Link>
        
        <div className="nav-links">
          <span style={{ color: 'white', marginRight: '15px' }}>
            {user.nombre} ({user.rol})
          </span>
          
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            📊 Dashboard
          </Link>
          
          <Link 
            to="/empleados" 
            className={`nav-link ${location.pathname === '/empleados' ? 'active' : ''}`}
          >
            👥 Empleados
          </Link>
          
          <button 
            onClick={handleLogout}
            className="nav-link"
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: 'white'
            }}
          >
            🚪 Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;