                                             API REST - CLINICA MEDICA

-----------------------------------------------------------------------------------

                                               ALUMNOS

-----------------------------------------------------------------

                                               GRUPO 


------------------------------------------------------------------

                                       CARACTERISTICAS

•	✅ Autenticación JWT 

•	✅ Autorización por roles (Admin, Empleado, Cliente)

•	✅ BREAD completo

•	✅ Validaciones con express-validator

•	✅ Documentación Swagger

•	✅ Soft delete 

•	✅ Procedimientos almacenados 

•	✅ Generación de reportes PDF/CSV

•	✅  CORS, Multer

---------------------------------------------------------------
Npm run dev

Estructura de roles

Medico  Rrol = 1

Paciente Rol = 2

Administrador Rol 3


Documentación

Swagger UI disponible en: http://localhost:3006/api/v1/docs

-------------------------------------------------------------------

Se debe agregar a la db




DELIMITER $$
 
DROP PROCEDURE IF EXISTS sp_estadisticas_atenciones$$
CREATE PROCEDURE sp_estadisticas_atenciones()
BEGIN
    SELECT
        COUNT(*)                        AS total_turnos,
        SUM(atentido = 1)               AS turnos_atendidos,
        SUM(atentido = 0)               AS turnos_pendientes,
        SUM(valor_total)                AS recaudacion_total,
        AVG(valor_total)                AS ticket_promedio,
        MIN(fecha_hora)                 AS primer_turno,
        MAX(fecha_hora)                 AS ultimo_turno
    FROM turnos_reservas
    WHERE activo = 1;
END$$
 

DROP PROCEDURE IF EXISTS sp_atenciones_por_obra_social$$
CREATE PROCEDURE sp_atenciones_por_obra_social()
BEGIN
    SELECT
        os.nombre                        AS obra_social,
        os.porcentaje_descuento,
        COUNT(tr.id_turno_reserva)       AS total_turnos,
        SUM(tr.atentido = 1)             AS atendidos,
        SUM(tr.valor_total)              AS recaudacion
    FROM turnos_reservas tr
    INNER JOIN obras_sociales os ON os.id_obra_social = tr.id_obra_social
    WHERE tr.activo = 1
    GROUP BY os.id_obra_social, os.nombre, os.porcentaje_descuento
    ORDER BY total_turnos DESC;
END$$
 

DROP PROCEDURE IF EXISTS sp_atenciones_por_medico$$
CREATE PROCEDURE sp_atenciones_por_medico()
BEGIN
    SELECT
        CONCAT(u.nombres, ' ', u.apellido) AS medico,
        e.nombre                            AS especialidad,
        COUNT(tr.id_turno_reserva)          AS total_turnos,
        SUM(tr.atentido = 1)                AS atendidos,
        SUM(tr.valor_total)                 AS recaudacion
    FROM turnos_reservas tr
    INNER JOIN medicos m   ON m.id_medico        = tr.id_medico
    INNER JOIN usuarios u  ON u.id_usuario        = m.id_usuario
    INNER JOIN especialidades e ON e.id_especialidad = m.id_especialidad
    WHERE tr.activo = 1
    GROUP BY m.id_medico, u.nombres, u.apellido, e.nombre
    ORDER BY recaudacion DESC;
END$$
 
DELIMITER ;
 

ALTER TABLE turnos_reservas
    ADD COLUMN IF NOT EXISTS observaciones TEXT DEFAULT NULL AFTER atentido;



