import Especialidades from "../db/especialidades.js";

export default class EspecialidadesServicio {

constructor(){
    this.especialidades = new Especialidades();

 }
    
    buscarTodas = async(id) => {
        return await this.especialidades.buscarTodas();

    }

    buscarPorId = async() => {
        return await this.especialidades.buscarPorId();

    }

    borrar = async() => {
        return await this.especialidades.borrar();

    }

    modificar = async() => {
        return await this.especialidades.modificar();

    }

    crear = async() => {
        return await this.especialidades.crear();

    }

}