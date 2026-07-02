import Lote from "../models/Lote.js";
import Codigo from "../models/Codigo.js";
import Movimiento from "../models/Movimiento.js";

// ==========================================
// OBTENER LOTES POR CÓDIGO
// ==========================================
export const obtenerLotesPorCodigo = async (req, res) => {
  try {
    const { codigoId } = req.params;

    const lotes = await Lote.find({
      codigo: codigoId,
      activo: true,
    })
      .populate("usuario", "nombre")
      .sort({ fechaEntrada: -1 });

    res.json(lotes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error obteniendo lotes",
    });
  }
};

// ==========================================
// REGISTRAR NUEVA ENTRADA
// ==========================================
export const registrarEntrada = async (req, res) => {
  try {
    const {
  codigoId,
  cantidad,
  precioUnitario,
  observacion,
  numeroLote,
  fechaVencimiento,
  numeroRemisionFactura,
  refCaja,
  refTarro,
      proveedor,
} = req.body;

    // =========================
    // VALIDACIONES
    // =========================

    if (!codigoId || !cantidad) {
      return res.status(400).json({
        error: "Datos incompletos",
      });
    }

    if (Number(cantidad) <= 0) {
      return res.status(400).json({
        error: "Cantidad inválida",
      });
    }

    // =========================
    // BUSCAR CÓDIGO
    // =========================

    const codigo = await Codigo.findById(codigoId).populate(
      "producto.categoria",
    );

    if (!codigo) {
      return res.status(404).json({
        error: "Código no encontrado",
      });
    }

    // =========================
    // VALIDAR PRODUCTO
    // =========================

    if (!codigo.producto?.nombre) {
      return res.status(400).json({
        error: "El código no tiene producto asignado",
      });
    }

    // =========================
    // FECHAS
    // =========================

    const fechaEntrada = new Date();

    // =========================
    // CREAR LOTE
    // =========================

   const lote = await Lote.create({
  codigo: codigo._id,

  cantidadInicial: Number(cantidad),

  stockDisponible: Number(cantidad),

  precioUnitario: Number(precioUnitario) || 0,

  fechaEntrada,

  numeroLote,

  fechaVencimiento: fechaVencimiento || null,

  numeroRemisionFactura,

  refCaja,

  refTarro,
     
  proveedor,

  observacion,

  usuario: req.usuario._id,
});

    // =========================
    // ACTUALIZAR STOCK
    // =========================

    const stockAnterior = codigo.producto.stock || 0;

    const stockNuevo = stockAnterior + Number(cantidad);

    codigo.producto.stock = stockNuevo;

    // Si estaba sin stock
    if (codigo.estado === "salida") {
      codigo.estado = "asignado";
    }

    await codigo.save();

    // =========================
// CREAR MOVIMIENTO
// =========================

await Movimiento.create({
  codigo: codigo._id,

  usuario: req.usuario._id,

  tipo: "entrada",

  cantidad: Number(cantidad),

  precioUnitario: lote.precioUnitario,

  stockAnterior,

  stockNuevo,

  motivo: "Ingreso inventario",

  observacion,

  numeroLote: lote.numeroLote,

  fechaVencimiento: lote.fechaVencimiento,

  numeroRemisionFactura: lote.numeroRemisionFactura,

  refCaja: lote.refCaja,

  refTarro: lote.refTarro,

  proveedor: lote.proveedor,
});

    // =========================
    // RESPUESTA
    // =========================

    res.status(201).json({
      mensaje: "Entrada registrada correctamente",

      lote,

      stockNuevo,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error registrando entrada",
    });
  }
};
