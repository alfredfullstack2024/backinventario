import express from "express";

import {
  registrarUsuario,
  loginUsuario,
} from "../controllers/authController.js";

const router = express.Router();

// Registro
router.post("/register", registrarUsuario);

// Login
router.post("/login", loginUsuario);

export default router;
