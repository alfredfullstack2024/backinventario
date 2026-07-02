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

    precioUnitario: {
  type: Number,
  default: 0,
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
      default: null,
    },

    numeroRemisionFactura: {
      type: String,
      default: "",
      trim: true,
    },

    refCaja: {
  type: String,
  default: "",
  trim: true,
},

refTarro: {
  type: String,
  default: "",
  trim: true,
},

    proveedor: {
  type: String,
  default: "",
  trim: true,
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
