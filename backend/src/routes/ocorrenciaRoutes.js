const express = require("express");

const router = express.Router();

const ocorrenciaController = require("../controllers/ocorrenciaController");

const autenticar = require("../middlewares/authMiddleware");
const autorizar = require("../middlewares/autorizar");

router.get("/", autenticar, ocorrenciaController.listarOcorrencias);
router.get("/:id", autenticar, ocorrenciaController.buscarOcorrenciaPorId);
router.post("/", autenticar, ocorrenciaController.criarOcorrencia);
router.put("/:id", autenticar, autorizar("administrador"), ocorrenciaController.atualizarOcorrencia);
router.delete("/:id", autenticar, autorizar("administrador"), ocorrenciaController.excluirOcorrencia);

module.exports = router;