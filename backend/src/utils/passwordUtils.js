// utils/passwordUtils.js
const bcrypt = require('bcrypt');

// Función para hashear contraseñas (usar para crear usuarios)
async function hashPassword(password) {
    try {
        const saltRounds = 12;
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw new Error('Error al hashear contraseña');
    }
}

// Función para crear usuario con contraseña hasheada
async function crearUsuario(username, password, rol, sector = null) {
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        const passwordHash = await hashPassword(password);
        
        const [result] = await connection.execute(
            'INSERT INTO usuarios (username, password_hash, rol, sector) VALUES (?, ?, ?, ?)',
            [username, passwordHash, rol, sector]
        );
        
        await connection.end();
        return result.insertId;
    } catch (error) {
        throw error;
    }
}

// Ejemplos de uso:
/*
// Crear usuario admin
crearUsuario('admin', 'admin123', 'admin', 'Administración')

// Crear usuario gerente
crearUsuario('gerente1', 'gerente123', 'gerente', 'Ventas')

// Crear usuario empleado
crearUsuario('empleado1', 'empleado123', 'empleado', 'Ventas')
*/