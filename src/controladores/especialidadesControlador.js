import EspecialidadesServicio from "../servicios/especialidadesServicios.js";

export default class EspecialidadesControlador {

   constructor(){
    this.especialidades = new EspecialidadesServicio();
   }
   buscarTodas = async (req, res) => {
  
      try{
       
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
        
        const { id } = req.params; 
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
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ 'estado': false, 'msg': 'El nombre es requerido' });
        }

        const resultado = await this.especialidades.crear(nombre);
    

          res.status(201).json(
              {
                  'estado': true, 
                  'msg': 'Especialidad creado existosamente',
                  'id': resultado.insertId
              }
          );
  
      }catch(error) {
          console.log("Error creando una especialidad",error);
          res.status(500).json({'estado': false, 'msg': 'Error interno'});
      }
}

}

