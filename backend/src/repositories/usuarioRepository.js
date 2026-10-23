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
        tipo,
        cpf,
        telefone,
        bairro
    } = dados;

    const resultado = await pool.query(
        `
        INSERT INTO usuarios
        (
            nome,
            email,
            senha,
            tipo,
            cpf,
            telefone,
            bairro
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, nome, email, tipo, cpf, telefone, bairro
        `,
        [
            nome,
            email,
            senha,
            tipo,
            cpf,
            telefone,
            bairro
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