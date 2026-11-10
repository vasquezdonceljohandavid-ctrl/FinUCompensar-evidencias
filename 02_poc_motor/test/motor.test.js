'use strict';

const { describe, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { analizarEscenario, totalizar, ErrorValidacion, VERSION_REGLAS } = require('../src/motor');
const { formatearInforme, MENSAJES } = require('../src/informe');

const { escenarios } = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'datos', 'escenarios_semilla.json'), 'utf8'),
);

const base = () => ({
  movimientos: [
    { tipo: 'ingreso', valor: 1000000 },
    { tipo: 'gasto', valor: 400000 },
  ],
  obligacionNueva: { valor: 1000000, cuota: 100000, plazoMeses: 10 },
});

describe('PN - Consistencia numérica contra escenarios semilla (desviación permitida: 0 pesos)', () => {
  for (const e of escenarios) {
    test(`PN-${e.id} ${e.descripcion}`, () => {
      const r = analizarEscenario(e);
      assert.equal(r.margenActual, e.esperado.margenActual, 'margen actual');
      assert.equal(r.margenSimulado, e.esperado.margenSimulado, 'margen simulado');
      assert.equal(r.variacion, e.esperado.variacion, 'variación');
      assert.equal(r.condicion, e.esperado.condicion, 'condición de salida');
      assert.deepEqual(r.alertas, e.esperado.alertas, 'alertas educativas');
    });
  }
});

describe('PF - Reglas funcionales del motor', () => {
  test('PF-01 la nueva cuota se descuenta una sola vez (sin doble descuento)', () => {
    const r = analizarEscenario(base());
    assert.equal(r.totales.obligacion, 0);
    assert.equal(r.margenActual - r.margenSimulado, 100000);
  });

  test('PF-02 el análisis no modifica los datos de entrada', () => {
    const entrada = base();
    const copia = structuredClone(entrada);
    analizarEscenario(entrada);
    assert.deepEqual(entrada, copia);
  });

  test('PF-03 suma correctamente varios movimientos del mismo tipo', () => {
    const t = totalizar([
      { tipo: 'gasto', valor: 1 },
      { tipo: 'gasto', valor: 2 },
      { tipo: 'ingreso', valor: 10 },
    ]);
    assert.deepEqual(t, { ingreso: 10, gasto: 3, ahorro: 0, obligacion: 0 });
  });

  test('PF-04 el resultado declara la versión de reglas utilizada', () => {
    assert.equal(analizarEscenario(base()).versionReglas, VERSION_REGLAS);
  });

  test('PF-05 calcula la proporción de ingresos comprometida en obligaciones', () => {
    const e = escenarios.find((x) => x.id === 'S10');
    const r = analizarEscenario(e);
    assert.equal(r.proporcionObligacionesActual, 980000 / 4750000);
    assert.equal(r.proporcionObligacionesSimulada, 1405000 / 4750000);
  });

  test('PF-06 sin ingresos, la proporción no se calcula (evita división por cero)', () => {
    const r = analizarEscenario(escenarios.find((x) => x.id === 'S06'));
    assert.equal(r.proporcionObligacionesActual, null);
    assert.equal(r.proporcionObligacionesSimulada, null);
  });
});

describe('PV - Validación de entradas', () => {
  const casos = [
    ['PV-01 rechaza valores negativos', (e) => { e.movimientos[0].valor = -1; }],
    ['PV-02 rechaza valores con decimales', (e) => { e.movimientos[0].valor = 1000.5; }],
    ['PV-03 rechaza tipos de movimiento desconocidos', (e) => { e.movimientos[0].tipo = 'prestamo'; }],
    ['PV-04 rechaza cuota igual a cero', (e) => { e.obligacionNueva.cuota = 0; }],
    ['PV-05 rechaza plazo igual a cero', (e) => { e.obligacionNueva.plazoMeses = 0; }],
    ['PV-06 rechaza movimientos que no son una lista', (e) => { e.movimientos = {}; }],
    ['PV-07 exige la obligación a simular', (e) => { delete e.obligacionNueva; }],
    ['PV-08 rechaza valores enviados como texto', (e) => { e.movimientos[0].valor = '1000000'; }],
  ];
  for (const [nombre, alterar] of casos) {
    test(nombre, () => {
      const e = base();
      alterar(e);
      assert.throws(() => analizarEscenario(e), ErrorValidacion);
    });
  }
});

describe('PE - Lenguaje educativo y límites del sistema (RF-07)', () => {
  test('PE-01 todo resultado incluye el aviso de estimación educativa', () => {
    for (const e of escenarios) {
      assert.match(analizarEscenario(e).aviso, /No es una aprobación ni un rechazo de crédito/);
    }
  });

  test('PE-02 el resultado no contiene campos de aprobación o puntaje crediticio', () => {
    const claves = Object.keys(analizarEscenario(base())).join(' ').toLowerCase();
    assert.doesNotMatch(claves, /aprob|score|puntaje|rechaz/);
  });

  test('PE-03 cada alerta generada tiene un mensaje educativo definido', () => {
    for (const e of escenarios) {
      for (const codigo of analizarEscenario(e).alertas) {
        assert.ok(MENSAJES[codigo], `falta mensaje para ${codigo}`);
      }
    }
  });

  test('PE-04 el informe de texto muestra márgenes, alertas y aviso', () => {
    const texto = formatearInforme(analizarEscenario(escenarios[0]));
    assert.match(texto, /Margen actual/);
    assert.match(texto, /Margen simulado/);
    assert.match(texto, /DEFICIT_SIMULADO/);
    assert.match(texto, /AVISO:/);
  });
});
