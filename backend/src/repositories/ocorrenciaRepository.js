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
        protocolo,
        equipe
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
            protocolo,
            equipe
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
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
            protocolo,
            equipe || null
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
        prioridade,
        equipe
    } = dados;

    const resultado = await pool.query(
        `
        UPDATE ocorrencias
        SET
            descricao = COALESCE($1, descricao),
            categoria = COALESCE($2, categoria),
            status = COALESCE($3, status), 
            concluida_em = CASE
    WHEN $3 IS NULL THEN concluida_em
    WHEN LOWER(TRIM($3)) IN ('concluido', 'concluida')
        AND LOWER(TRIM(status)) NOT IN ('concluido', 'concluida')
        THEN CURRENT_TIMESTAMP
    WHEN LOWER(TRIM($3)) NOT IN ('concluido', 'concluida')
        THEN NULL
    ELSE concluida_em
END,
            endereco = COALESCE($4, endereco),
            bairro = COALESCE($5, bairro),
            complemento = COALESCE($6, complemento),
            latitude = COALESCE($7, latitude),
            longitude = COALESCE($8, longitude),
            imagem = COALESCE($9, imagem),
            prioridade = COALESCE($10, prioridade),
            equipe = COALESCE($11, equipe)
        WHERE id = $12
        RETURNING *
        `,
        [
            descricao ?? null,
            categoria ?? null,
            status ?? null,
            endereco ?? null,
            bairro ?? null,
            complemento ?? null,
            latitude ?? null,
            longitude ?? null,
            imagem ?? null,
            prioridade ?? null,
            equipe ?? null,
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

const atualizarOcorrenciaDoCidadao = async (id, usuarioId, dados) => {
    const {
        descricao,
        categoria,
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
            endereco = $3,
            bairro = $4,
            complemento = $5,
            latitude = $6,
            longitude = $7,
            imagem = $8,
            prioridade = $9
        WHERE
            id = $10
            AND usuario_id = $11
            AND LOWER(REPLACE(status, ' ', '_')) = 'pendente'
        RETURNING *
        `,
        [
            descricao,
            categoria,
            endereco,
            bairro,
            complemento,
            latitude,
            longitude,
            imagem,
            prioridade,
            id,
            usuarioId
        ]
    );

    return resultado.rows[0];
};


const excluirOcorrenciaDoCidadao = async (id, usuarioId) => {
    const resultado = await pool.query(
        `
        DELETE FROM ocorrencias
        WHERE id = $1
          AND usuario_id = $2
        RETURNING *
        `,
        [id, usuarioId]
    );

    return resultado.rows[0];
};

module.exports = {
    listarOcorrencias,
    buscarOcorrenciaPorId,
    criarOcorrencia,
    atualizarOcorrencia,
    excluirOcorrencia,
    atualizarOcorrenciaDoCidadao,
    excluirOcorrenciaDoCidadao
};

