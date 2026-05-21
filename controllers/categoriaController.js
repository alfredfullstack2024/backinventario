import Categoria from "../models/Categoria.js";

// Crear categoría
export const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre)
      return res.status(400).json({ error: "El nombre es obligatorio" });

    const nueva = await Categoria.create({ nombre });
    res.status(201).json(nueva);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la categoría" });
  }
};

// Listar categorías
export const listarCategorias = async (req, res) => {
  try {
    const lista = await Categoria.find().sort({ nombre: 1 });
    res.json(lista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};

// Eliminar categoría
export const eliminarCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    await Categoria.findByIdAndDelete(id);
    res.json({ mensaje: "Categoría eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar la categoría" });
  }
};
