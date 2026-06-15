process.loadEnvFile();

import app from './turnos.js';

app.listen(process.env.PUERTO || 3006, () => {
    console.log(`servidor iniciado OK en puerto ${process.env.PUERTO}`);
})