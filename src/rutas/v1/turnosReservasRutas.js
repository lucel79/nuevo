import express from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import apicache from 'apicache';
import TransformarDTO from '../../middlewares/transformarDTO.js';
import TurnosReservasControlador from '../../controladores/turnosReservasControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

const router = express.Router();
const turnosReservasControlador = new TurnosReservasControlador();
const transformarDTO = new TransformarDTO();
const cache = apicache.middleware;

/**
 * @swagger
 * tags:
 *   - name: TurnosReservas
 *     description: Gestion de turnos y reservas medicas
 */

/**
 * @swagger
 * /api/v1/turnos-reservas:
 *   get:
 *     summary: Listar turnos propios segun rol (ROL 1 o 2)
 *     tags: [TurnosReservas]
 *     responses:
 *       200:
 *         description: Lista de turnos devuelta con exito
 *       401:
 *         description: Token requerido
 *       403:
 *         description: No autorizado
 */
router.get(
  '/',
  autorizarUsuarios([1, 2]),
  cache('2 minutes'),
  turnosReservasControlador.buscarTodos
);

/**
 * @swagger
 * /api/v1/turnos-reservas:
 *   post:
 *     summary: Crear reserva de turno (ROL 2 o 3)
 *     tags: [TurnosReservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_medico, id_paciente, fecha_hora]
 *             properties:
 *               id_medico:
 *                 type: integer
 *                 example: 1
 *               id_paciente:
 *                 type: integer
 *                 example: 1
 *               fecha_hora:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-06-20T10:00:00"
 *     responses:
 *       201:
 *         description: Turno creado con exito
 *       400:
 *         description: Datos invalidos
 */
router.post(
  '/',
  [
    check('id_medico').notEmpty().withMessage('El id_medico es obligatorio.'),
    check('id_paciente').notEmpty().withMessage('El id_paciente es obligatoria.'),
    check('fecha_hora').notEmpty().withMessage('La fecha_hora es obligatorio.'),
    validarCampos
  ],
  transformarDTO.turnosReservasCrearDTO,
  turnosReservasControlador.crear
);

/**
 * @swagger
 * /api/v1/turnos-reservas/por-especialidad:
 *   get:
 *     summary: PDF de turnos por especialidad (ROL 3 Admin)
 *     tags: [TurnosReservas]
 *     responses:
 *       200:
 *         description: PDF generado con exito
 *       403:
 *         description: Solo administradores
 */
router.get(
  '/por-especialidad',
  autorizarUsuarios([3]),
  turnosReservasControlador.porEspecialidad
);

/**
 * @swagger
 * /api/v1/turnos-reservas/atendido/{id_turno_reserva}:
 *   patch:
 *     summary: Marcar turno como atendido con observaciones (solo ROL 1)
 *     tags: [TurnosReservas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_turno_reserva
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observaciones:
 *                 type: string
 *                 example: "Paciente presentaba fiebre."
 *     responses:
 *       200:
 *         description: Turno marcado como atendido correctamente
 *       403:
 *         description: Rol invalido o el turno no le pertenece
 *       404:
 *         description: Turno no encontrado
 */
router.patch(
  '/atendido/:id_turno_reserva',
  autorizarUsuarios([1]),
  [
    param('id_turno_reserva').isInt().withMessage('id_turno_reserva debe ser un número entero.'),
    check('observaciones').optional({ nullable: true }).isString().withMessage('Las observaciones deben ser texto.'),
    validarCampos
  ],
  turnosReservasControlador.verificarAtendido
);

export { router };




