# Plan de pruebas - FinUCompensar (actividad EDT 5.1.1)

Versión: 1.0 | Fecha: 10/11/2026 | Responsable: Alejandro Forero Saavedra | Ejecución técnica: Rolando Stiven Ramírez Rozo

## 1. Objetivo y alcance

Verificar que el producto calcula correctamente (R04), no induce a interpretar el resultado como aprobación crediticia (R06), valida sus entradas y protege los datos. En esta versión se prueba el motor de cálculo (incremento 0), que también usa la interfaz web local (incremento 1); los casos de seguridad, usabilidad con usuarios e integración quedan definidos y pendientes de la autenticación y la base de datos.

## 2. Ambiente y datos

- Windows 10.0.26200, Node.js v24.14.1, ejecutor nativo `node:test`, sin dependencias externas.
- Datos 100 % sintéticos: `02_poc_motor/datos/escenarios_semilla.json` (10 escenarios, 5 de frontera).
- Oráculo independiente: valores esperados calculados manualmente y hoja `Hoja_control_calculo` del archivo de control (fórmulas de Excel).

## 3. Criterios

- **Entrada:** reglas v1.0.0 aprobadas (`docs/reglas_v1.md`) y escenarios semilla definidos.
- **Aprobación:** 100 % de casos críticos aprobados y desviación de 0 pesos en los 10 escenarios.
- **Bloqueo:** cualquier desviación numérica o un hallazgo de seguridad alto bloquea la liberación hasta corregir y repetir la regresión.

## 4. Casos

| ID | Tipo | Requisito | Crítico | Estado al 10/11 |
|---|---|---|---|---|
| PN-S01 a PN-S10 | Numérica: margen actual, simulado, variación, condición y alertas | RF-04, RF-06 | Sí | Aprobados (10/10) |
| PF-01 a PF-06 | Funcional: doble descuento, inmutabilidad, sumas, versión, proporciones, división por cero | RF-02, RF-04, RF-06, RNF-05, RD-01 | Sí | Aprobados (6/6) |
| PV-01 a PV-08 | Validación: negativos, decimales, tipos, cuota y plazo cero, estructura, texto | RF-02, RF-05 | Sí | Aprobados (8/8) |
| PE-01 a PE-04 | Contenido educativo: aviso, sin campos de aprobación, mensajes, informe | RF-07 | Sí | Aprobados (4/4) |
| PS-01 | Seguridad: contraseña con hash, nunca en texto plano | RF-01, RS-01 | Sí | Pendiente (requiere autenticación) |
| PS-02 | Seguridad: una cuenta no accede a datos de otra | RD-01, RF-09 | Sí | Pendiente (requiere autenticación) |
| PS-03 | Seguridad: secretos fuera de Git | RS-02 | Sí | Pendiente (requiere ambiente desplegado) |
| PU-01 | Usabilidad: 4 de 5 usuarios explican el escenario sin ayuda | RNF-04, RF-07 | Sí | Pendiente (30/11 a 03/12) |
| PU-02 | Usabilidad: flujo en computador y teléfono | RNF-01 | No | Pendiente con usuarios; revisión visual preliminar a 1300 px y 390 px (`capturas/`) |
| PI-01 | Integración: registro, simulación e informe de punta a punta | RF-03, RF-08 | Sí | Pendiente |

## 5. Protocolo de la prueba de usabilidad PU-01 (planificado)

1. Aviso de finalidad y tratamiento de datos (Ley 1581 de 2012); solo datos sintéticos entregados por el equipo.
2. Tarea: registrar el mes de ejemplo, simular la cuota indicada y abrir el informe, sin ayuda.
3. Pregunta: "Explique con sus palabras qué le pasaría a su presupuesto si acepta esta cuota". Se acepta si menciona el cambio de margen y no interpreta el resultado como aprobación.
4. Registro: tiempo, errores, preguntas y respuesta. Meta: al menos 4 de 5 usuarios.

## 6. Resultados

Ver `reporte_pruebas.txt` (formato spec), `reporte_pruebas.xml` (JUnit), `salida_demo_escenarios.txt` y las capturas de la interfaz web en `capturas/` (S01, S02 y S04 en escritorio; S03 en ancho de teléfono), cuyas cifras coinciden con la salida de consola. Defectos encontrados al construir la PoC: DEF-01 (codificación de archivos), DEF-02 (ruta del ejecutor de pruebas) y DEF-08 (codificación mixta al adaptar el motor al navegador), todos cerrados el 10/11/2026.
