import express  from 'express';
import multer from 'multer';

import TransformarDTO from '../../middlewares/transformarDTO.js';
import { check, param } from 'express-validator';
import UsuariosControlador from '../../controladores/usuariosControlador.js';
import { validarCampos } from '../../middlewares/validarCampos.js';
import { storage } from '../../config/multer.js';

const upload = multer({ storage });
const transformarDTO = new TransformarDTO();
const router = express.Router();
const usuariosControlador = new UsuariosControlador();


/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios (foto de perfil con Multer)
 */
 
/**
 * @swagger
 * /usuarios/{id_usuario}:
 *   put:
 *     summary: Modificar datos de un usuario (incluye foto de perfil)
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documento:   { type: string }
 *               apellido:    { type: string }
 *               nombres:     { type: string }
 *               email:       { type: string, format: email }
 *               contrasenia: { type: string }
 *               rol:         { type: integer }
 *               activo:      { type: integer, enum: [0,1] }
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil (jpeg/png, max 5MB)
 *     responses:
 *       200:
 *         description: Usuario modificado
 *       404:
 *         description: Usuario no encontrado
 */



router.put('/:id_usuario',
    [
        param('id_usuario', 'El parámetro debe ser entero').isInt(),
        check('documento')
            .optional(),
        check('apellido')
            .optional(),
        check('nombres')
            .optional(),
        check('email')
            .optional(),
        check('contrasenia')
            .optional(),
        check('foto_path')
            .optional(),
        check('rol')
            .optional(), 
            check('activo')
            .optional().isIn([0, 1]).withMessage('activo debe ser 0 o 1.'),       
        validarCampos
    ],
    upload.single('foto'),
    transformarDTO.usuariosActualizarDTO,
    usuariosControlador.modificar);


export { router };