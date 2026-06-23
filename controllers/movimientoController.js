import Movimiento from "../models/Movimiento.js";
import Codigo from "../models/Codigo.js";
import Lote from "../models/Lote.js";

// ==========================================
// REGISTRAR MOVIMIENTO
// ==========================================
export const registrarMovimiento = async (req, res) => {
  try {
    const {
  codigoId,
  loteId,
  tipo,
  cantidad,
  motivo,
  observacion
} = req.body;

    // Validaciones básicas
    if (!codigoId || !tipo || !cantidad) {
      return res.status(400).json({
        error: "codigoId, tipo y cantidad son obligatorios",
      });
    }

    // Buscar código
    const codigo = await Codigo.findById(codigoId);

    if (!codigo) {
      return res.status(404).json({
        error: "Código no encontrado",
      });
    }

    // Validar producto asignado
    if (!codigo.producto?.nombre) {
      return res.status(400).json({
        error: "El código no tiene producto asignado",
      });
    }

    const stockActual = codigo.producto.stock || 0;

    let nuevoStock = stockActual;

    // ==========================================
    // TIPOS DE MOVIMIENTO
    // ==========================================

    switch (tipo) {
      case "entrada":
        nuevoStock += cantidad;
        break;

    case "salida":

  if (!loteId) {
    return res.status(400).json({
      error: "Debe seleccionar un lote",
    });
  }

  const lote = await Lote.findById(loteId);

  if (!lote) {
    return res.status(404).json({
      error: "Lote no encontrado",
    });
  }

  if (cantidad > lote.stockDisponible) {
    return res.status(400).json({
      error: "Stock insuficiente en el lote seleccionado",
    });
  }

  lote.stockDisponible =
    lote.stockDisponible - Number(cantidad);

  await lote.save();

  nuevoStock -= Number(cantidad);

  break;
      case "perdida":
      case "dañado":
        if (cantidad > stockActual) {
          return res.status(400).json({
            error: "Stock insuficiente",
          });
        }

        nuevoStock -= cantidad;
        break;

      case "ajuste":
        nuevoStock = cantidad;
        break;

      case "mantenimiento":
        nuevoStock = stockActual;
        break;

      default:
        return res.status(400).json({
          error: "Tipo de movimiento inválido",
        });
    }

    // ==========================================
    // ACTUALIZAR STOCK
    // ==========================================

    codigo.producto.stock = nuevoStock;
    codigo.ultimaModificacion = new Date();

    // Cambiar estado automático
    if (nuevoStock <= 0) {
      codigo.estado = "salida";
    } else {
      codigo.estado = "asignado";
    }

    await codigo.save();

    // ==========================================
    // REGISTRAR MOVIMIENTO
    // ==========================================

    const movimiento = await Movimiento.create({
  codigo: codigo._id,

  tipo,

  cantidad,

  stockAnterior: stockActual,

  stockNuevo: nuevoStock,

  motivo,

  observacion,

  usuario: req.usuario._id,

  numeroLote: lote?.numeroLote || "",

  numeroRemisionFactura:
    lote?.numeroRemisionFactura || "",

  fechaVencimiento:
    lote?.fechaVencimiento || null,
});

    const movimientoCompleto = await Movimiento.findById(
      movimiento._id,
    ).populate("codigo");

    res.status(201).json({
      mensaje: "Movimiento registrado correctamente",
      movimiento: movimientoCompleto,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error registrando movimiento",
    });
  }
};

// ==========================================
// HISTORIAL GLOBAL
// ==========================================
export const obtenerMovimientos = async (req, res) => {
  try {
    const movimientos = await Movimiento.find()
      .populate("codigo")
      .populate("usuario", "nombre email")
      .sort({ createdAt: -1 });

    res.json(movimientos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error obteniendo movimientos",
    });
  }
};

// ==========================================
// HISTORIAL POR CÓDIGO
// ==========================================
export const obtenerMovimientosPorCodigo = async (req, res) => {
  try {
    const { codigoId } = req.params;

    const movimientos = await Movimiento.find({
      codigo: codigoId,
    })
      .populate("codigo")
      .populate("usuario", "nombre email")
      .sort({ createdAt: -1 });

    res.json(movimientos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error obteniendo historial",
    });
  }
};
