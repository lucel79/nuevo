
import TurnosReservas from "../servicios/turnosReservaServicio.js";
 
export default class TurnosReservasControlador {
 
    constructor() {
        this.turnosReservas = new TurnosReservas();
    }
 
    crear = async (req, res) => {
        try {
            const nuevoTurnoReserva = await this.turnosReservas.crear(req.dto);
            if (!nuevoTurnoReserva) {
                return res.status(400).json({ estado: false, mensaje: 'No se pudo crear el turno.' });
            }
            return res.status(201).json({ estado: true, mensaje: 'Turno Creado.', datos: nuevoTurnoReserva });
        } catch (error) {
            console.log(`Error en POST /turnos-reservas: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno.' });
        }
    }
 
    buscarTodos = async (req, res) => {
        try {
            const turnos = await this.turnosReservas.buscarTodas(req.user);
            res.status(200).json({ estado: true, mensaje: 'Turnos encontrados.', turnos });
        } catch (error) {
            console.log(`Error en GET /turnos-reservas: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }
 
    porEspecialidad = async (req, res) => {
        try {
            const { buffer, headers } = await this.turnosReservas.porEspecialidad();
            res.set(headers);
            res.status(200).end(buffer);
        } catch (error) {
            console.log(`Error en GET /turnos-reservas/por-especialidad: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno' });
        }
    }
 
    
    verificarAtendido = async (req, res) => {
        try {
            const { id_turno_reserva } = req.params;
            const { observaciones } = req.body;
 
        
            const resultado = await this.turnosReservas.verificarAtendido(
                parseInt(id_turno_reserva),  
                req.user.id_usuario,         
                observaciones || null         
            );
 
        
            if (resultado === null) {
                return res.status(404).json({ estado: false, mensaje: 'Turno no encontrado.' });
            }
            if (resultado === false) {
                return res.status(403).json({ estado: false, mensaje: 'No tiene permisos para modificar este turno.' });
            }
 
            return res.status(200).json({
                estado: true,
                mensaje: 'Turno marcado como atendido.',
                observaciones: observaciones || null
            });
 
        } catch (error) {
            console.log(`Error en PATCH /turnos-reservas/atendido/${req.params.id_turno_reserva}: ${error}`);
            res.status(500).json({ estado: false, mensaje: 'Error interno.' });
        }
    }
}
