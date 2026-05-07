// import ObrasSocialesServicio from "../servicios/obrasSocialesServicios.js";

// export default class ObrasSocialesControlador {

//    constructor(){
//     this.obrasSociales = new ObrasSocialesServicio();
//    }
//    buscarTodas = async (req, res) => {
  
//       try{
       
//          const obrasSociales = this.obrasSociales.buscarTodas();   // creo esto

//           res.status(200).send(
//               {
//                   'estado': true, 
//                   'obrasSociales': obrasSociales
//               }
//           );
  
//       }catch(error) {
//           console.log(`Error en get / obrasSociales ${error}`);
//           res.status(500).json({
//               'estado': false, 
//               'msg': 'Error Interno '

//           })
//       }

// }

// buscarPorId = async (req, res) => {
  
//       try{
        
//          const obrasSociales = this.obrasSociales.buscarPorId();   // creo esto

//           res.status(200).send(
//               {
//                   'estado': true, 
//                   'obrasSociales': obrasSociales
//               }
//           );
  
//       }catch(error) {
//           console.log(error);
//       }

// }

// borrar = async (req, res) => {
  
//       try{
      
//          const obrasSociales = this.obrasSociales.borrar();   // creo esto

//           res.status(200).send(
//               {
//                   'estado': true, 
//                   'obrasSociales': obrasSociales
//               }
//           );
  
//       }catch(error) {
//           console.log(error);
//       }

// }

// modificar = async (req, res) => {
  
//       try{
        
//          const obrasSociales = this.obrasSociales.modificar();   // creo esto

//           res.status(200).send(
//               {
//                   'estado': true, 
//                   'obrasSociales': obrasSociales
//               }
//           );
  
//       }catch(error) {
//           console.log(error);
//       }

// }

// crear = async (req, res) => {
  
//       try{
        
//          const obrasSociales = this.obrasSociales.crear();   // creo esto

//           res.status(200).send(
//               {
//                   'estado': true, 
//                   'obrasSociales': obrasSociales
//               }
//           );
  
//       }catch(error) {
//           console.log(error);
//       }

// }


// }

