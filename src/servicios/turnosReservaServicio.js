import TurnosReservas from "../db/turnosReserva.js";
import MedicosServicio from "../servicios/medicosServicios.js";
import PacientesServicio from "../servicios/pacientesServicio.js";
import ObrasSocialesServicio from "../servicios/obrasSocialesServicios.js";
import InformeServicio from "../servicios/informeServicio.js";

export default class TurnosReservasServicio {

    constructor(){
        this.turnosReservas = new TurnosReservas();
        this.medicos = new MedicosServicio();
        this.pacientes = new PacientesServicio();
        this.obrasSociales = new ObrasSocialesServicio();
        this.informes = new InformeServicio();
    }
    porEspecialidad = async () => {
        
        const datos = await this.turnosReservas.porEspecialidad();
                
        const pdf = await this.informes.reportePorEspecialidades(datos);
       

        return {
            buffer: pdf, 
            headers: {
                'Content-Type': 'application/pdf', 
                'Content-Disposition':'inline; filename = "reporte.pdf"'
            }
        }
    }

    buscarTodas = async (usuario) => {
        
        if (usuario.rol === 1){
            return this.turnosReservas.turnosDeUnMedico(usuario.id_usuario);
        }else{
            
            return this.turnosReservas.turnosDeUnPaciente(usuario.id_usuario);
        }
    }

    crear = async (turnoReserva) => {
        const medico = await this.medicos.buscarPorId(turnoReserva.id_medico);

        const paciente = await this.pacientes.buscarPorId(turnoReserva.id_paciente);

        const obra_social = await this.obrasSociales.buscarPorId(paciente.id_obra_social);

        let valor = parseFloat (medico.valor_consulta);
        
        if(obra_social.es_particular === 0){
            const descuento = (parseFloat(obra_social.porcentaje_descuento) / 100  ) * valor;
            valor = parseFloat((valor -descuento).toFixed(2));
        }
        
        turnoReserva.valor_total = valor;
        turnoReserva.id_obra_social = paciente.id_obra_social;

        const id_nuevo = await this.turnosReservas.crear(turnoReserva);
        return id_nuevo;
    }
    
    verificarAtendido = async(id_turno_reserva, id_usuario, observaciones) => {
        const turno = await this.turnosReservas.buscarPorId(id_turno_reserva);
          if(!turno) return null;

        const medico = await this.medicos.buscarPorIdUsuario(id_usuario);
        if (!medico || turno.id_medico !== medico.id_medico) return false;
        
        return this.turnosReservas.verificarAtendido(id_turno_reserva, observaciones);
    }
}