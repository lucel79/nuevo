import express from "express";
import fs from "fs";
import morgan from "morgan";
import passport from "passport";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


import { estrategia, validacion} from './config/passport.js';
import { router as v1EspecialidadesRutas } from "./rutas/v1/especialidadesRutas.js";
import { router as v1ObrasSocialesRutas } from "./rutas/v1/obrasSocialesRutas.js";
import { router as v1MedicosRutas } from "./rutas/v1/medicosRutas.js";
import { router as v1TurnosReservas } from "./rutas/v1/turnosReservasRutas.js";
import { router as v1Usuarios } from "./rutas/v1/usuarioRutas.js";
import { router as v1AuthRutas} from "./rutas/v1/authRutas.js"
import { testConexion } from "./db/testConexion.js"

const app = express();
await testConexion();

app.use(cors());
app.use(express.json());

passport.use(estrategia);
passport.use(validacion);
app.use(passport.initialize());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Clínica Médica',
            version: '1.0.0',
            description: 'Documentación de la API para el sistema de turnos',
        },
        servers: [
            {
                //url: `http://localhost:${process.env.APP_PORT || 3006}`,
                url: 'http://localhost:3006', 
                description: 'Servidor Local',
            },
        ],
    },

    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Ingresá tu token JWT sin la palabra Bearer delante.'
            }
        }
    },
    // (Opcional) Hace que toda la API pida token por defecto, o lo manejás ruta por ruta
    security: [
        {
            bearerAuth: [],
        },
    ],


    
    apis: ['./src/rutas/v1/*.js'], 
};
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs,{
    customSiteTitle:'Api clinica Medica',
    swaggerOptions:{
        persistAuthorization: true
    }

}));


let log = fs.createWriteStream('./accesos.log', { 
    flags: 'a'
});

app.use(morgan('dev'));
app.use(morgan('combined', {stream: log}));

app.get('/api/v1/docs.json', (req,res)=>{
    res.setHeader('content-Type','application/json' );
    res.send(swaggerSpecs);
})


app.get('/', (req, res) => {
    res.status(200).send({'estado': true, 'msg': 'API OK', docs:'/api/v1/docs'});
})

app.use('/api/v1/auth', v1AuthRutas);

app.use('/api/v1/obras-sociales', v1ObrasSocialesRutas);
app.use('/api/v1/medicos', v1MedicosRutas);

// RUTAS QUE NECESITAN AUTORIZACIÓN
app.use('/api/v1/especialidades', passport.authenticate('jwt', {session:false}), v1EspecialidadesRutas);

app.use('/api/v1/turnos-reservas', passport.authenticate('jwt', {session:false}), v1TurnosReservas);
//app.use('/api/v1/turnos-reservas',  v1TurnosReservas);

app.use('/api/v1/usuarios', passport.authenticate('jwt', {session:false}), v1Usuarios);
//app.use('/api/v1/usuarios', v1Usuarios);




export default app;