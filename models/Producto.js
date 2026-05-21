import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  codigo: { type: String, required: true, unique: true },
});

const Producto = mongoose.model("Producto", productoSchema);
export default Producto;
