import express  from 'express';
import { check, param } from 'express-validator';
import { validarCampos } from '../../middlewares/validarCampos.js';
import apicache from 'apicache';
import TransformarDTO from '../../middlewares/transformarDTO.js';
import TurnosReservasControlador from '../../controladores/turnosReservasControlador.js';
import autorizarUsuarios from '../../middlewares/autorizarUsuarios.js';

import  {verifyToken }  from '../../middlewares/auth.js';
const router = express.Router();

const turnosReservasControlador = new TurnosReservasControlador();
const transformarDTO = new TransformarDTO();
const cache = apicache.middleware;

/**
 * @swagger
 * tags:
 *   name: TurnosReservas
 *   description: Gestión de turnos y reservas médicas
 */
 
/**
 * @swagger
 * /turnos-reservas:
 *   get:
 *     summary: Listar turnos propios según rol (ROL 1 médico / ROL 2 paciente)
 *     description: |
 *       Médico ve sus turnos con paciente, obra social, estado y observaciones.
 *       Paciente ve sus turnos con médico, especialidad y obra social.
 *       El rol se detecta automáticamente desde el token JWT.
 *     tags: [TurnosReservas]
 *     responses:
 *       200:
 *         description: Lista de turnos
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Solo ROL 1 y 2
 */

router.get('/', autorizarUsuarios([1,2]),cache('2 minutes') ,turnosReservasControlador.buscarTodos);


/**
 * @swagger
 * /turnos-reservas/por-especialidad:
 *   get:
 *     summary: PDF de turnos por especialidad — SP del profesor (ROL 3 Admin)
 *     description: |
 *       Llama a `sp_reporte_turnos_por_especialidad_consola` y genera un PDF
 *       con cantidad de turnos y facturación del mes anterior por especialidad.
 *     tags: [TurnosReservas]
 *     responses:
 *       200:
 *         description: PDF generado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Solo administradores
 */


router.get('/por-especialidad', autorizarUsuarios([3]), turnosReservasControlador.porEspecialidad);
//router.get('/por-especialidad', turnosReservasControlador.porEspecialidad);


/**
 * @swagger
 * /turnos-reservas:
 *   post:
 *     summary: Crear reserva de turno (ROL 2 / ROL 3)
 *     description: |
 *       `valor_total` se calcula automáticamente:
 *       - `es_particular=0`: `valor_consulta - (porcentaje_descuento/100 * valor_consulta)`
 *       - `es_particular=1`: `valor_total = valor_consulta`
 *     tags: [TurnosReservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_medico, id_paciente, fecha_hora]
 *             properties:
 *               id_medico:   { type: integer, example: 1 }
 *               id_paciente: { type: integer, example: 1 }
 *               fecha_hora:  { type: string, format: date-time, example: "2026-06-20T10:00:00" }
 *     responses:
 *       201:
 *         description: Turno creado con valor_total calculado
 *       400:
 *         description: Datos inválidos
 */


router.post('/', 
    [
        check('id_medico')
            .notEmpty().withMessage('El id_medico es obligatorio.'),
        check('id_paciente')
            .notEmpty().withMessage('El id_paciente es obligatoria.'),
        check('fecha_hora')
            .notEmpty().withMessage('La fecha_hora es obligatorio.'),
        validarCampos
    ], 
    transformarDTO.turnosReservasCrearDTO,
    turnosReservasControlador.crear);


/**
 * @swagger
 * /turnos-reservas/atendido/{id_turno_reserva}:
 *   patch:
 *     summary: "⭐ EXTRA — Marcar turno como atendido con observaciones (solo ROL 1 - Médico)"
 *     description: |
 *       **Funcionalidad extra:** el médico puede marcar su turno como atendido
 *       y agregar comentarios u observaciones clínicas opcionales.
 *
 *       **Restricciones:**
 *       - Solo el médico dueño del turno puede marcarlo.
 *       - `observaciones` es opcional (puede omitirse o enviarse vacío).
 *       - El turno debe tener `activo = 1`.
 *     tags: [TurnosReservas]
 *     parameters:
 *       - in: path
 *         name: id_turno_reserva
 *         required: true
 *         schema: { type: integer }
 *         example: 1
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observaciones:
 *                 type: string
 *                 nullable: true
 *                 maxLength: 1000
 *                 example: "Paciente con fiebre leve. Se recetó ibuprofeno 400mg cada 8hs."
 *     responses:
 *       200:
 *         description: Turno marcado como atendido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:        { type: boolean, example: true }
 *                 mensaje:       { type: string, example: "Turno marcado como atendido." }
 *                 observaciones: { type: string, nullable: true }
 *       403:
 *         description: El turno no pertenece al médico autenticado
 *       404:
 *         description: Turno no encontrado o dado de baja
 */






router.patch('/atendido/:id_turno_reserva',autorizarUsuarios([1]),
[
    param('id_turno_reserva')
        .isInt().withMessage('id_turno_reserva debe ser un número entero.'),
    check('observaciones')
        .optional({ nullable: true })
        .isString().withMessage('Las observaciones deben ser texto.')
        .isLength({ max: 1000 }).withMessage('Máximo 1000 caracteres.'),
    validarCampos
],

    //verificarToken,
    //verificarAtendido,
    //controlador.verificarAtendido


);
    

export { router };