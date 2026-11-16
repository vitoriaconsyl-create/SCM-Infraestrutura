
const pool = require("../database/database");

const buscarUsuarioPorEmail = async (email) => {
    const resultado = await pool.query(
        `
        SELECT id, nome, email, senha, tipo
        FROM usuarios
        WHERE email = $1
        `,
        [email]
    );

    return resultado.rows[0];
};

const invalidarTokensAnteriores = async (usuarioId) => {
    await pool.query(
        `
        UPDATE recuperacao_senha
        SET utilizado = TRUE
        WHERE usuario_id = $1 AND utilizado = FALSE
        `,
        [usuarioId]
    );
};

const criarTokenRecuperacao = async (usuarioId, tokenHash, expiraEm) => {
    await pool.query(
        `
        INSERT INTO recuperacao_senha
        (usuario_id, token_hash, expira_em)
        VALUES ($1, $2, $3)
        `,
        [usuarioId, tokenHash, expiraEm]
    );
};

const buscarTokenValido = async (tokenHash) => {
    const resultado = await pool.query(
        `
        SELECT id, usuario_id
        FROM recuperacao_senha
        WHERE token_hash = $1
          AND utilizado = FALSE
          AND expira_em > CURRENT_TIMESTAMP
        `,
        [tokenHash]
    );

    return resultado.rows[0];
};

const atualizarSenhaEConsumirToken = async (tokenId, usuarioId, novaSenha) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const token = await client.query(
            `
            SELECT id
            FROM recuperacao_senha
            WHERE id = $1
              AND usuario_id = $2
              AND utilizado = FALSE
              AND expira_em > CURRENT_TIMESTAMP
            FOR UPDATE
            `,
            [tokenId, usuarioId]
        );

        if (token.rowCount === 0) {
            await client.query("ROLLBACK");
            return false;
        }

        await client.query(
            `UPDATE usuarios SET senha = $1 WHERE id = $2`,
            [novaSenha, usuarioId]
        );

        await client.query(
            `UPDATE recuperacao_senha SET utilizado = TRUE WHERE id = $1`,
            [tokenId]
        );

        await client.query("COMMIT");
        return true;

    } catch (erro) {
        await client.query("ROLLBACK");
        throw erro;
    } finally {
        client.release();
    }
};

module.exports = {
    buscarUsuarioPorEmail,
    invalidarTokensAnteriores,
    criarTokenRecuperacao,
    buscarTokenValido,
    atualizarSenhaEConsumirToken
};
