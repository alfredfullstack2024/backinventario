import mongoose from "mongoose";

const codigoSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
  },
  estado: {
    type: String,
    enum: [
      "disponible",
      "asignado",
      "salida",
      "dañado",
      "perdido",
      "mantenimiento",
    ],
    default: "disponible",
  },
  producto: {
    nombre: {
      type: String,
      default: null,
    },

    referencia: {
      type: String,
      default: "",
    },

    presentacion: {
      type: String,
      default: "",
    },

    marcaFabricante: {
      type: String,
      default: "",
    },

    registroInvima: {
      type: String,
      default: "",
    },

    clasificacionRiesgo: {
      type: String,
      default: "",
    },

    descripcion: {
      type: String,
      default: null,
    },

    precio: {
      type: Number,
      default: null,
    },

    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      default: null,
    },

    ubicacion: {
      type: String,
      default: null,
    },

    stock: {
      type: Number,
      default: 0,
    },

    cantidadMinimaMensual: {
      type: Number,
      default: 0,
    },

    cantidadMaximaMensual: {
      type: Number,
      default: 0,
    },

    numeroLote: {
      type: String,
      default: "",
    },

    fechaVencimiento: {
      type: Date,
      default: null,
    },

    numeroRemisionFactura: {
      type: String,
      default: "",
    },
    diasAlertaAmarillo: {
  type: Number,
  default: 180,
},

diasAlertaRojo: {
  type: Number,
  default: 30,
},
  },
  fechaGeneracion: {
    type: Date,
    default: Date.now,
  },
  fechaAsignacion: {
    type: Date,
    default: null,
  },
  ultimaModificacion: {
    type: Date,
    default: Date.now,
  },

  activo: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Codigo", codigoSchema);
