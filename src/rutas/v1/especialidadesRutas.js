import express from "express";

import EspecialidadesControlador from "../../controladores/especialidadesControlador.js";

const router = express.Router();


const especialidadesControlador = new EspecialidadesControlador();


router.get('/', especialidadesControlador.buscarTodas);
router.get('/:id', especialidadesControlador.buscarPorId);
router.post('/', especialidadesControlador.crear);
router.put('/:id', especialidadesControlador.modificar);
router.delete('/:id', especialidadesControlador.borrar);


export { router};

