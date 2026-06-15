
import { pool } from "./conexion.js";
 
export default class TurnosReservas {
 
    crear = async (turnoReserva) => {
        const { id_medico, id_paciente, id_obra_social, fecha_hora, valor_total } = turnoReserva;
        
        const sql = `INSERT INTO turnos_reservas 
                        (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atentido, activo)
                     VALUES (?,?,?,?,?,0,1)`;
        const [result] = await pool.execute(sql, [id_medico, id_paciente, id_obra_social, fecha_hora, valor_total]);
        if (result.affectedRows === 0) return null;
        return result.insertId;
    }
 
    buscarPorId = async (id_turno_reserva) => {
        const sql = `SELECT * FROM turnos_reservas WHERE id_turno_reserva = ? AND activo = 1`;
        const [turnos] = await pool.execute(sql, [id_turno_reserva]);
        if (turnos.length === 0) return null;
        return turnos[0];
    }
 
     // Se agrego  atentido y observaciones para la funcionalidad extra
    turnosDeUnMedico = async (id_usuario) => {
       
        const sql = `SELECT 
                        tr.id_turno_reserva,
                        tr.fecha_hora,
                        tr.valor_total,
                        tr.atentido,
                        tr.observaciones,
                        CONCAT(up.nombres, ' ', up.apellido) AS paciente,
                        os.nombre AS obra_social
                     FROM usuarios AS u
                     INNER JOIN medicos AS m         ON m.id_usuario     = u.id_usuario
                     INNER JOIN turnos_reservas AS tr ON tr.id_medico    = m.id_medico
                     INNER JOIN pacientes AS p        ON p.id_paciente   = tr.id_paciente
                     INNER JOIN usuarios AS up        ON up.id_usuario   = p.id_usuario
                     INNER JOIN obras_sociales AS os  ON os.id_obra_social = tr.id_obra_social
                     WHERE u.id_usuario = ? AND tr.activo = 1
                     ORDER BY tr.fecha_hora DESC`;
        const [turnos] = await pool.execute(sql, [id_usuario]);
        return turnos;
    }
 
    turnosDeUnPaciente = async (id_usuario) => {
        const sql = `SELECT 
                        tr.id_turno_reserva,
                        tr.fecha_hora,
                        tr.atentido,
                        tr.valor_total,
                        CONCAT(um.nombres, ' ', um.apellido) AS medico,
                        e.nombre AS especialidad,
                        os.nombre AS obra_social
                     FROM usuarios AS u
                     INNER JOIN pacientes AS p        ON p.id_usuario    = u.id_usuario
                     INNER JOIN turnos_reservas AS tr ON tr.id_paciente  = p.id_paciente
                     INNER JOIN medicos AS m          ON m.id_medico     = tr.id_medico
                     INNER JOIN usuarios AS um        ON um.id_usuario   = m.id_usuario
                     INNER JOIN especialidades AS e   ON e.id_especialidad = m.id_especialidad
                     INNER JOIN obras_sociales AS os  ON os.id_obra_social = tr.id_obra_social
                     WHERE u.id_usuario = ? AND tr.activo = 1
                     ORDER BY tr.fecha_hora DESC`;
        const [turnos] = await pool.execute(sql, [id_usuario]);
        return turnos;
    }
 
    porEspecialidad = async () => {
        
        const [datos] = await pool.query(`CALL sp_reporte_turnos_por_especialidad_consola()`);
        return datos[0];
    }
 
    // Funcionalidad extra : marca turno como atendido y guarda observaciones del medico
    verificarAtendido = async (id_turno_reserva, observaciones = null) => {
        
        const sql = `UPDATE turnos_reservas 
                     SET atentido = 1, observaciones = ?
                     WHERE id_turno_reserva = ? AND activo = 1`;
        const [result] = await pool.execute(sql, [observaciones, id_turno_reserva]);
        if (result.affectedRows === 0) return null;
        return true;
    }
 
    eliminar = async (id_turno_reserva) => {
        const sql = `UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?`;
        const [result] = await pool.execute(sql, [id_turno_reserva]);
        if (result.affectedRows === 0) return null;
        return true;
    }
}
 
