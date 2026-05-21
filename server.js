import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Producto from "./models/Producto.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import barcodeRoutes from "./routes/barcodeRoutes.js";
import codigoRoutes from "./routes/codigoRoutes.js";
import movimientoRoutes from "./routes/movimientoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import loteRoutes from "./routes/loteRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas organizadas
app.use("/api/categorias", categoriaRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/barcode", barcodeRoutes);
app.use("/api/codigos", codigoRoutes);
app.use("/api/movimientos", movimientoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/lotes", loteRoutes);
// Ruta adicional para el reporte (compatible con tu frontend actual)
app.get("/api/reporte", async (req, res) => {
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
      {
        $project: {
          _id: 1,
          total: 1,
          nombre: "$categoria.nombre",
        },
      },
    ]);
    res.json(resumen);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar reporte" });
  }
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => {
    console.error("❌ Error de conexión a Mongo:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend en http://localhost:${PORT}`));
