const ocorrenciaRepository = require("../repositories/ocorrenciaRepository");

const criarOcorrenciaDto = require("../dtos/ocorrenciaDto");

const atualizarOcorrenciaDto = require("../dtos/atualizarOcorrenciaDto");

const criarOcorrenciaResponseDto = require("../dtos/ocorrenciaResponseDto");

const listarOcorrencias = async (req, res) => {
    try {
        const ocorrencias = await ocorrenciaRepository.listarOcorrencias();

        const resposta = ocorrencias.map(criarOcorrenciaResponseDto);

        res.status(200).json(resposta);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar ocorrências"
        });
    }
};

const buscarOcorrenciaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const ocorrencia = await ocorrenciaRepository.buscarOcorrenciaPorId(id);

        if (!ocorrencia) {
            return res.status(404).json({
                erro: "Ocorrência não encontrada"
            });
        }

        res.status(200).json(
            criarOcorrenciaResponseDto(ocorrencia)
        );
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar ocorrência"
        });
    }
};

const criarOcorrencia = async (req, res) => {
    try {
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
        } = req.body;

        if (!descricao || !categoria || !endereco || !bairro) {
            return res.status(400).json({
                erro: "Descrição, categoria, endereço e bairro são obrigatórios"
            });
        }

        const dados = criarOcorrenciaDto(req.body);

        dados.usuario_id = req.usuario.id;

        const numeroProtocolo =
            Math.floor(Math.random() * 90000) + 10000;

        dados.protocolo = `SCM-${numeroProtocolo}`;

        const ocorrencia = await ocorrenciaRepository.criarOcorrencia(dados);
        
        res.status(201).json(
            criarOcorrenciaResponseDto(ocorrencia)
        );
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao cadastrar ocorrência"
        });
    }
};

const atualizarOcorrencia = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            descricao,
            categoria,
            status,
            endereco,
            bairro
        } = req.body;

        if (!descricao || !categoria || !status || !endereco || !bairro) {
            return res.status(400).json({
                erro: "Descrição, categoria, status, endereço e bairro são obrigatórios"
            });
        }

        const dados = atualizarOcorrenciaDto(req.body);

        const ocorrencia =
            await ocorrenciaRepository.atualizarOcorrencia(
                id,
                dados
            );

        if (!ocorrencia) {
            return res.status(404).json({
                erro: "Ocorrência não encontrada"
            });
        }

        res.status(200).json(
            criarOcorrenciaResponseDto(ocorrencia)
        );

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao atualizar ocorrência"
        });
    }
};

const excluirOcorrencia = async (req, res) => {
    try {
        const { id } = req.params;

        const ocorrencia = await ocorrenciaRepository.excluirOcorrencia(id);

        if (!ocorrencia) {
            return res.status(404).json({
                erro: "Ocorrência não encontrada"
            });
        }

        res.status(200).json({
            mensagem: "Ocorrência excluída com sucesso"
        });
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao excluir ocorrência"
        });
    }
};

module.exports = {
    listarOcorrencias,
    buscarOcorrenciaPorId,
    criarOcorrencia,
    atualizarOcorrencia,
    excluirOcorrencia
};