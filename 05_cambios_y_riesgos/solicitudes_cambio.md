# Registro de solicitudes de cambio - FinUCompensar

Procedimiento (Act. 3, sección 6.2): toda solicitud se registra con análisis de impacto sobre alcance, tiempo, costo, calidad y riesgos. Los cambios que alteran la triple restricción, la evaluación o la ética del caso se escalan al patrocinador académico.

Tipo de dato: R = real, S = simulado.

---

## CR-01 - Cambio de plataforma de despliegue a AWS y nueva línea base de caja (R)

| Campo | Detalle |
|---|---|
| Solicitante | Equipo del proyecto |
| Fecha de solicitud | 09/10/2026 |
| Fecha de decisión | 14/10/2026 (Actividad 5) |
| Descripción | Reemplazar el hosting gratuito (Vercel Hobby) por la arquitectura S3 + CloudFront, API Gateway, Lambda y RDS PostgreSQL |
| Impacto en alcance | Ninguno (mismas funciones) |
| Impacto en tiempo | Ninguno en la línea base |
| Impacto en costo | Caja de $71.500 a $300.000 COP (+$228.500; +319,6 %) |
| Impacto en riesgos | Nueva dependencia de proveedor y variación de costo (R14); NAT y servicios extra no incluidos |
| Decisión | Aprobado por el equipo y presentado al patrocinador en la Actividad 5 |
| Línea base actualizada | Presupuesto de caja |
| Lección | Se aplicó sin formulario previo y produjo cifras distintas entre documentos (DEF-03). Se formaliza en este registro. |

## CR-02 - Integración bancaria automática (S)

| Campo | Detalle |
|---|---|
| Solicitante | Usuario simulado (escenario 1 de la Actividad 3) |
| Fecha de solicitud y decisión | 30/09/2026 (reconfirmada el 07/10/2026 en la Actividad 4) |
| Alternativas | A. Aceptar: +4 semanas y hasta +$120.000. B. Sustituir otra función: +1 semana y hasta +$60.000. C. Entrega por fases: sin impacto en la línea base |
| Decisión | C. Rechazado para el MVP y diferido a una fase futura |
| Justificación | Aumenta el alcance, la dependencia externa y la superficie de datos personales |
| Línea base actualizada | No |

## CR-03 - Replanificación de las semanas 13 a 16 con reducción controlada del alcance (R; plan resultante S)

| Campo | Detalle |
|---|---|
| Solicitante | Johan David Vásquez Doncel (director) |
| Fecha de solicitud | 10/11/2026 |
| Motivo | SPI 0,52 al corte; 212,5 h restantes en 3,7 semanas exigirían 57,2 h-equipo por semana (línea base: 22,5) |
| Alternativas | A. Mantener el alcance y mover el cierre al 15/01/2027. B. Mantener alcance y fecha con más horas (inviable). C. Mantener la fecha y reducir el alcance |
| Decisión | C. Aprobado por el equipo el 10/11/2026; escalado al patrocinador con el informe técnico |
| Se mantiene | RF-01 (autenticación básica), RF-02 (un periodo), RF-04, RF-05, RF-06, RF-07, RS-01, RD-01, RNF-05 |
| Se difiere | Despliegue en AWS (demo local + video), RF-08 historial multi-mes, RF-09 automatizado (procedimiento manual), wireframes de alta fidelidad |
| No cambia | Exclusiones éticas, datos sintéticos, fecha de cierre 06/12/2026 |
| Impacto | Tiempo: 0 días frente al 06/12. Esfuerzo replanificado: 106 h (28,5 h-equipo por semana). Caja proyectada: $30.722 |
| Plan alterno | Si en el corte del 22/11 el avance es menor al 80 %, se entrega la PoC con demostración por consola y simulación técnica |
| Línea base actualizada | Cronograma (revisión 1) y alcance del MVP, una vez avalado por el patrocinador |
