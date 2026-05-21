import express from "express";

import {
  generarCodigos,
  generarCodigosPorRango,
  buscarCodigo,
  buscarCodigosAutocomplete,
  asignarProducto,
  listarCodigos,
  estadisticasCodigos,
} from "../controllers/codigoController.js";

const router = express.Router();

/* =========================
   GENERAR CÓDIGOS
========================= */

// POST /api/codigos/generar
router.post("/generar", generarCodigos);

// POST /api/codigos/generar-rango
router.post("/generar-rango", generarCodigosPorRango);

/* =========================
   ESTADÍSTICAS
========================= */

// GET /api/codigos/stats
router.get("/stats", estadisticasCodigos);

// ==========================================
// AUTOCOMPLETE
// ==========================================

router.get("/buscar/:texto", buscarCodigosAutocomplete);

// ==========================================
// BUSCAR CÓDIGO
// ==========================================

router.get("/:codigo", buscarCodigo);
/* =========================
   ASIGNAR PRODUCTO
========================= */

// PUT /api/codigos/:codigo/asignar
router.put("/:codigo/asignar", asignarProducto);

/* =========================
   LISTAR TODOS LOS CÓDIGOS
========================= */

// GET /api/codigos
router.get("/", listarCodigos);

export default router;
