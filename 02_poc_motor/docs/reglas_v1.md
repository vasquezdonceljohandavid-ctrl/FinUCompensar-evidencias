# Especificación de reglas del motor de cálculo - v1.0.0

Proyecto: FinUCompensar | Entregable E03 (Modelo de datos y reglas) | Paquete EDT 3.1.3
Fecha de versión: 10/11/2026 | Responsable de la regla: Alejandro Forero Saavedra | Implementación: Rolando Stiven Ramírez Rozo
Origen: reglas preliminares de la Actividad 3 (sección 2.3), formalizadas y versionadas en esta prueba de concepto.

> Las reglas son una decisión educativa del equipo. No son estándares bancarios ni equivalen a capacidad crediticia.

## 1. Entradas

| Entrada | Tipo | Restricción |
|---|---|---|
| `movimientos[]` | lista | Cada movimiento tiene `tipo` en {ingreso, gasto, ahorro, obligacion} y `valor` entero >= 0 en pesos COP |
| `obligacionNueva.valor` | entero | > 0 (valor total de la obligación simulada) |
| `obligacionNueva.cuota` | entero | > 0 (cuota mensual estimada que ingresa el usuario) |
| `obligacionNueva.plazoMeses` | entero | > 0 |

Decisión de diseño: se trabaja en pesos enteros para evitar errores de redondeo de coma flotante (riesgo R04). Una entrada inválida detiene el cálculo con `ErrorValidacion`; el motor no corrige datos en silencio.

## 2. Reglas

| ID | Regla | Fórmula |
|---|---|---|
| RG-01 | Totales por tipo | Suma de `valor` de los movimientos de cada tipo |
| RG-02 | Margen actual | ingresos - gastos - obligaciones actuales - ahorro programado |
| RG-03 | Margen simulado | margen actual - cuota de la obligación nueva (se descuenta una sola vez) |
| RG-04 | Variación | margen simulado - margen actual |
| RG-05 | Condición de salida | `NEGATIVO` si margen simulado < 0; si no, `POSITIVO_O_CERO` |
| RG-06 | Proporción de obligaciones | obligaciones / ingresos (actual) y (obligaciones + cuota) / ingresos (simulada); `null` si ingresos = 0 |

## 3. Alertas educativas

| Código | Condición | Mensaje al usuario |
|---|---|---|
| SIN_INGRESOS | ingresos = 0 | No registraste ingresos en este periodo; no es posible estimar un margen disponible. |
| DEFICIT_ACTUAL | margen actual < 0 | Antes de la nueva cuota, tus egresos ya superan tus ingresos. |
| DEFICIT_SIMULADO | margen simulado < 0 | Con esta cuota, tus egresos superarían tus ingresos. |
| MARGEN_ESTRECHO | 0 <= margen simulado < 10 % de ingresos | Con esta cuota te quedaría menos del 10 % de tus ingresos como margen. |
| MARGEN_POSITIVO | margen simulado >= 10 % de ingresos | Con esta cuota conservarías un margen positivo. |

El umbral del 10 % es un parámetro educativo definido por el equipo (`UMBRAL_MARGEN_ESTRECHO`), no un estándar del sector financiero. Todo resultado incluye el aviso: "Estimación educativa basada únicamente en los datos que registraste. No es una aprobación ni un rechazo de crédito, no consulta centrales de riesgo y no sustituye la asesoría de un profesional."

## 4. Verificación

Cada regla está cubierta por pruebas en `test/motor.test.js` (matriz en `03_pruebas/plan_pruebas.md`). Los 10 escenarios semilla de `datos/escenarios_semilla.json` se contrastan contra valores calculados manualmente y contra la hoja independiente `Hoja_control_calculo` del archivo de control (XLSX). Criterio de aceptación: desviación = 0 pesos en los 10 escenarios. Cualquier cambio de regla exige subir la versión y volver a ejecutar las pruebas.
