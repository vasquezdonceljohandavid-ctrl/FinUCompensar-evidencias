# FinUCompensar - Repositorio de evidencias (Actividad 6, Gestión de Proyectos 2026-2)

Plataforma web educativa de análisis financiero personal y simulación del impacto de una nueva obligación para estudiantes de UCompensar en práctica empresarial.

- **Equipo:** Johan David Vásquez Doncel (director), Alejandro Forero Saavedra (calidad, riesgos y comunicaciones), Rolando Stiven Ramírez Rozo (responsable técnico).
- **Docente / patrocinador:** Alexander Reyes Moreno, PhD. Ing.
- **Fecha de corte:** 10/11/2026 (semana 13 de 16).
- **Modalidad:** prueba de concepto (motor de cálculo e interfaz web local implementados y probados) + simulación técnica del resto del MVP.
- **Datos:** 100 % sintéticos. El repositorio no contiene datos personales, credenciales ni llaves de acceso.

> FinUCompensar es una herramienta educativa: no aprueba ni rechaza créditos, no consulta centrales de riesgo y no sustituye la asesoría profesional.

## Estructura (una carpeta por tipo de evidencia)

| Carpeta | Contenido | Sección del informe |
|---|---|---|
| `01_lineas_base/` | Actividades 1 a 5 y Preguntas de fundamentación (líneas base aprobadas) | 2 |
| `02_poc_motor/` | Código del motor de cálculo, CLI, interfaz web local, pruebas automáticas, escenarios semilla, reglas v1.0.0 y esquema de datos borrador | 4, 7 |
| `03_pruebas/` | Plan de pruebas, reportes de ejecución (TXT y JUnit XML), salida de los 10 escenarios y capturas de la interfaz web | 7 |
| `04_control/` | Archivo de seguimiento y control (XLSX, 18 hojas con fórmulas) | 5 a 10 |
| `05_cambios_y_riesgos/` | Solicitudes de cambio CR-01 a CR-03 con análisis de impacto | 8 |
| `06_comunicaciones/` | Registro de comunicaciones y plantilla de acta semanal | 9 |

## Cómo abrir la interfaz web

```bash
cd 02_poc_motor
npm run web
```

Luego abre <http://localhost:3000> en el navegador. Puedes cargar un ejemplo desde el selector o directamente con <http://localhost:3000/web/?ejemplo=S01> (S01 a S10). La web usa el mismo `src/motor.js` que las pruebas, no guarda datos y solo escucha en el propio computador. Para detenerla: `Ctrl + C`.

## Cómo reproducir las pruebas

Requisito: Node.js 20 o superior (probado con v24.14.1). No hay dependencias externas.

```bash
cd 02_poc_motor
npm test                                           # 28 pruebas: numéricas, funcionales, validación y contenido educativo
npm run demo -- datos/escenarios_semilla.json S01  # informe comparativo de un escenario (S01 a S10)
npm run test:reporte                               # regenera 03_pruebas/reporte_pruebas.txt y .xml
```

Resultado del 10/11/2026: 28 pruebas, 28 aprobadas, 0 fallidas. Los 10 escenarios semilla coinciden con la hoja `Hoja_control_calculo` del archivo de control con desviación de 0 pesos.

## Estado a la fecha de corte

| Entregable | Estado |
|---|---|
| E01 Requisitos | Cumple criterio (18 requisitos priorizados y trazados) |
| E03 Modelo de datos y reglas | 75 %: reglas v1.0.0 verificadas; esquema sin ejecutar |
| E04 Incrementos | Incremento 0 (motor + CLI) e incremento 1 (interfaz web local) completos; faltan autenticación y base de datos |
| E05 Pruebas | 28 de 34 casos ejecutados (100 % aprobados) |
| Resto (E02, E06-E09) | En curso o pendientes según la replanificación CR-03 |

El detalle completo está en el informe técnico y en el archivo de control.
