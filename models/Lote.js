import mongoose from "mongoose";

const loteSchema = new mongoose.Schema(
  {
    codigo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Codigo",
      required: true,
    },

    cantidadInicial: {
      type: Number,
      required: true,
    },

    stockDisponible: {
      type: Number,
      required: true,
    },

    fechaEntrada: {
      type: Date,
      default: Date.now,
    },

    // =========================
    // NUEVOS CAMPOS
    // =========================

    numeroLote: {
      type: String,
      default: "",
      trim: true,
    },

    fechaVencimiento: {
      type: Date,
      required: false,
      default: null,
    },

    numeroRemisionFactura: {
      type: String,
      default: "",
      trim: true,
    },

    observacion: {
      type: String,
      default: "",
    },

    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Lote", loteSchema);
