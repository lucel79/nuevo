import express from 'express';
import AuthController from '../../controladores/authControlador.js';

import { check } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';

const router = express.Router();
const authController = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios (Login y generación de Tokens)
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener Token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, contrasenia]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@correo.com
 *                 description: Correo electrónico del usuario
 *               contrasenia:
 *                 type: string
 *                 example: 123456
 *                 description: Contraseña del usuario
 *     responses:
 *       200:
 *         description: Login exitoso. Devuelve los datos del usuario y el token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado: { type: boolean, example: true }
 *                 msg: { type: string, example: "Login exitoso" }
 *                 token: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 *       400:
 *         description: Error de validación en los campos enviados
 *       401:
 *         description: Credenciales incorrectas (Email o contraseña inválidos)
 */

router.post('/login', 
    [
        check('email')
            .notEmpty().withMessage('El correo electrónico es requerido!.')
            .isEmail().withMessage('Revisar el formato del correo electrónico.'),
        check('contrasenia')
            .notEmpty().withMessage('La contraseña es requerida.'),
        validarCampos
    ], 
    authController.login);

export {router};