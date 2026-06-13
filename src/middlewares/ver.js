/* //VER SI ME QUEDO CON ESTE POR SOBRE AUTORIZAR USUARIOS

//import jwt from 'jsonwebtoken';
// Descomenta el pool cuando lo importes correctamente
// import pool from '../config/database.js';

export const ROLES = {
    MEDICO: 1,
    PACIENTE: 2,
    ADMINISTRADOR: 3
};

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || 
                     req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Acceso denegado', 
                message: 'Token de autenticación requerido' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clave_123');
        
        // Ajustado a los nombres reales de tu archivo turnos.sql
        const [users] = await pool.execute(
            `SELECT id_usuario, nombres, apellido, email, rol 
             FROM usuarios 
             WHERE id_usuario = ? AND activo = 1`,
            [decoded.id_usuario] // Asegúrate de que al firmar el JWT uses 'id_usuario'
        );
        
        if (users.length === 0) {
            return res.status(401).json({ 
                error: 'Token inválido', 
                message: 'Usuario no encontrado o inactivo' 
            });
        }

        // Guardamos el usuario real de la DB en la Node request
        req.user = users[0]; 
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Token expirado', 
                message: 'El token ha expirado, por favor inicie sesión nuevamente' 
            });
        }
        return res.status(401).json({ 
            error: 'Token inválido', 
            message: 'Error al verificar el token' 
        });
    }
};

// Esta versión de autorización es excelente porque soporta si mandás un número o un array
export const authorize = (perfilAutorizados = []) => {
    // Si pasan un solo rol como número (ej: 3), lo convertimos a array [3]
    const roles = typeof perfilAutorizados === 'number' ? [perfilAutorizados] : perfilAutorizados;

    return (req, res, next) => {
        // Validamos usando 'rol' que es el campo real de tu tabla usuarios
        if (!req.user || !roles.includes(req.user.rol)) {
            return res.status(403).json({ 
                estado: false,
                error: 'Acceso prohibido', 
                mensaje: 'No tiene permisos suficientes para realizar esta acción'
            });
        }
        next();
    };
};*/