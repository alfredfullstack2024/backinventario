import Codigo from "../models/Codigo.js";
import Lote from "../models/Lote.js";
import { v4 as uuidv4 } from "uuid";

// Generar códigos por rango específico
export const generarCodigosPorRango = async (req, res) => {
  try {
    const { rangoInicio, rangoFin } = req.body;

    if (!rangoInicio || !rangoFin) {
      return res.status(400).json({
        error: "Debe especificar rango de inicio y fin",
      });
    }

    const inicio = parseInt(rangoInicio);
    const fin = parseInt(rangoFin);

    if (inicio > fin) {
      return res.status(400).json({
        error: "El número inicial debe ser menor que el final",
      });
    }

    if (fin - inicio + 1 > 1000) {
      return res.status(400).json({
        error: "El rango no puede exceder 1000 códigos",
      });
    }

    // Verificar si algún código ya existe
    const timestamp = Date.now();
    const codigosExistentes = [];
    const codigos = [];

    for (let i = inicio; i <= fin; i++) {
      const numeroSecuencial = i.toString().padStart(4, "0");
      const codigoUnico = `INV-${timestamp}-${numeroSecuencial}`;

      const existe = await Codigo.findOne({ codigo: codigoUnico });
      if (existe) {
        codigosExistentes.push(numeroSecuencial);
      } else {
        codigos.push({
          codigo: codigoUnico,
          estado: "disponible",
        });
      }
    }

    if (codigosExistentes.length > 0) {
      return res.status(400).json({
        error: `Los siguientes números ya existen: ${codigosExistentes.join(
          ", ",
        )}`,
      });
    }

    const codigosCreados = await Codigo.insertMany(codigos);

    res.status(201).json({
      mensaje: `${codigos.length} códigos generados exitosamente (del ${inicio} al ${fin})`,
      codigos: codigosCreados,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar códigos por rango" });
  }
};

// Generar códigos vacíos en lotes
export const generarCodigos = async (req, res) => {
  try {
    const { cantidad } = req.body;

    if (!cantidad || cantidad <= 0 || cantidad > 1000) {
      return res.status(400).json({
        error: "La cantidad debe ser entre 1 y 1000",
      });
    }

    const codigos = [];

    // Obtener el último número de secuencia usado
    const ultimoCodigo = await Codigo.findOne()
      .sort({ fechaGeneracion: -1 })
      .select("codigo");

    let numeroInicio = 1;
    if (ultimoCodigo && ultimoCodigo.codigo) {
      // Extraer el número del último código (formato: INV-timestamp-0001)
      const match = ultimoCodigo.codigo.match(/-(\d+)$/);
      if (match) {
        numeroInicio = parseInt(match[1]) + 1;
      }
    }

    const timestamp = Date.now();

    for (let i = 0; i < cantidad; i++) {
      const numeroSecuencial = (numeroInicio + i).toString().padStart(4, "0");
      const codigoUnico = `INV-${timestamp}-${numeroSecuencial}`;

      codigos.push({
        codigo: codigoUnico,
        estado: "disponible",
      });
    }

    const codigosCreados = await Codigo.insertMany(codigos);

    res.status(201).json({
      mensaje: `${cantidad} códigos generados exitosamente`,
      codigos: codigosCreados,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar códigos" });
  }
};

// Buscar código por número
export const buscarCodigo = async (req, res) => {
  try {
    const { codigo } = req.params;
    const codigoEncontrado = await Codigo.findOne({ codigo }).populate(
      "producto.categoria",
    );

    if (!codigoEncontrado) {
      return res.status(404).json({ error: "Código no encontrado" });
    }

    res.json(codigoEncontrado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al buscar código" });
  }
};
// ==========================================
// AUTOCOMPLETE CÓDIGOS DISPONIBLES
// ==========================================
export const buscarCodigosAutocomplete = async (req, res) => {
  try {
    const { texto } = req.params;

    const codigos = await Codigo.find({
      estado: "disponible",

      codigo: {
        $regex: texto,
        $options: "i",
      },
    })
      .select("codigo estado")
      .sort({ fechaGeneracion: -1 })
      .limit(15);

    res.json(codigos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error buscando códigos",
    });
  }
};
// Asignar producto a código escaneado
export const asignarProducto = async (req, res) => {
  try {
    const { codigo } = req.params;
    const {
      nombre,
      referencia,
      presentacion,
      marcaFabricante,
      registroInvima,
      clasificacionRiesgo,

      descripcion,
      precio,
      categoria,
      ubicacion,
      stock,

      cantidadMinimaMensual,
      cantidadMaximaMensual,

      numeroLote,
      fechaVencimiento,
      numeroRemisionFactura,
    } = req.body;

    if (!nombre) {
      return res
        .status(400)
        .json({ error: "El nombre del producto es obligatorio" });
    }

    const codigoExistente = await Codigo.findOne({ codigo });

    if (!codigoExistente) {
      return res.status(404).json({ error: "Código no encontrado" });
    }

    if (codigoExistente.estado === "asignado") {
      return res
        .status(400)
        .json({ error: "Este código ya tiene un producto asignado" });
    }

    // Actualizar código con información del producto
    codigoExistente.estado = "asignado";
    codigoExistente.producto = {
      nombre,

      referencia,

      presentacion,

      marcaFabricante,

      registroInvima,

      clasificacionRiesgo,

      descripcion,

      precio,

      categoria,

      ubicacion,

      stock: stock || 1,

      cantidadMinimaMensual,

      cantidadMaximaMensual,

      numeroLote,

      fechaVencimiento,

      numeroRemisionFactura,
    };
    codigoExistente.fechaAsignacion = new Date();
    console.log("=================================");
    console.log("PRODUCTO ANTES DE GUARDAR:");
    console.log(JSON.stringify(codigoExistente.producto, null, 2));
    console.log("=================================");
    await codigoExistente.save();
    await codigoExistente.populate("producto.categoria");

    res.json({
      mensaje: "Producto asignado exitosamente",
      codigo: codigoExistente,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al asignar producto" });
  }
};

// Listar todos los códigos con filtros
export const listarCodigos = async (req, res) => {
  try {
    const { estado, limit = 50 } = req.query;

    let filtro = {};

    if (
      estado &&
      [
        "disponible",
        "asignado",
        "salida",
        "dañado",
        "perdido",
        "mantenimiento",
      ].includes(estado)
    ) {
      filtro.estado = estado;
    }

    const codigos = await Codigo.find(filtro)

      .populate("producto.categoria")

      .sort({ fechaGeneracion: -1 })

      .limit(parseInt(limit))

      .lean();

    // ============================
    // AGREGAR LOTES
    // ============================

    for (const codigo of codigos) {
      const lotes = await Lote.find({
        codigo: codigo._id,
        activo: true,
      })

        .sort({
          fechaVencimiento: 1,
        })

        .lean();

      codigo.lotes = lotes;
    }

    res.json(codigos);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Error al listar códigos",
    });
  }
};

// Estadísticas de códigos
export const estadisticasCodigos = async (req, res) => {
  try {
    const stats = await Codigo.aggregate([
      {
        $group: {
          _id: "$estado",
          total: { $sum: 1 },
        },
      },
    ]);

    const resultado = {
      disponibles: 0,
      asignados: 0,
      total: 0,
    };

    stats.forEach((stat) => {
      resultado[stat._id === "disponible" ? "disponibles" : "asignados"] =
        stat.total;
      resultado.total += stat.total;
    });

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar estadísticas" });
  }
};
