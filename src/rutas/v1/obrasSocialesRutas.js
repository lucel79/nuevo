import express  from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import apicache from 'apicache';
import TransformarDTO from '../../middlewares/transformarDTO.js';
import ObrasSocialesControlador from '../../controladores/obrasSocialesControlador.js';

const router = express.Router();

const obrasSocialesControlador = new ObrasSocialesControlador();
const transformarDTO = new TransformarDTO();
const cache = apicache.middleware;


/**
 * @swagger
 * tags:
 *   name: ObrasSociales
 *   description: Gestión de obras sociales (ROL 3 - Admin)
 */
 
/**
 * @swagger
 * /api/v1/obras-sociales:
 *   get:
 *     summary: Listar obras sociales activas — cacheado 5 min
 *     tags: [ObrasSociales]
 *     responses:
 *       200:
 *         description: Lista de obras sociales
 */



router.get('/', cache('5 minutes') , obrasSocialesControlador.buscarTodas);


/**
 * @swagger
 * /api/v1/obras-sociales/{id_obra_social}:
 *   get:
 *     summary: Obtener obra social por ID
 *     tags: [ObrasSociales]
 *     parameters:
 *       - in: path
 *         name: id_obra_social
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Obra social encontrada
 *       404:
 *         description: No encontrada
 */



router.get('/:id_obra_social', 
    [
        param('id_obra_social', 'El parámetro debe ser entero').isInt(),    
        validarCampos
    ],
    obrasSocialesControlador.buscarPorId
);


/**
 * @swagger
 * /api/v1/obras-sociales:
 *   post:
 *     summary: Crear obra social (ROL 3)
 *     tags: [ObrasSociales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, descripcion, porcentaje_descuento, es_particular]
 *             properties:
 *               nombre:               { type: string, example: OSDE }
 *               descripcion:          { type: string, example: Obra social OSDE }
 *               porcentaje_descuento: { type: number, example: 15.00 }
 *               es_particular:        { type: integer, enum: [0,1], example: 0 }
 *     responses:
 *       201:
 *         description: Creada
 *       400:
 *         description: Datos inválidos
 */


router.post('/', 
    [
        check('nombre')
            .notEmpty().withMessage('El nombre es obligatorio.')
            .isLength({max:120}).withMessage('El nombre no debe ser mayor a 120 caracteres.'),
        check('descripcion')
            .notEmpty().withMessage('La descripción es obligatoria.')
            .isLength({max:120}).withMessage('La descripción no debe ser mayor a 120 caracteres.'),
        check('porcentaje_descuento')
            .notEmpty().withMessage('El porcentaje_descuento es obligatorio.'),
        check('es_particular')
            .notEmpty().withMessage('El es_particular es obligatorio.'),
        validarCampos
    ], 
    transformarDTO.obrasSocialesCrearDTO,
    obrasSocialesControlador.crear);

/**
 * @swagger
 * /api/v1/obras-sociales/{id_obra_social}:
 *   put:
 *     summary: Modificar obra social (ROL 3)
 *     tags: [ObrasSociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_obra_social
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:               { type: string }
 *               descripcion:          { type: string }
 *               porcentaje_descuento: { type: number }
 *               es_particular:        { type: integer, enum: [0,1] }
 *     responses:
 *       200:
 *         description: Modificada con éxito
 *       404:
 *         description: No encontrada
 */


router.put('/:id_obra_social',
    [
        param('id_obra_social', 'El parámetro debe ser entero').isInt(),
        check('nombre')
            .optional()
            .notEmpty().withMessage('El nombre no puede estar vacío.')
            .isLength({max:120}).withMessage('El nombre no debe ser mayor a 120 caracteres.'),
        check('descripcion')
            .optional()
            .notEmpty().withMessage('La descripción no puede estar vacía.')
            .isString().withMessage('La descripción debe ser cádena de caracteres.')
            .isLength({max:120}).withMessage('La descripción no debe ser mayor a 120 caracteres.'),
        check('porcentaje_descuento')
            .optional()
            .isNumeric().withMessage('El porcentaje_descuento debe ser numérico.'),
        check('es_particular')
            .optional()
            .isBoolean().withMessage('es_particular debe ser verdadero o falso.'),
        validarCampos
    ],
    transformarDTO.obrasSocialesActualizarDTO,
    obrasSocialesControlador.modificar);


/**
 * @swagger
 * /api/v1/obras-sociales/{id_obra_social}:
 *   delete:
 *     summary: Eliminar obra social — soft delete (ROL 3)
 *     tags: [ObrasSociales]
 *     parameters:
 *       - in: path
 *         name: id_obra_social
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Eliminada
 *       404:
 *         description: No encontrada
 */



router.delete('/:id_obra_social', 
    [
        param('id_obra_social', 'El parámetro debe ser entero').isInt(),    
        validarCampos
    ],
    obrasSocialesControlador.eliminar);

export { router };