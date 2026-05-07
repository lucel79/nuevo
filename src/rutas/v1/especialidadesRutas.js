import express from "express";

import EspecialidadesControlador from "../../controladores/especialidadesControlador.js";

const router = express.Router();


const especialidadesControlador = new EspecialidadesControlador();


router.get('/', especialidadesControlador.buscarTodas);
router.get('/:id_especialidades', especialidadesControlador.buscarPorId);
router.post('/:id_especialidades', especialidadesControlador.crear);
router.put('/:id_especialidades', especialidadesControlador.modificar);
router.delete('/:id_especialidades', especialidadesControlador.borrar);


export { router};

