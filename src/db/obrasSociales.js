import { pool } from './conexion.js';

export default class ObrasSociales {

BuscarTodas = async () => {
  
      
        const sql = "SELECT * FROM obras_sociales WHERE activo = 1";        
        const [obras_sociales, fields] = await pool.query(sql);
        return obras_sociales;
  

}

BuscarPorId = async () => {
      
      
        const id_obras_sociales = req.params.id_obras_sociales;
        const sql = `SELECT * FROM obras_sociales WHERE activo = 1 AND id_obras_sociales = ?`;

        const [obras_sociales, fields] = await pool.execute(sql, [id_obras_sociales]);      
        
        return obras_sociales;
  

}

Crear = async () => {
         //const { nombre } = req.body;
         const { nombre ,descripcion, porcentaje_descuento, es_particular} = req.body;

        //const sql = 'INSERT INTO obras_sociales (nombre , ) VALUES (?)';
        const sql = 'INSERT INTO obras_sociales (nombre ,descripcion, porcentaje_descuento, es_particular ) VALUES (? ,?,?, ?)';


        const [result] = await pool.execute(sql, [nombre, descripcion, porcentaje_descuento, es_particular]);

        if (result.affectedRows > 0){
            res.status(201).send({'estado': true, 'msg': `ID Creado ${result.insertId}`});
      
        
        return obras_sociales;
  

}
Modificar = async () => {
  
    
        

        const id_obras_sociales = req.params.id_especialidad;
        const sqlb = `SELECT * FROM obras_sociales WHERE activo = 1 AND id_obras_sociales = ?`;

        const [obras_sociales, fields] = await pool.execute(sqlb, [id_obras_sociales]);

        if (obras_sociales.length === 0){
            return res.status(404).send({'estado': false, 'msg': 'Especialidad no encontrada'});
        }

        const { nombre } = req.body;
        
        const sql = 'UPDATE obras_sociales SET nombre = ? WHERE id_especialidad = ?';

        const [result] = await pool.execute(sql, [nombre, id_obras_sociales]);

        if (result.affectedRows > 0){
            res.status(200).send({'estado': true, 'msg': 'obras social modificada'});
        }
           return obras_sociales;
    
}


Borrar = async () => {
  


     const id_obras_sociales = req.params.id_obras_sociales;
        const sqlb = `SELECT * FROM obras_sociales WHERE activo = 1 AND id_obras_sociales = ?`;

        const [obras_sociales, fields] = await pool.execute(sqlb, [id_obras_sociales]);

        if (obras_sociales.length === 0){
            return res.status(404).send({'estado': false, 'msg': 'obras sociales no encontrada'});
        }

        const sql = 'UPDATE obras_sociales SET activo = 0 WHERE id_obras_sociales = ?';

        const [result] = await pool.execute(sql, [id_obras_sociales]);

        if (result.affectedRows > 0){
            res.status(200).send({'estado': true, 'msg': 'OS eliminada.'});
        }
   

       return obras_sociales;

  

}

}

}



