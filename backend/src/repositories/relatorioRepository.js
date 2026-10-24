const pool = require("../database/database");

const buscarResumo = async (dataInicial) => {
    const resultado = await pool.query(
        `
        SELECT
            COUNT(*) AS total,
            COUNT(*) FILTER (
                WHERE status = 'concluido'
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
    INITCAP(LOWER(TRIM(bairro))) AS bairro,
    COUNT(*) AS total,
    COUNT(*) FILTER (
        WHERE status IN ('concluido', 'concluida')
    ) AS resolvidas
FROM ocorrencias
WHERE criado_em >= $1
GROUP BY LOWER(TRIM(bairro))
ORDER BY bairro;`,
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
                WHERE status = 'concluido'
            ) AS resolvidas,
            COUNT(*) FILTER (
                WHERE status = 'em_andamento'
            ) AS em_andamento,
            COUNT(*) FILTER (
                WHERE status = 'pendente'
            ) AS pendentes,
            COUNT(*) FILTER (
                WHERE prioridade = 'urgente'
                AND status <> 'concluido'
            ) AS urgentes_abertas
        FROM ocorrencias
        WHERE criado_em >= $1
        `,
        [dataInicial]
    );

    return resultado.rows[0];
};

const buscarIndicadoresPainel = async () => {
    const resultado = await pool.query(`
        SELECT
            COUNT(*) FILTER (
                WHERE LOWER(TRIM(status)) NOT IN (
                    'concluido',
                    'concluida',
                    'cancelado',
                    'cancelada'
                )
            ) AS ocorrencias_ativas,

            COUNT(*) FILTER (
                WHERE LOWER(TRIM(status)) IN (
                    'em_andamento',
                    'em andament',
                    'em andamento'
                )
            ) AS em_andamento,

            COUNT(*) FILTER (
    WHERE LOWER(TRIM(status)) IN (
        'concluido',
        'concluida'
    )
    AND concluida_em >= CURRENT_DATE
    AND concluida_em < CURRENT_DATE + INTERVAL '1 day'
) AS concluidas_hoje
        FROM ocorrencias
    `);

    return resultado.rows[0];
};


const buscarOcorrenciasPendentesPainel = async () => {
    const resultado = await pool.query(`
        SELECT
            o.id,
            o.protocolo,
            o.categoria,
            o.endereco,
            o.bairro,
            o.prioridade,
            o.status,
            o.criado_em,
            u.nome AS solicitante

        FROM ocorrencias o

        LEFT JOIN usuarios u
            ON u.id = o.usuario_id

        WHERE LOWER(TRIM(o.status)) IN (
            'pendente',
            'pendentes'
        )

        ORDER BY o.criado_em DESC

        LIMIT 4
    `);

    return resultado.rows;
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
    buscarIndicadoresPainel,
    buscarOcorrenciasPendentesPainel,
    buscarRelatorioCompleto
};