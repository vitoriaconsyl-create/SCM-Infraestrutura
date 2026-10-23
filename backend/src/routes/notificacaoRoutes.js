
const express = require("express");
const router = express.Router();

const notificacaoController = require("../controllers/notificacaoController");
const autenticar = require("../middlewares/authMiddleware");
const autorizarPerfil = require("../middlewares/autorizarPerfil");

router.post(
  "/",
  autenticar,
  autorizarPerfil("administrador"),
  notificacaoController.criarNotificacao
);

router.get(
  "/minhas",
  autenticar,
  notificacaoController.listarMinhasNotificacoes
);

router.patch(
  "/:id/lida",
  autenticar,
  notificacaoController.marcarNotificacaoComoLida
);

module.exports = router;
