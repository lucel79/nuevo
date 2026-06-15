import express  from 'express';
import apicache from 'apicache';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import TransformarDTO from '../../middlewares/transformarDTO.js';
import MedicosControlador from '../../controladores/medicosControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

const router = express.Router();

const medicosControlador = new MedicosControlador();
const transformarDTO = new TransformarDTO();
const cache = apicache.middleware;


/**
 * @swagger
 * tags:
 *   name: Medicos
 *   description: Consulta y gestión de médicos
 */
 
/**
 * @swagger
 * /medicos:
 *   get:
 *     summary: Listar todos los médicos activos (ROL 2 y 3) — cacheado 5 min
 *     tags: [Medicos]
 *     responses:
 *       200:
 *         description: Lista de médicos
 */


router.get('/',  autorizarUsuarios([2, 3]), cache('5 minutes'),medicosControlador.buscarTodos);
 
/**
 * @swagger
 * /medicos/{id_medico}/obras-sociales:
 *   post:
 *     summary: Asociar médico con obras sociales — transacción MySQL (ROL 3)
 *     description: |
 *       Usa una **transacción MySQL** para garantizar que todas las relaciones
 *       se inserten o ninguna. Si la obra social ya existe para ese médico,
 *       se reactiva en lugar de duplicarse.
 *     tags: [Medicos]
 *     parameters:
 *       - in: path
 *         name: id_medico
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [obras_sociales]
 *             properties:
 *               obras_sociales:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [id_obra_social]
 *                   properties:
 *                     id_obra_social: { type: integer, example: 1 }
 *           example:
 *             obras_sociales:
 *               - id_obra_social: 1
 *               - id_obra_social: 2
 *     responses:
 *       201:
 *         description: Médico y obras sociales relacionadas
 *       400:
 *         description: No se crearon las relaciones
 */

router.post('/:id_medico/obras-sociales', 
   [        
        param('id_medico')
            .notEmpty().withMessage('El id_medico es obligatorio.')
            .isInt().withMessage('El id_medico debe ser un número entero.'),
        check('obras_sociales')
            .isArray().withMessage('obras_sociales debe ser un array.')
            .notEmpty().withMessage('obras_sociales no puede estar vacío.'),
        check('obras_sociales.*.id_obra_social') 
            .notEmpty().withMessage('Cada obra social debe tener id_obra_social.')
            .isInt().withMessage('id_obra_social debe ser un número entero.'),
        validarCampos
    ],
    transformarDTO.medicosAsociarDTO,
    medicosControlador.asociarMedicoObrasSociales);

export { router };