import express from "express";

import {
  listarUsuarios,
  crearUsuario,
  cambiarEstadoUsuario,
} from "../controllers/usuarioController.js";

import { protegerRuta } from "../middleware/authMiddleware.js";

import { autorizarRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ==========================================
// LISTAR USUARIOS
// ==========================================
router.get("/", protegerRuta, autorizarRoles("admin"), listarUsuarios);

// ==========================================
// CREAR USUARIO
// ==========================================
router.post("/", protegerRuta, autorizarRoles("admin"), crearUsuario);

// ==========================================
// ACTIVAR / DESACTIVAR USUARIO
// ==========================================
router.put(
  "/:id/estado",
  protegerRuta,
  autorizarRoles("admin"),
  cambiarEstadoUsuario,
);

export default router;
