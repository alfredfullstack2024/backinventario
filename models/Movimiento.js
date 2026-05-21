import mongoose from "mongoose";

const movimientoSchema = new mongoose.Schema(
  {
    codigo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Codigo",
      required: true,
    },

    tipo: {
      type: String,
      enum: [
        "entrada",
        "salida",
        "ajuste",
        "asignacion",
        "perdida",
        "dañado",
        "mantenimiento",
      ],
      required: true,
    },

    cantidad: {
      type: Number,
      required: true,
      min: 1,
    },

    stockAnterior: {
      type: Number,
      required: true,
    },

    stockNuevo: {
      type: Number,
      required: true,
    },

    motivo: {
      type: String,
      trim: true,
      default: "",
    },

    observacion: {
      type: String,
      trim: true,
      default: "",
    },

    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Movimiento", movimientoSchema);
