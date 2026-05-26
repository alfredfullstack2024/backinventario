import express from "express";
import bwipjs from "bwip-js";

const router = express.Router();

// Genera un PNG de código de barras a partir del código del producto
router.get("/:codigo", async (req, res) => {
  try {
    const png = await bwipjs.toBuffer({
      bcid: "code128", // tipo de código
      text: req.params.codigo, // el código del producto
      scale: 8,
height: 30,
includetext: false,
paddingwidth: 20,
paddingheight: 10,
    });
    res.type("image/png");
    res.send(png);
  } catch (err) {
    console.error("Error generando código de barras:", err);
    res.status(500).send("Error generando código de barras");
  }
});

export default router;
