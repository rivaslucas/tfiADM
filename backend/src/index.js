const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const db = require('./config/db');
const empleadoRoutes = require('./routes/empleados');
const sectorRoutes = require('./routes/sectores');
const rolRoutes = require('./routes/roles');
const authRoutes = require('./routes/auth');
const asistenciasRoutes = require('./routes/asistencia');


const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 Middlewares de seguridad
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.use(express.json());

// Rate limiting para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos de login, intente más tarde' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/auth/login', loginLimiter);

// 🚀 Rutas
app.use('/api/auth', authRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/sectores', sectorRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/asistencias', asistenciasRoutes);

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ 
    message: 'API Gestión Personal funcionando',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: 'Connected',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ✅ SOLUCIÓN: Verificar conexión pero NO sincronizar
db.authenticate()
  .then(() => {
    console.log('✅ Conexión a MySQL establecida correctamente');
    
    // Iniciar servidor SIN sincronización automática
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
      console.log(`🔐 Ruta de autenticación: http://localhost:${PORT}/api/auth`);
      console.log(`❤️  Ruta de salud: http://localhost:${PORT}/api/health`);
      console.log('💡 La base de datos ya existe, no se requiere sincronización');
    });
  })
  .catch(error => {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  });

module.exports = app;