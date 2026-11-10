'use strict';

const MENSAJES = {
  SIN_INGRESOS: 'No registraste ingresos en este periodo; no es posible estimar un margen disponible.',
  DEFICIT_ACTUAL: 'Antes de la nueva cuota, tus egresos ya superan tus ingresos.',
  DEFICIT_SIMULADO: 'Con esta cuota, tus egresos superarían tus ingresos.',
  MARGEN_ESTRECHO: 'Con esta cuota te quedaría menos del 10 % de tus ingresos como margen.',
  MARGEN_POSITIVO: 'Con esta cuota conservarías un margen positivo.',
};

const pesos = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const pct = (v) => (v === null ? 'no aplica (sin ingresos)' : `${(v * 100).toFixed(1)} %`);

function formatearInforme(resultado) {
  const t = resultado.totales;
  return [
    'INFORME COMPARATIVO - FinUCompensar (prueba de concepto)',
    `Reglas v${resultado.versionReglas}`,
    '',
    `Ingresos:               ${pesos.format(t.ingreso)}`,
    `Gastos:                 ${pesos.format(t.gasto)}`,
    `Obligaciones actuales:  ${pesos.format(t.obligacion)}`,
    `Ahorro programado:      ${pesos.format(t.ahorro)}`,
    '',
    `Margen actual:          ${pesos.format(resultado.margenActual)}`,
    `Margen simulado:        ${pesos.format(resultado.margenSimulado)}`,
    `Variación:              ${pesos.format(resultado.variacion)}`,
    `Obligaciones/ingresos:  ${pct(resultado.proporcionObligacionesActual)} -> ${pct(resultado.proporcionObligacionesSimulada)}`,
    '',
    'Alertas educativas:',
    ...resultado.alertas.map((codigo) => `  - [${codigo}] ${MENSAJES[codigo]}`),
    '',
    `AVISO: ${resultado.aviso}`,
  ].join('\n');
}

module.exports = { MENSAJES, formatearInforme };
