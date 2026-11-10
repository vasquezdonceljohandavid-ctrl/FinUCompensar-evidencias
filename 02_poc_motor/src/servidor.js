'use strict';

// Servidor estático local para la interfaz web de la prueba de concepto. Solo escucha en 127.0.0.1.

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const PUERTO = Number(process.env.PUERTO) || 3000;
const CARPETAS_PUBLICAS = ['web', 'src', 'datos'];
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function noEncontrado(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('No encontrado');
}

const servidor = http.createServer((req, res) => {
  let ruta;
  try {
    ruta = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    return noEncontrado(res);
  }
  if (ruta === '/') {
    res.writeHead(302, { Location: '/web/' });
    return res.end();
  }

  const archivo = path.join(RAIZ, ruta.endsWith('/') ? `${ruta}index.html` : ruta);
  const relativo = path.relative(RAIZ, archivo);
  if (relativo.startsWith('..') || !CARPETAS_PUBLICAS.includes(relativo.split(path.sep)[0])) {
    return noEncontrado(res);
  }
  const tipo = TIPOS[path.extname(archivo)];
  if (!tipo) return noEncontrado(res);

  fs.readFile(archivo, (err, datos) => {
    if (err) return noEncontrado(res);
    res.writeHead(200, { 'Content-Type': tipo, 'Cache-Control': 'no-store' });
    res.end(datos);
  });
});

servidor.listen(PUERTO, '127.0.0.1', () => {
  console.log(`FinUCompensar (prueba de concepto) en http://localhost:${PUERTO}`);
  console.log('Ctrl + C para detener.');
});
