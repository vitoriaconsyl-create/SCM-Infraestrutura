
const notificacaoRepository = require("../repositories/notificacaoRepository");

async function criarNotificacao(req, res) {
  try {
    const { ocorrencia_id, mensagem } = req.body;

    if (!ocorrencia_id || !mensagem || !mensagem.trim()) {
      return res.status(400).json({
        erro: "A ocorrência e a mensagem são obrigatórias.",
      });
    }

    const ocorrenciaId = Number(ocorrencia_id);

    if (!Number.isInteger(ocorrenciaId) || ocorrenciaId <= 0) {
      return res.status(400).json({
        erro: "Identificador da ocorrência inválido.",
      });
    }

    const resultadoOcorrencia = await require("../database/database").query(
      `SELECT id, usuario_id
       FROM ocorrencias
       WHERE id = $1`,
      [ocorrenciaId]
    );

    const ocorrencia = resultadoOcorrencia.rows[0];

    if (!ocorrencia) {
      return res.status(404).json({
        erro: "Ocorrência não encontrada.",
      });
    }

    if (!ocorrencia.usuario_id) {
      return res.status(400).json({
        erro: "Esta ocorrência não possui um cidadão vinculado.",
      });
    }

    const notificacao = await notificacaoRepository.criarNotificacao({
      usuario_id: ocorrencia.usuario_id,
      ocorrencia_id: ocorrencia.id,
      mensagem: mensagem.trim(),
    });

    return res.status(201).json({
      mensagem: "Notificação enviada com sucesso.",
      notificacao,
    });
  } catch (erro) {
    console.error("Erro ao criar notificação:", erro);

    return res.status(500).json({
      erro: "Não foi possível enviar a notificação.",
    });
  }
}

async function listarMinhasNotificacoes(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const notificacoes =
      await notificacaoRepository.listarNotificacoesPorUsuario(usuarioId);

    return res.status(200).json(notificacoes);
  } catch (erro) {
    console.error("Erro ao listar notificações:", erro);

    return res.status(500).json({
      erro: "Não foi possível carregar as notificações.",
    });
  }
}

async function marcarNotificacaoComoLida(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const notificacaoId = Number(req.params.id);

    if (!Number.isInteger(notificacaoId) || notificacaoId <= 0) {
      return res.status(400).json({
        erro: "Identificador da notificação inválido.",
      });
    }

    const notificacao =
      await notificacaoRepository.marcarComoLida(
        notificacaoId,
        usuarioId
      );

    if (!notificacao) {
      return res.status(404).json({
        erro: "Notificação não encontrada.",
      });
    }

    return res.status(200).json({
      mensagem: "Notificação marcada como lida.",
      notificacao,
    });
  } catch (erro) {
    console.error("Erro ao marcar notificação como lida:", erro);

    return res.status(500).json({
      erro: "Não foi possível atualizar a notificação.",
    });
  }
}

module.exports = {
  criarNotificacao,
  listarMinhasNotificacoes,
  marcarNotificacaoComoLida,
};
