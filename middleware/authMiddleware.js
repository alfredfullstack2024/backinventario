import jwt from "jsonwebtoken";

import Usuario from "../models/Usuario.js";

export const protegerRuta = async (req, res, next) => {
  try {
    let token;

    // Verificar header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Validar token
    if (!token) {
      return res.status(401).json({
        error: "No autorizado",
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario
    const usuario = await Usuario.findById(decoded.id).select("-password");

    if (!usuario) {
      return res.status(401).json({
        error: "Usuario no encontrado",
      });
    }

    // Guardar usuario en request
    req.usuario = usuario;

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      error: "Token inválido",
    });
  }
};
