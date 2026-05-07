import Especialidades from "../db/especialidades.js";

export default class EspecialidadesServicio {

constructor(){
    this.especialidades = new Especialidades();

 }
    
    buscarTodas = async() => {
        return await this.especialidades.buscarTodas();

    }

    buscarPorId = async(id) => {
        return await this.especialidades.buscarPorId(id);

    }

    borrar = async(id) => {
        return await this.especialidades.borrar(id);

    }

    modificar = async(id) => {
        return await this.especialidades.modificar(id);

    }

    crear = async(nombre) => {
        return await this.especialidades.crear(nombre);

    }

}