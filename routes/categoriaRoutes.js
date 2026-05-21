import { Router } from "express";
import {
  crearCategoria,
  listarCategorias,
  eliminarCategoria,
} from "../controllers/categoriaController.js";

const router = Router();

router.post("/", crearCategoria);
router.get("/", listarCategorias);
router.delete("/:id", eliminarCategoria);

export default router;
