'use strict';

(() => {
  const { analizarEscenario, ErrorValidacion, AVISO_EDUCATIVO, VERSION_REGLAS } = globalThis.FinMotor;
  const { MENSAJES } = globalThis.FinInforme;

  const TIPOS = [
    ['ingreso', 'Ingreso'],
    ['gasto', 'Gasto'],
    ['obligacion', 'Obligación actual'],
    ['ahorro', 'Ahorro'],
  ];
  const NIVEL_ALERTA = {
    SIN_INGRESOS: 'peligro',
    DEFICIT_ACTUAL: 'peligro',
    DEFICIT_SIMULADO: 'peligro',
    MARGEN_ESTRECHO: 'cuidado',
    MARGEN_POSITIVO: 'bien',
  };
  const MOVIMIENTOS_INICIALES = [
    { tipo: 'ingreso', categoria: 'Apoyo de sostenimiento', valor: '' },
    { tipo: 'gasto', categoria: 'Gastos del hogar', valor: '' },
    { tipo: 'obligacion', categoria: 'Tarjeta de crédito', valor: '' },
    { tipo: 'ahorro', categoria: 'Ahorro programado', valor: '' },
  ];

  const $ = (id) => document.getElementById(id);
  const pesos = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
  const porcentaje = (v) => (v === null ? 'no aplica' : `${(v * 100).toFixed(1)} %`);
  let escenarios = [];

  function crearFila(mov) {
    const fila = document.createElement('div');
    fila.className = 'fila';
    fila.setAttribute('role', 'row');

    const tipo = document.createElement('select');
    tipo.setAttribute('aria-label', 'Tipo');
    TIPOS.forEach(([valor, texto]) => tipo.add(new Option(texto, valor, false, valor === mov.tipo)));

    const categoria = document.createElement('input');
    categoria.type = 'text';
    categoria.maxLength = 60;
    categoria.value = mov.categoria || '';
    categoria.setAttribute('aria-label', 'Concepto');

    const valor = document.createElement('input');
    valor.type = 'number';
    valor.min = '0';
    valor.step = '1';
    valor.inputMode = 'numeric';
    valor.value = mov.valor;
    valor.setAttribute('aria-label', 'Valor en pesos');

    const quitar = document.createElement('button');
    quitar.type = 'button';
    quitar.className = 'quitar';
    quitar.textContent = '×';
    quitar.title = 'Quitar movimiento';
    quitar.addEventListener('click', () => fila.remove());

    fila.append(tipo, categoria, valor, quitar);
    $('movimientos').append(fila);
  }

  function leerEntero(input) {
    return input.value.trim() === '' ? NaN : Number(input.value);
  }

  function leerFormulario() {
    const movimientos = [...$('movimientos').querySelectorAll('.fila')].map((fila) => {
      const [tipo, categoria, valor] = fila.querySelectorAll('select, input');
      return { tipo: tipo.value, categoria: categoria.value.trim(), valor: leerEntero(valor) };
    });
    const obligacionNueva = {
      valor: leerEntero($('ob-valor')),
      cuota: leerEntero($('ob-cuota')),
      plazoMeses: leerEntero($('ob-plazo')),
    };
    return { movimientos, obligacionNueva };
  }

  function segmentos(totales, cuota, margenLibre) {
    const partes = [
      ['gasto', totales.gasto],
      ['obligacion', totales.obligacion],
      ['ahorro', totales.ahorro],
      ['cuota', cuota],
      [margenLibre >= 0 ? 'margen' : 'deficit', Math.abs(margenLibre)],
    ];
    const base = partes.reduce((s, [, v]) => s + v, 0) || 1;
    return partes
      .filter(([, v]) => v > 0)
      .map(([clase, v]) => {
        const seg = document.createElement('span');
        seg.className = `c-${clase}`;
        seg.style.width = `${(v / base) * 100}%`;
        seg.title = pesos.format(v);
        return seg;
      });
  }

  function mostrar(resultado, cuota) {
    const t = resultado.totales;
    $('vacio').hidden = true;
    $('resultado').hidden = false;

    $('r-actual').textContent = pesos.format(resultado.margenActual);
    $('r-actual').className = `cifra ${resultado.margenActual < 0 ? 'negativo' : ''}`;
    $('r-simulado').textContent = pesos.format(resultado.margenSimulado);
    $('r-simulado').className = `cifra ${resultado.condicion === 'NEGATIVO' ? 'negativo' : ''}`;
    $('r-variacion').textContent = `Variación: ${pesos.format(resultado.variacion)} al mes`;
    $('tarjeta-simulado').dataset.nivel = NIVEL_ALERTA[resultado.alertas.at(-1)] || '';

    $('barra-actual').replaceChildren(...segmentos(t, 0, resultado.margenActual));
    $('barra-simulada').replaceChildren(...segmentos(t, cuota, resultado.margenSimulado));

    $('d-ingreso').textContent = pesos.format(t.ingreso);
    $('d-gasto').textContent = pesos.format(t.gasto);
    $('d-obligacion').textContent = pesos.format(t.obligacion);
    $('d-ahorro').textContent = pesos.format(t.ahorro);
    $('d-proporcion').textContent =
      `${porcentaje(resultado.proporcionObligacionesActual)} \u2192 ${porcentaje(resultado.proporcionObligacionesSimulada)}`;

    $('alertas').replaceChildren(...resultado.alertas.map((codigo) => {
      const li = document.createElement('li');
      li.className = NIVEL_ALERTA[codigo];
      li.textContent = MENSAJES[codigo];
      return li;
    }));
  }

  function simular() {
    const error = $('error');
    error.hidden = true;
    const escenario = leerFormulario();
    try {
      mostrar(analizarEscenario(escenario), escenario.obligacionNueva.cuota);
    } catch (e) {
      if (!(e instanceof ErrorValidacion)) throw e;
      error.textContent = `Revisa los datos: ${e.message}.`;
      error.hidden = false;
    }
  }

  function cargarEjemplo(id) {
    const escenario = escenarios.find((e) => e.id === id);
    if (!escenario) return;
    $('movimientos').replaceChildren();
    escenario.movimientos.forEach(crearFila);
    $('ob-valor').value = escenario.obligacionNueva.valor;
    $('ob-cuota').value = escenario.obligacionNueva.cuota;
    $('ob-plazo').value = escenario.obligacionNueva.plazoMeses;
    simular();
  }

  async function cargarEscenarios() {
    try {
      const respuesta = await fetch('../datos/escenarios_semilla.json');
      ({ escenarios } = await respuesta.json());
      escenarios.forEach((e) => $('selector-ejemplo').add(new Option(`${e.id} - ${e.descripcion}`, e.id)));
      const inicial = new URLSearchParams(location.search).get('ejemplo');
      if (inicial) {
        $('selector-ejemplo').value = inicial;
        cargarEjemplo(inicial);
      }
    } catch {
      $('selector-ejemplo').closest('label').hidden = true;
    }
  }

  $('insignia').textContent = `Prueba de concepto · reglas v${VERSION_REGLAS} · datos sintéticos`;
  $('aviso').textContent = AVISO_EDUCATIVO;
  MOVIMIENTOS_INICIALES.forEach(crearFila);
  $('agregar').addEventListener('click', () => crearFila({ tipo: 'gasto', categoria: '', valor: '' }));
  $('simular').addEventListener('click', simular);
  $('selector-ejemplo').addEventListener('change', (e) => cargarEjemplo(e.target.value));
  cargarEscenarios();
})();
