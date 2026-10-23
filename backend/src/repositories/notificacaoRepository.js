
const pool = require("../database/database");

async function criarNotificacao({
  usuario_id,
  ocorrencia_id,
  mensagem,
}) {
  const resultado = await pool.query(
    `INSERT INTO notificacoes
      (usuario_id, ocorrencia_id, mensagem)
     VALUES ($1, $2, $3)
     RETURNING id, usuario_id, ocorrencia_id, mensagem, lida, criado_em`,
    [usuario_id, ocorrencia_id || null, mensagem]
  );

  return resultado.rows[0];
}

async function listarNotificacoesPorUsuario(usuarioId) {
  const resultado = await pool.query(
    `SELECT
       n.id,
       n.usuario_id,
       n.ocorrencia_id,
       n.mensagem,
       n.lida,
       n.criado_em,
       o.protocolo
     FROM notificacoes n
     LEFT JOIN ocorrencias o ON o.id = n.ocorrencia_id
     WHERE n.usuario_id = $1
     ORDER BY n.criado_em DESC`,
    [usuarioId]
  );

  return resultado.rows;
}

async function buscarNotificacaoPorId(id, usuarioId) {
  const resultado = await pool.query(
    `SELECT id, usuario_id, lida
     FROM notificacoes
     WHERE id = $1 AND usuario_id = $2`,
    [id, usuarioId]
  );

  return resultado.rows[0] || null;
}


async function marcarComoLida(id, usuarioId) {
  const resultado = await pool.query(
    `UPDATE notificacoes
     SET lida = TRUE
     WHERE id = $1 AND usuario_id = $2
     RETURNING id, usuario_id, lida`,
    [id, usuarioId]
  );

  return resultado.rows[0] || null;
}


module.exports = {
  criarNotificacao,
  listarNotificacoesPorUsuario,
  buscarNotificacaoPorId,
  marcarComoLida,
};
