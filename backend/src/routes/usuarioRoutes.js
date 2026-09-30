const express = require("express");

const usuarioController = require("../controllers/usuarioController");

const router = express.Router();

const autenticar = require("../middlewares/authMiddleware");

const autorizar = require("../middlewares/autorizar");

router.get("/", autenticar, autorizar("administrador"), usuarioController.listarUsuarios);

router.get("/:id/ocorrencias", autenticar, autorizar("administrador"),usuarioController.listarOcorrenciasDoUsuario);

router.get("/:id",  autenticar, autorizar("administrador"), usuarioController.buscarUsuarioPorId);

router.post("/", usuarioController.criarUsuario);

module.exports = router;