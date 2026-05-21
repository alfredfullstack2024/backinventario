import express from "express";

import { registrarEntrada } from "../controllers/loteController.js";

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

export default router;
