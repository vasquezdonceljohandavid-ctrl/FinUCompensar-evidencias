'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { analizarEscenario } = require('./motor');
const { formatearInforme } = require('./informe');

const archivo = process.argv[2] || path.join(__dirname, '..', 'datos', 'escenarios_semilla.json');
const id = process.argv[3] || 'S01';

const { escenarios } = JSON.parse(fs.readFileSync(archivo, 'utf8'));
const escenario = escenarios.find((e) => e.id === id);
if (!escenario) {
  console.error(`No existe el escenario ${id}. Disponibles: ${escenarios.map((e) => e.id).join(', ')}`);
  process.exit(1);
}

console.log(`Escenario ${escenario.id}: ${escenario.descripcion} (datos sintéticos)\n`);
console.log(formatearInforme(analizarEscenario(escenario)));
