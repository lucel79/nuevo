import express  from 'express';
import apicache from 'apicache';
import { check, param } from 'express-validator';
import {validarCampos} from '../../middlewares/validarCampos.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';
import EspecialidadesControlador from "../../controladores/especialidadesControlador.js";

const router = express.Router();

const cache = apicache.middleware;

const especialidadesControlador = new EspecialidadesControlador();


/**
 * @swagger
 * tags:
 *   name: Especialidades
 *   description: Gestión de especialidades médicas
 */
 
/**
 * @swagger
 * /especialidades:
 *   get:
 *     summary: Listar especialidades activas (ROL 2 y 3) — respuesta cacheada 5 min
 *     tags: [Especialidades]
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *       403:
 *         description: Solo pacientes y administradores
 */


router.get('/', autorizarUsuarios([2,3]), cache('5 minutes'), especialidadesControlador.buscarTodas);


/**
 * @swagger
 * /especialidades/{id_especialidad}:
 *   get:
 *     summary: Obtener especialidad por ID
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Especialidad encontrada
 *       404:
 *         description: No encontrada
 */




router.get('/:id_especialidad', 
    [
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),    
        validarCampos
    ],
    especialidadesControlador.buscarPorId);


  
/**
 * @swagger
 * /especialidades:
 *   post:
 *     summary: Crear especialidad (solo ROL 3 - Admin)
 *     tags: [Especialidades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre: { type: string, maxLength: 120, example: CARDIOLOGÍA }
 *     responses:
 *       201:
 *         description: Especialidad creada
 *       400:
 *         description: No se pudo crear
 */
  

router.post('/', 
    [
        check('nombre')
            .notEmpty().withMessage('El nombre es obligatorio.')
            .isLength({max:120}).withMessage('El nombre no debe ser mayor a 120 caracteres.'),
        validarCampos
    ], 
    especialidadesControlador.crear);


/**
 * @swagger
 * /especialidades/{id_especialidad}:
 *   put:
 *     summary: Modificar especialidad (solo ROL 3 - Admin)
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre: { type: string, example: TRAUMATOLOGÍA }
 *     responses:
 *       200:
 *         description: Modificada
 *       404:
 *         description: No encontrada
 */



router.put('/:id_especialidad', 
    [
        check('nombre')
            .notEmpty().withMessage('El nombre es obligatorio.')
            .isLength({max:120}).withMessage('El nombre no debe ser mayor a 120 caracteres.'),
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),    
        validarCampos
    ],
    especialidadesControlador.modificar);



/**
 * @swagger
 * /especialidades/{id_especialidad}:
 *   delete:
 *     summary: Eliminar especialidad — soft delete (ROL 3)
 *     tags: [Especialidades]
 *     parameters:
 *       - in: path
 *         name: id_especialidad
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Eliminada
 *       404:
 *         description: No encontrada
 */


router.delete('/:id_especialidad', 
    [
        param('id_especialidad', 'El parámetro debe ser entero').isInt(),    
        validarCampos
    ],
    especialidadesControlador.eliminar);

export { router };