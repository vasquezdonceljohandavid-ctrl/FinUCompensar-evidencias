'use strict';

// Motor de cálculo de FinUCompensar - reglas v1.0.0 (ver docs/reglas_v1.md).
// Los valores se manejan en pesos colombianos enteros para evitar errores de coma flotante.

const VERSION_REGLAS = '1.0.0';
const UMBRAL_MARGEN_ESTRECHO = 0.10;
const TIPOS = ['ingreso', 'gasto', 'ahorro', 'obligacion'];

const AVISO_EDUCATIVO =
  'Estimación educativa basada únicamente en los datos que registraste. ' +
  'No es una aprobación ni un rechazo de crédito, no consulta centrales de riesgo ' +
  'y no sustituye la asesoría de un profesional.';

class ErrorValidacion extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ErrorValidacion';
  }
}

function validarEnteroNoNegativo(valor, campo) {
  if (!Number.isInteger(valor) || valor < 0) {
    throw new ErrorValidacion(`${campo} debe ser un entero mayor o igual a 0 (pesos COP)`);
  }
}

function validarEnteroPositivo(valor, campo) {
  if (!Number.isInteger(valor) || valor <= 0) {
    throw new ErrorValidacion(`${campo} debe ser un entero mayor que 0`);
  }
}

function totalizar(movimientos) {
  if (!Array.isArray(movimientos)) {
    throw new ErrorValidacion('movimientos debe ser una lista');
  }
  const totales = { ingreso: 0, gasto: 0, ahorro: 0, obligacion: 0 };
  movimientos.forEach((mov, i) => {
    if (!mov || !TIPOS.includes(mov.tipo)) {
      throw new ErrorValidacion(`movimiento ${i}: tipo no válido`);
    }
    validarEnteroNoNegativo(mov.valor, `movimiento ${i}: valor`);
    totales[mov.tipo] += mov.valor;
  });
  return totales;
}

function validarObligacion(obligacion) {
  if (!obligacion || typeof obligacion !== 'object') {
    throw new ErrorValidacion('obligacionNueva es obligatoria');
  }
  validarEnteroPositivo(obligacion.valor, 'obligacionNueva.valor');
  validarEnteroPositivo(obligacion.cuota, 'obligacionNueva.cuota');
  validarEnteroPositivo(obligacion.plazoMeses, 'obligacionNueva.plazoMeses');
}

function margen(totales) {
  return totales.ingreso - totales.gasto - totales.obligacion - totales.ahorro;
}

function proporcion(numerador, ingreso) {
  return ingreso > 0 ? numerador / ingreso : null;
}

function generarAlertas(totales, margenActual, margenSimulado) {
  const alertas = [];
  if (totales.ingreso === 0) alertas.push('SIN_INGRESOS');
  if (margenActual < 0) alertas.push('DEFICIT_ACTUAL');
  if (margenSimulado < 0) {
    alertas.push('DEFICIT_SIMULADO');
  } else if (totales.ingreso > 0 && margenSimulado < totales.ingreso * UMBRAL_MARGEN_ESTRECHO) {
    alertas.push('MARGEN_ESTRECHO');
  } else if (totales.ingreso > 0) {
    alertas.push('MARGEN_POSITIVO');
  }
  return alertas;
}

function analizarEscenario({ movimientos, obligacionNueva }) {
  const totales = totalizar(movimientos);
  validarObligacion(obligacionNueva);

  const margenActual = margen(totales);
  const margenSimulado = margenActual - obligacionNueva.cuota;

  return {
    versionReglas: VERSION_REGLAS,
    totales,
    margenActual,
    margenSimulado,
    variacion: margenSimulado - margenActual,
    condicion: margenSimulado < 0 ? 'NEGATIVO' : 'POSITIVO_O_CERO',
    proporcionObligacionesActual: proporcion(totales.obligacion, totales.ingreso),
    proporcionObligacionesSimulada: proporcion(totales.obligacion + obligacionNueva.cuota, totales.ingreso),
    alertas: generarAlertas(totales, margenActual, margenSimulado),
    aviso: AVISO_EDUCATIVO,
  };
}

const motor = {
  VERSION_REGLAS,
  UMBRAL_MARGEN_ESTRECHO,
  AVISO_EDUCATIVO,
  ErrorValidacion,
  totalizar,
  analizarEscenario,
};

// El mismo archivo lo usan Node (pruebas y CLI) y el navegador (web/), para que ambos calculen con idénticas reglas.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = motor;
} else {
  globalThis.FinMotor = motor;
}
