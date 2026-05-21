import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";

// ==========================================
// LISTAR USUARIOS
// ==========================================
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .select("-password")
      .sort({ nombre: 1 });

    res.json(usuarios);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error obteniendo usuarios",
    });
  }
};

// ==========================================
// CREAR USUARIO
// ==========================================
export const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    const existeUsuario = await Usuario.findOne({
      email,
    });

    if (existeUsuario) {
      return res.status(400).json({
        error: "El email ya existe",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
      rol,
    });

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error creando usuario",
    });
  }
};

// ==========================================
// ACTIVAR / DESACTIVAR USUARIO
// ==========================================
export const cambiarEstadoUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    usuario.activo = !usuario.activo;

    await usuario.save();

    res.json({
      mensaje: "Estado actualizado correctamente",
      usuario,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error actualizando usuario",
    });
  }
};
