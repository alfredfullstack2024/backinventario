import Producto from "../models/Producto.js";
import { v4 as uuidv4 } from "uuid";

// Crear productos en cantidad, cada uno con código de barras único
export const crearProducto = async (req, res) => {
  try {
    const { nombre, categoria, cantidad } = req.body;

    if (!nombre || !categoria || !cantidad) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const productosCreados = [];
    for (let i = 0; i < cantidad; i++) {
      const codigo = uuidv4();
      const producto = new Producto({
        nombre,
        categoria,
        stock: 1,
        codigoBarra: codigo,
      });
      await producto.save();
      productosCreados.push(producto);
    }

    res.status(201).json({
      message: "Productos creados correctamente",
      productos: productosCreados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear producto" });
  }
};

// Buscar un producto por su código de barras
export const buscarPorCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const producto = await Producto.findOne({ codigoBarra: codigo }).populate(
      "categoria"
    );
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en la búsqueda" });
  }
};

// Reporte de inventario agrupado por categoría
export const reporteInventario = async (req, res) => {
  try {
    const data = await Producto.aggregate([
      { $group: { _id: "$categoria", total: { $sum: "$stock" } } },
    ]);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en reporte" });
  }
};
