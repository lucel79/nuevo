import Especialidades from "../db/especialidades.js";

export default class EspecialidadesServicio {

constructor(){
    this.especialidades = new Especialidades();

 }
    
    buscarTodas = (id) => {
        return this.especialidades.buscarTodas();

    }

    buscarPorId = () => {
        return this.especialidades.buscarPorId();

    }

    borrar = () => {
        return this.especialidades.borrar();

    }

    modificar = () => {
        return this.especialidades.modificar();

    }

    crear = () => {
        return this.especialidades.crear();

    }

}