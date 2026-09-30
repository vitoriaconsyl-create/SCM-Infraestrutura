const pool = require("../database/database");

const listarOcorrencias = async () => {
    const resultado = await pool.query(`
        SELECT *
        FROM ocorrencias
        ORDER BY id DESC
    `);

    return resultado.rows;
};

const buscarOcorrenciaPorId = async (id) => {
    const resultado = await pool.query(
        `
        SELECT *
        FROM ocorrencias
        WHERE id = $1
        `,
        [id]
    );

    return resultado.rows[0];
};

const criarOcorrencia = async (dados) => {
    const {
        descricao,
        categoria,
        status,
        endereco,
        bairro,
        complemento,
        latitude,
        longitude,
        imagem,
        usuario_id,
        prioridade,
        protocolo
    } = dados;

    const resultado = await pool.query(
        `
        INSERT INTO ocorrencias
        (
            descricao,
            categoria,
            status,
            endereco,
            bairro,
            complemento,
            latitude,
            longitude,
            imagem,
            usuario_id,
            prioridade,
            protocolo
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
        `,
        [
            descricao,
            categoria,
            status,
            endereco,
            bairro,
            complemento,
            latitude,
            longitude,
            imagem,
            usuario_id,
            prioridade,
            protocolo
        ]
    );

    return resultado.rows[0];
};

const atualizarOcorrencia = async (id, dados) => {
    const {
        descricao,
        categoria,
        status,
        endereco,
        bairro,
        complemento,
        latitude,
        longitude,
        imagem,
        prioridade
    } = dados;

    const resultado = await pool.query(
        `
        UPDATE ocorrencias
        SET
            descricao = $1,
            categoria = $2,
            status = $3,
            endereco = $4,
            bairro = $5,
            complemento = $6,
            latitude = $7,
            longitude = $8,
            imagem = $9,
            prioridade = $10
        WHERE id = $11
        RETURNING *
        `,
        [
            descricao,
            categoria,
            status,
            endereco,
            bairro,
            complemento,
            latitude,
            longitude,
            imagem,
            prioridade,
            id
        ]
    );

    return resultado.rows[0];
};

const excluirOcorrencia = async (id) => {
    const resultado = await pool.query(
        `
        DELETE FROM ocorrencias
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return resultado.rows[0];
};

module.exports = {
    listarOcorrencias,
    buscarOcorrenciaPorId,
    criarOcorrencia,
    atualizarOcorrencia,
    excluirOcorrencia
};

