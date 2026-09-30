const relatorioRepository =
    require("../repositories/relatorioRepository");


const calcularDataInicial = (periodo) => {

    const dataInicial = new Date();

    if (periodo === "7") {
        dataInicial.setDate(
            dataInicial.getDate() - 7
        );
    }

    else if (periodo === "30") {
        dataInicial.setDate(
            dataInicial.getDate() - 30
        );
    }

    else if (periodo === "3meses") {
        dataInicial.setMonth(
            dataInicial.getMonth() - 3
        );
    }

    else if (periodo === "ano") {
        return new Date(
            new Date().getFullYear(),
            0,
            1
        );
    }

    else {
        return null;
    }

    return dataInicial;
};


const buscarResumo = async (req, res) => {

    try {

        const { periodo } = req.query;

        const dataInicial =
            calcularDataInicial(periodo);

        if (!dataInicial) {
            return res.status(400).json({
                erro: "Período inválido"
            });
        }

        const resumo =
            await relatorioRepository.buscarResumo(
                dataInicial
            );

        res.status(200).json(resumo);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao gerar resumo"
        });
    }
};


const buscarPorCategoria = async (req, res) => {

    try {

        const { periodo } = req.query;

        const dataInicial =
            calcularDataInicial(periodo);

        if (!dataInicial) {
            return res.status(400).json({
                erro: "Período inválido"
            });
        }

        const resultado =
            await relatorioRepository.buscarPorCategoria(
                dataInicial
            );

        res.status(200).json(resultado);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar ocorrências por categoria"
        });
    }
};


const buscarPorStatus = async (req, res) => {

    try {

        const { periodo } = req.query;

        const dataInicial =
            calcularDataInicial(periodo);

        if (!dataInicial) {
            return res.status(400).json({
                erro: "Período inválido"
            });
        }

        const resultado =
            await relatorioRepository.buscarPorStatus(
                dataInicial
            );

        res.status(200).json(resultado);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar ocorrências por status"
        });
    }
};


const buscarPorBairro = async (req, res) => {

    try {

        const { periodo } = req.query;

        const dataInicial =
            calcularDataInicial(periodo);

        if (!dataInicial) {
            return res.status(400).json({
                erro: "Período inválido"
            });
        }

        const resultado =
            await relatorioRepository.buscarPorBairro(
                dataInicial
            );

        res.status(200).json(resultado);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar ocorrências por bairro"
        });
    }
};


const buscarIndicadores = async (req, res) => {

    try {

        const { periodo } = req.query;

        const dataInicial =
            calcularDataInicial(periodo);

        if (!dataInicial) {
            return res.status(400).json({
                erro: "Período inválido"
            });
        }

        const resultado =
            await relatorioRepository.buscarIndicadores(
                dataInicial
            );

        res.status(200).json(resultado);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar indicadores"
        });
    }
};

const buscarRelatorioCompleto = async (req, res) => {
    try {
        const { periodo } = req.query;

        const dataInicial = calcularDataInicial(periodo);

        if (!dataInicial) {
            return res.status(400).json({
                erro: "Período inválido"
            });
        }

        const resultado =
            await relatorioRepository.buscarRelatorioCompleto(
                dataInicial
            );

        res.status(200).json(resultado);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao gerar relatório completo"
        });
    }
};

module.exports = {
    buscarResumo,
    buscarPorCategoria,
    buscarPorStatus,
    buscarPorBairro,
    buscarIndicadores,
    buscarRelatorioCompleto
};