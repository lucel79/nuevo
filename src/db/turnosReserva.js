import { pool } from "./conexion.js";

export default class TurnosReservas {

    crear = async (turnoReserva) => {
        const {id_medico, id_paciente, id_obra_social, fecha_hora, valor_total, atendido , activo} = turnoReserva;
        const sql = `INSERT INTO turnos_reservas (id_medico, id_paciente, id_obra_social, fecha_hora, valor_total)
             VALUES (?,?,?,?,?,?,?)`;
        const [result] = await pool.execute(sql, [id_medico,id_paciente,id_obra_social,fecha_hora, valor_total ]);     
        if (result.affectedRows === 0){
            return null;
        }
        return result.insertId;
    }

   // agregado porque debemos buscar turno por id para validar si 
    buscarPorId = async(id_turno_reserva) => {
        const sql = `SELECT * FROM turnos_reservas WHERE id_turno_reserva = ? AND activo = 1`;
        const [turnos] = await pool.execute(sql, [id_turno_reserva]);

        if (turnos.length === 0 ){
            throw new Error ('no se encontro el turno activo')
        }
        return turnos[0];
    }


   // se agrego tr.atendido y tr observaciones para que el medico vea estado y observaciones
    turnosDeUnMedico = async (id_usuario) => {
        const sql = `SELECT tr.id_turno_reserva , 
                    tr.fecha_hora, tr.valor_total,
                    tr.atendido, tr.observaciones,
                    CONCAT(u2.nombres, ' ', u2.apellido) AS paciente,
                    os.nombre AS obra_social
                     FROM usuarios AS u
                    INNER JOIN medicos AS m ON m.id_usuario = u.id_usuario
                    INNER JOIN turnos_reservas AS tr ON tr.id_medico = m.id_medico
                    WHERE u.id_usuario = ?;`
        const [turnos] = await pool.execute(sql, [id_usuario]);
        return turnos;
    } 
   // ver si se ve ok o debemos agregar querys ?
    turnosDeUnPaciente = async (id_usuario) => {
        const sql = `SELECT tr.fecha_hora, tr.valor_total
                        FROM usuarios as u
                        INNER JOIN pacientes AS p ON p.id_usuario = u.id_usuario
                        INNER JOIN turnos_reservas AS tr ON tr.id_paciente = p.id_paciente
                        WHERE u.id_usuario = ?`
        const [turnos] = await pool.execute(sql, [id_usuario]);
        return turnos;
    } 
    porEspecialidad = async () => {
        const sql = `CALL sp_turnos_por_especialidad()`;
        const [datos] = await pool.execute(sql);
        return datos[0];
    }
    



    // ver q pasa con observaciones
    verificarAtendido = async ( id_turno_reserva, observaciones) => {
        const sql = `UPDATE turnos_reservas 
                     SET atentido = 1, observaciones = ?
                     WHERE id_turno_reserva = ? AND activo = 1`;
        const [result] = await pool.execute(sql, [id_turno_reserva]);
        if (result.affectRows === 0){
            return null ;
        }             
        return true;
    }
   //soft delete
    eliminar = async (id_turno_reserva) => {
        const sql = `UPDATE turnos_reservas SET activo = 0 WHERE id_turno_reserva = ?`;
        const [result] = await pool.execute(sql,[id_turno_reserva] );
        if (result.affectedRows === 0) return null;
        return true;
    }

}