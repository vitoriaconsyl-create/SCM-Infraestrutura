const pool = require("../database/database");

const buscarResumo = async (dataInicial) => {
    const resultado = await pool.query(
        `
        SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (
                WHERE status = 'concluida'
            ) AS resolvidas,
            COUNT(*) FILTER (
                WHERE status = 'em_andamento'
            ) AS em_andamento,
            COUNT(*) FILTER (
                WHERE prioridade = 'urgente'
            ) AS urgentes
        FROM ocorrencias
        WHERE criado_em >= $1
        `,
        [dataInicial]
    );

    return resultado.rows[0];
};

const buscarPorCategoria = async (dataInicial) => {
    const resultado = await pool.query(
        `
        SELECT
            categoria,
            COUNT(*) AS total
        FROM ocorrencias
        WHERE criado_em >= $1
        GROUP BY categoria
        ORDER BY total DESC
        `,
        [dataInicial]
    );

    return resultado.rows;
};

const buscarPorStatus = async (dataInicial) => {
    const resultado = await pool.query(
        `
        SELECT
            status,
            COUNT(*) AS total
        FROM ocorrencias
        WHERE criado_em >= $1
        GROUP BY status
        ORDER BY total DESC
        `,
        [dataInicial]
    );

    return resultado.rows;
};

const buscarPorBairro = async (dataInicial) => {
    const resultado = await pool.query(
        `
        SELECT
            bairro,
            COUNT(*) AS total,
            COUNT(*) FILTER (
                WHERE status = 'concluida'
            ) AS resolvidas
        FROM ocorrencias
        WHERE criado_em >= $1
        GROUP BY bairro
        ORDER BY total DESC
        `,
        [dataInicial]
    );

    return resultado.rows;
};

const buscarIndicadores = async (dataInicial) => {
    const resultado = await pool.query(
        `
        SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (
                WHERE status = 'concluida'
            ) AS resolvidas,
            COUNT(*) FILTER (
                WHERE status = 'em_andamento'
            ) AS em_andamento,
            COUNT(*) FILTER (
                WHERE status = 'pendente'
            ) AS pendentes,
            COUNT(*) FILTER (
                WHERE prioridade = 'urgente'
                AND status <> 'concluida'
            ) AS urgentes_abertas
        FROM ocorrencias
        WHERE criado_em >= $1
        `,
        [dataInicial]
    );

    return resultado.rows[0];
};

const buscarRelatorioCompleto = async (dataInicial) => {
    const resumo = await buscarResumo(dataInicial);

    const categorias = await buscarPorCategoria(dataInicial);

    const status = await buscarPorStatus(dataInicial);

    const bairros = await buscarPorBairro(dataInicial);

    const indicadores = await buscarIndicadores(dataInicial);

    return {
        resumo,
        categorias,
        status,
        bairros,
        indicadores
    };
};

module.exports = {
    buscarResumo,
    buscarPorCategoria,
    buscarPorStatus,
    buscarPorBairro,
    buscarIndicadores,
    buscarRelatorioCompleto
};