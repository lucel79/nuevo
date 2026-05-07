import { pool } from './conexion.js';

export default class Especialidades {

buscarTodas = async () => {
  
        const sql = "SELECT * FROM especialidades WHERE activo = 1";        
        const [especialidades, fields] = await pool.query(sql);
        return especialidades;
  

}

buscarPorId = async (id) => {
        
        const sql = `SELECT * FROM especialidades WHERE activo = 1 AND id_especialidad = ?`;

        const [especialidades] = await pool.execute(sql, [id]);      
        
        return especialidades;
  

}

crear = async (nombre) => {
         

        const sql = 'INSERT INTO especialidades (nombre) VALUES (?)';

        const [result] = await pool.execute(sql, [nombre]);

        return result;
  
}



modificar = async (id, nombre) => {
   
        
        const sqlb = `UPDATE especialidades  SET nombre = ?  WHERE id_especialidad = ?`;

        const [result] = await pool.execute(sqlb, [nombre, id]);
        return result;
    
}


borrar = async (id) => {

        const sqlb = `UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?`;
   
        const [result] = await pool.execute(sqlb, [id]);

       return result;

}

}





