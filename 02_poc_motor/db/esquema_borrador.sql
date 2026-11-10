-- FinUCompensar - Modelo de datos (BORRADOR v0.1, 10/11/2026)
-- Estado: propuesto, NO ejecutado aún en un servidor PostgreSQL. Pendiente: actividad 4.1.1.
-- Requisitos relacionados: RF-01, RF-02, RF-03, RF-05, RF-08, RD-01, RS-01, RNF-03.

CREATE TABLE usuario (
    id               BIGSERIAL PRIMARY KEY,
    correo           VARCHAR(254) NOT NULL UNIQUE,
    hash_contrasena  VARCHAR(255) NOT NULL,          -- RS-01: nunca texto plano
    creado_en        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE periodo (
    id          BIGSERIAL PRIMARY KEY,
    usuario_id  BIGINT   NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,  -- RF-09: eliminación de datos
    anio        SMALLINT NOT NULL CHECK (anio BETWEEN 2020 AND 2100),
    mes         SMALLINT NOT NULL CHECK (mes BETWEEN 1 AND 12),
    UNIQUE (usuario_id, anio, mes)                                          -- RD-01: historial por usuario y mes
);

CREATE TABLE categoria (
    id          BIGSERIAL PRIMARY KEY,
    usuario_id  BIGINT REFERENCES usuario(id) ON DELETE CASCADE,            -- NULL = categoría predeterminada
    nombre      VARCHAR(60) NOT NULL,
    tipo        VARCHAR(10) NOT NULL CHECK (tipo IN ('ingreso', 'gasto', 'ahorro', 'obligacion'))
);

CREATE TABLE movimiento (
    id            BIGSERIAL PRIMARY KEY,
    periodo_id    BIGINT  NOT NULL REFERENCES periodo(id) ON DELETE CASCADE,
    categoria_id  BIGINT  NOT NULL REFERENCES categoria(id),
    tipo          VARCHAR(10) NOT NULL CHECK (tipo IN ('ingreso', 'gasto', 'ahorro', 'obligacion')),
    valor         BIGINT  NOT NULL CHECK (valor >= 0),                       -- pesos COP enteros (regla v1.0.0)
    descripcion   VARCHAR(120)                                               -- RNF-03: sin datos bancarios
);

CREATE TABLE simulacion (
    id               BIGSERIAL PRIMARY KEY,
    periodo_id       BIGINT  NOT NULL REFERENCES periodo(id) ON DELETE CASCADE,
    valor            BIGINT  NOT NULL CHECK (valor > 0),
    cuota            BIGINT  NOT NULL CHECK (cuota > 0),
    plazo_meses      INTEGER NOT NULL CHECK (plazo_meses > 0),
    version_reglas   VARCHAR(10) NOT NULL,                                   -- RNF-05: trazabilidad de reglas
    margen_actual    BIGINT  NOT NULL,
    margen_simulado  BIGINT  NOT NULL,
    creado_en        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_movimiento_periodo ON movimiento (periodo_id);
CREATE INDEX idx_periodo_usuario ON periodo (usuario_id);
