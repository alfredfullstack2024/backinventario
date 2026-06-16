import express from "express";

import {
  registrarEntrada,
  obtenerLotesPorCodigo,
} from "../controllers/loteController.js";

import { protegerRuta } from "../middleware/authMiddleware.js";

import { autorizarRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================================
// REGISTRAR ENTRADA INVENTARIO
// ==========================================

router.post(
  "/entrada",
  protegerRuta,
  autorizarRoles("admin", "operador"),
  registrarEntrada,
);
router.get(
  "/codigo/:codigoId",
  protegerRuta,
  obtenerLotesPorCodigo,
);

export default router;
