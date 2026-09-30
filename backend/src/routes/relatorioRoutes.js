const express = require("express");

const router = express.Router();

const relatorioController =
    require("../controllers/relatorioController");

const autenticar =
    require("../middlewares/authMiddleware");

const autorizar =
    require("../middlewares/autorizar");

router.get(
    "/resumo",
    autenticar,
    autorizar("administrador"),
    relatorioController.buscarResumo
);

router.get(
    "/categorias",
    autenticar,
    autorizar("administrador"),
    relatorioController.buscarPorCategoria
);

router.get(
    "/status",
    autenticar,
    autorizar("administrador"),
    relatorioController.buscarPorStatus
);

router.get(
    "/bairros",
    autenticar,
    autorizar("administrador"),
    relatorioController.buscarPorBairro
);

router.get(
    "/indicadores",
    autenticar,
    autorizar("administrador"),
    relatorioController.buscarIndicadores
);

router.get(
    "/",
    autenticar,
    autorizar("administrador"),
    relatorioController.buscarRelatorioCompleto
);

module.exports = router;