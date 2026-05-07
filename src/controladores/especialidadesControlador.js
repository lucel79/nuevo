import EspecialidadesServicio from "../servicios/especialidadesServicios.js";

export default class EspecialidadesControlador {

   constructor(){
    this.especialidades = new EspecialidadesServicio();
   }
   buscarTodas = async (req, res) => {
  
      try{
        //  const sql = "SELECT * FROM especialidades WHERE activo = 1";    sacar esto y ponerlo en base de datos
         // const [especialidades, fields] = await pool.query(sql);
  
        //  console.log(fields); // METADATOS DE LA BASE DE DATOS
         const especialidades = await this.especialidades.buscarTodas();   // creo esto

          res.status(200).send(
              {
                  'estado': true, 
                  'especialidades': especialidades
              }
          );
  
      }catch(error) {
          console.log(`Error en get / Especialidades ${error}`);
          res.status(500).json({
              'estado': false, 
              'msg': 'Error Interno '

          })
      }

}

buscarPorId = async (req, res) => {
  
      try{
        //  const sql = "SELECT * FROM especialidades WHERE activo = 1";    sacar esto y ponerlo en base de datos
         // const [especialidades, fields] = await pool.query(sql);
  
        //  console.log(fields); // METADATOS DE LA BASE DE DATOS
         const especialidades = await this.especialidades.buscarPorId(id);   // creo esto

          res.status(200).send(
              {
                  'estado': true, 
                  'especialidades': especialidades
              }
          );
  
      }catch(error) {
          console.log(error);
      }

}

borrar = async (req, res) => {
  
      try{
        //  const sql = "SELECT * FROM especialidades WHERE activo = 1";    sacar esto y ponerlo en base de datos
         // const [especialidades, fields] = await pool.query(sql);
  
        //  console.log(fields); // METADATOS DE LA BASE DE DATOS
         const especialidades =  await this.especialidades.borrar();   // creo esto

          res.status(200).send(
              {
                  'estado': true, 
                  'especialidades': especialidades
              }
          );
  
      }catch(error) {
          console.log(error);
      }

}

modificar = async (req, res) => {
  
      try{
        //  const sql = "SELECT * FROM especialidades WHERE activo = 1";    sacar esto y ponerlo en base de datos
         // const [especialidades, fields] = await pool.query(sql);
  
        //  console.log(fields); // METADATOS DE LA BASE DE DATOS
         const especialidades =  await this.especialidades.modificar();   // creo esto

          res.status(200).send(
              {
                  'estado': true, 
                  'especialidades': especialidades
              }
          );
  
      }catch(error) {
          console.log(error);
      }

}

crear = async (req, res) => {
  
      try{
        //  const sql = "SELECT * FROM especialidades WHERE activo = 1";    sacar esto y ponerlo en base de datos
         // const [especialidades, fields] = await pool.query(sql);
  
        //  console.log(fields); // METADATOS DE LA BASE DE DATOS
         const especialidades =  await this.especialidades.crear();   // creo esto

          res.status(200).send(
              {
                  'estado': true, 
                  'especialidades': especialidades
              }
          );
  
      }catch(error) {
          console.log(error);
      }

}


}

