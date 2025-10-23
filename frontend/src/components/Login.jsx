import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Asegúrate de importar el CSS

const Login = () => {
  const [email, setEmail] = useState('admin@empresa.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (process.env.NODE_ENV === 'development') {
      console.log('Modo desarrollo - Bloqueo desactivado');
    }

    const result = await login(email, password);
    
    if (result.success) {
      console.log('Login exitoso:', result.user);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header con icono */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px',
            fontSize: '24px'
          }}>
            🏢
          </div>
          <h2>Iniciar Sesión</h2>
          <p style={{ 
            margin: '8px 0 0', 
            color: '#7f8c8d', 
            fontSize: '14px'
          }}>
            Accede a tu cuenta
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📧 Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>🔒 Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#ffeaea',
              color: '#e74c3c',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              border: '1px solid #ffcdd2',
              fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit"
            className="login-button"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <span>
                <span style={{ marginRight: '8px' }}>⏳</span>
                Iniciando sesión...
              </span>
            ) : (
              <span>
                <span style={{ marginRight: '8px' }}>🚀</span>
                Iniciar Sesión
              </span>
            )}
          </button>
        </form>

        {/* Sección de credenciales */}
        <div style={{ 
          marginTop: '25px', 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ 
            margin: '0 0 12px 0', 
            color: '#2c3e50',
            fontSize: '16px'
          }}>
            🔑 Credenciales de prueba
          </h4>
          <div style={{ fontSize: '14px', color: '#555' }}>
           <p style={{ margin: '8px 0' }}>
              <strong>Admin:</strong> admin@empresa.com / 123456
            </p>
            <p style={{ margin: '8px 0' }}>
              <strong>Usuario:</strong> juan@empresa.com / 123456
            </p>
          </div>
        </div>

        {/* Enlaces adicionales */}
        <div className="login-links">
          <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
          <a href="/register">¿No tienes cuenta? Regístrate aquí</a>
        </div>
      </div>
    </div>
  );
};

export default Login;