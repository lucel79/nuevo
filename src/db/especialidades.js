import { pool } from './conexion.js';

export default class Especialidades {

buscarTodas = async () => {
  
      
        const sql = "SELECT * FROM especialidades WHERE activo = 1";        
        const [especialidades, fields] = await pool.query(sql);
        return especialidades;
  

}

buscarPorId = async (id_recibido) => {
      
      
        const id_especialidad = req.params.id_especialidades;
        const sql = `SELECT * FROM especialidades WHERE activo = 1 AND id_especialidad = ?`;

        const [especialidades, fields] = await pool.execute(sql, [id_recibido]);      
        
        return especialidades;
  

}

Crear = async () => {
         const { nombre } = req.body;

        const sql = 'INSERT INTO especialidades (nombre) VALUES (?)';

        const [result] = await pool.execute(sql, [nombre]);

        if (result.affectedRows > 0){
            res.status(201).send({'estado': true, 'msg': `ID Creado ${result.insertId}`});
      
        
        return especialidades;
  

}
Modificar = async () => {
  
    
        

         const id_especialidad = req.params.id_especialidad;
        const sqlb = `SELECT * FROM especialidades WHERE activo = 1 AND id_especialidad = ?`;

        const [especialidades, fields] = await pool.execute(sqlb, [id_especialidad]);

        if (especialidades.length === 0){
            return res.status(404).send({'estado': false, 'msg': 'Especialidad no encontrada'});
        }

        const { nombre } = req.body;
        
        const sql = 'UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?';

        const [result] = await pool.execute(sql, [nombre, id_especialidad]);

        if (result.affectedRows > 0){
            res.status(200).send({'estado': true, 'msg': 'Especialidad modificada'});
        }
           return especialidades;
    
}
Borrar = async () => {
  
      


     const id_especialidad = req.params.id_especialidad;
        const sqlb = `SELECT * FROM especialidades WHERE activo = 1 AND id_especialidad = ?`;

        const [especialidades, fields] = await pool.execute(sqlb, [id_especialidad]);

        if (especialidades.length === 0){
            return res.status(404).send({'estado': false, 'msg': 'Especialidad no encontrada'});
        }

        const sql = 'UPDATE especialidades SET activo = 0 WHERE id_especialidad = ?';

        const [result] = await pool.execute(sql, [id_especialidad]);

        if (result.affectedRows > 0){
            res.status(200).send({'estado': true, 'msg': 'Especialidad eliminada.'});
        }
   

       return especialidades;

  

}

}

}



