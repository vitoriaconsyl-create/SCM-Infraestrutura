
const express = require("express");

const authController = require("./authController");

const router = express.Router();

router.post("/login", authController.login);

router.post(
    "/solicitar-recuperacao",
    authController.solicitarRecuperacao
);

router.get(
    "/verificar-token",
    authController.verificarTokenRecuperacao
);

router.post(
    "/redefinir-senha",
    authController.redefinirSenha
);

module.exports = router;
