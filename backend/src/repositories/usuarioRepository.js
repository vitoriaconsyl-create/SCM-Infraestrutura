const pool = require("../database/database");

const listarUsuarios = async () => {
    const resultado = await pool.query(`
        SELECT id, nome, email, tipo
        FROM usuarios
        ORDER BY id DESC
    `);

    return resultado.rows;
};

const buscarUsuarioPorId = async (id) => {
    const resultado = await pool.query(
        `
        SELECT id, nome, email, tipo
        FROM usuarios
        WHERE id = $1
        `,
        [id]
    );

    return resultado.rows[0];
};

const listarOcorrenciasDoUsuario = async (usuarioId) => {
    const resultado = await pool.query(
        `
        SELECT *
        FROM ocorrencias
        WHERE usuario_id = $1
        ORDER BY id DESC
        `,
        [usuarioId]
    );

    return resultado.rows;
};

const criarUsuario = async (dados) => {
    const {
        nome,
        email,
        senha,
        tipo
    } = dados;

    const resultado = await pool.query(
        `
        INSERT INTO usuarios
        (
            nome,
            email,
            senha,
            tipo
        )
        VALUES ($1, $2, $3, $4)
        RETURNING id, nome, email, tipo
        `,
        [
            nome,
            email,
            senha,
            tipo
        ]
    );

    return resultado.rows[0];
};

module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    criarUsuario,
    listarOcorrenciasDoUsuario
};