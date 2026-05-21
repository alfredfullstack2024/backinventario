import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Usuario from "../models/Usuario.js";

// ==========================================
// REGISTRO
// ==========================================
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    // Verificar usuario existente
    const existeUsuario = await Usuario.findOne({ email });

    if (existeUsuario) {
      return res.status(400).json({
        error: "El usuario ya existe",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario
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
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error registrando usuario",
    });
  }
};

// ==========================================
// LOGIN
// ==========================================
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    // Verificar password
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    // Generar token
    const token = jwt.sign(
      {
        id: usuario._id,
        email: usuario.email,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      },
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error iniciando sesión",
    });
  }
};
