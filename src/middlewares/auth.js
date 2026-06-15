import {pool} from '../db/conexion.js';
import jwt from 'jsonwebtoken';

process.loadEnvFile();

export const ROLES = {
    MEDICO: 1,
    PACIENTE : 2,
    ADMINISTRADOR: 3
};

export const verifyToken = async(req, res, next) =>{
    try {
        const token = req.header('Authorization')?.replace('Bearer','');
        if(!token){
            return res.status(401).json({
                estado:false,
                mensaje: 'token de autentificacion requerido'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const  [users] = await pool.execute(
            `SELECT id_usuario, nombres, apellido, email, rol
             FROM usuarios WHERE id_usuario = ? AND activo = 1`,
            [decoded.id_usuario]
        );
        if (users.length === 0){
            return res.status(401).json({
                estado: false,
                mensaje: 'Token invalido, no encontrado o inactivo'

        });

     }
     req.user = users[0];
     next();

    } catch (error){
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                estado: false,
                mensaje: 'Token expirado '
            });
        }
        return res.status(401).json({estado:false, mensaje:'Token invalido'});
    }
};

export const AutorizarRoles = (...args) =>{
    const roles = args.flat();
    return (req, res, next)=>{
        if(!req.user || !roles.includes(req.user.rol)){
            return res.status(403).json({
                estado: false,
                mensaje:'acceso denegado'

            });
        }
        next();
    };
};