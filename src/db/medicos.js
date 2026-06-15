
import { pool } from "./conexion.js";
 
export default class Medicos {
 
    buscarTodos = async () => {
        const sql = "SELECT * FROM v_medicos";
        const [medicos] = await pool.execute(sql);
        return medicos;
    }
 
    buscarPorId = async (id_medico) => {
        const sql = `SELECT * FROM medicos WHERE id_medico = ?`;
        const [medico] = await pool.execute(sql, [id_medico]);
        return medico[0];
    }
 

    buscarPorIdUsuario = async (id_usuario) => {
        const sql = `SELECT * FROM medicos WHERE id_usuario = ?`;
        const [medico] = await pool.execute(sql, [id_usuario]);
        return medico[0] || null;
    }
 
    relacionarConObraSocial = async (id_medico, obras_sociales) => {
        const conexion = await pool.getConnection();
        try {
            await conexion.beginTransaction();
 
            for (const os of obras_sociales) {
                
                const [existe] = await conexion.execute(
                    `SELECT id_medico_obra_social FROM medicos_obras_sociales 
                     WHERE id_medico = ? AND id_obra_social = ?`,
                    [id_medico, os.id_obra_social]
                );
 
                if (existe.length > 0) {
                   
                    await conexion.execute(
                        `UPDATE medicos_obras_sociales SET activo = 1 
                         WHERE id_medico = ? AND id_obra_social = ?`,
                        [id_medico, os.id_obra_social]
                    );
                } else {
                    const sql = `INSERT INTO medicos_obras_sociales (id_medico, id_obra_social, activo) VALUES (?,?,1)`;
                    await conexion.execute(sql, [id_medico, os.id_obra_social]);
                }
            }
 
            await conexion.commit();
            conexion.release();
            return true;
 
        } catch (error) {
            await conexion.rollback();
            conexion.release();
            
            console.error(`Error en relacionarConObraSocial: ${error.message}`);
            return false;
        }
    }
}
 
