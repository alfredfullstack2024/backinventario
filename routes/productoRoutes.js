import express from "express";
import Producto from "../models/Producto.js";
import bwipjs from "bwip-js";

const router = express.Router();

// Crear varios productos en una categoría
router.post("/", async (req, res) => {
  try {
    const { nombre, categoria, cantidad } = req.body;
    if (!nombre || !categoria || !cantidad) {
      return res.status(400).json({ error: "Faltan datos en la petición" });
    }

    const productos = [];
    for (let i = 1; i <= cantidad; i++) {
      productos.push({
        nombre: `${nombre} ${i}`,
        categoria,
        codigo: `${nombre.toUpperCase().replace(/\s/g, "")}-${i
          .toString()
          .padStart(3, "0")}`,
      });
    }

    const creados = await Producto.insertMany(productos);
    res.status(201).json(creados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear productos" });
  }
});

// Listado completo de productos con populate de categoría
router.get("/lista", async (req, res) => {
  try {
    const productos = await Producto.find().populate("categoria", "nombre");
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Reporte: cuántos productos por categoría
router.get("/", async (req, res) => {
  try {
    const resumen = await Producto.aggregate([
      { $group: { _id: "$categoria", total: { $sum: 1 } } },
      {
        $lookup: {
          from: "categorias",
          localField: "_id",
          foreignField: "_id",
          as: "categoria",
        },
      },
      { $unwind: "$categoria" },
      { $project: { _id: 1, total: 1, nombre: "$categoria.nombre" } },
    ]);
    res.json(resumen);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar reporte" });
  }
});

// Consultar un producto por su código
router.get("/:codigo", async (req, res) => {
  try {
    const prod = await Producto.findOne({ codigo: req.params.codigo }).populate(
      "categoria",
      "nombre"
    );
    if (!prod) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la búsqueda" });
  }
});

// Generar código de barras como PNG
router.get("/:codigo/barcode", async (req, res) => {
  try {
    const png = await bwipjs.toBuffer({
      bcid: "code128",
      text: req.params.codigo,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    });
    res.type("png");
    res.send(png);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar código de barras" });
  }
});

export default router;
