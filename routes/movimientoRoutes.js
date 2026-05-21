import express from "express";

import {
  registrarMovimiento,
  obtenerMovimientos,
  obtenerMovimientosPorCodigo,
} from "../controllers/movimientoController.js";
import { protegerRuta } from "../middleware/authMiddleware.js";

const router = express.Router();

// Registrar movimiento
router.post("/", protegerRuta, registrarMovimiento);

// Historial global
router.get("/", protegerRuta, obtenerMovimientos);

// Historial por código
router.get("/:codigoId", protegerRuta, obtenerMovimientosPorCodigo);

export default router;
