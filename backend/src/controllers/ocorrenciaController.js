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
        const usuario = req.usuario;

        const tipoUsuario = String(
            usuario.tipo || usuario.role || ""
        ).toLowerCase();

        const ehAdministrador = [
            "administrador",
            "admin"
        ].includes(tipoUsuario);

        const ocorrenciaExistente =
            await ocorrenciaRepository.buscarOcorrenciaPorId(id);

        if (!ocorrenciaExistente) {
            return res.status(404).json({
                erro: "Ocorrência não encontrada"
            });
        }

        // O administrador mantém a possibilidade de atualizar
        // a ocorrência conforme as regras administrativas existentes.
        if (ehAdministrador) {
            const {
                descricao,
                categoria,
                status,
                endereco,
                bairro
            } = req.body;

            if (
                !descricao ||
                !categoria ||
                !status ||
                !endereco ||
                !bairro
            ) {
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

            return res.status(200).json(
                criarOcorrenciaResponseDto(ocorrencia)
            );
        }

        // O cidadão só pode editar a própria ocorrência.
        if (
            String(ocorrenciaExistente.usuario_id) !==
            String(usuario.id)
        ) {
            return res.status(403).json({
                erro: "Você não tem permissão para editar esta ocorrência"
            });
        }

        // A edição só é permitida enquanto estiver pendente.
        const statusAtual = String(
            ocorrenciaExistente.status || ""
        )
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "_");

        if (statusAtual !== "pendente") {
            return res.status(403).json({
                erro: "Esta ocorrência não pode mais ser editada porque já está em análise ou teve seu status alterado"
            });
        }

        const {
            descricao,
            categoria,
            endereco,
            bairro
        } = req.body;

        if (!descricao || !categoria || !endereco || !bairro) {
            return res.status(400).json({
                erro: "Descrição, categoria, endereço e bairro são obrigatórios"
            });
        }

        const dadosCidadao = {
            descricao,
            categoria,
            endereco,
            bairro,
            complemento: req.body.complemento || null,
            latitude: req.body.latitude ?? null,
            longitude: req.body.longitude ?? null,
            imagem: req.body.imagem || null,
            prioridade: req.body.prioridade || "baixa"
        };

        const ocorrencia =
            await ocorrenciaRepository.atualizarOcorrenciaDoCidadao(
                id,
                usuario.id,
                dadosCidadao
            );

        if (!ocorrencia) {
            return res.status(403).json({
                erro: "Não foi possível editar. Verifique se a ocorrência ainda está pendente."
            });
        }

        return res.status(200).json(
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
        const usuario = req.usuario;

        const tipoUsuario = String(
            usuario.tipo || usuario.role || ""
        ).toLowerCase();

        const ehAdministrador = [
            "administrador",
            "admin"
        ].includes(tipoUsuario);

        const ocorrenciaExistente =
            await ocorrenciaRepository.buscarOcorrenciaPorId(id);

        if (!ocorrenciaExistente) {
            return res.status(404).json({
                erro: "Ocorrência não encontrada"
            });
        }

        let ocorrencia;

        if (ehAdministrador) {
            // Mantém a exclusão administrativa existente.
            ocorrencia =
                await ocorrenciaRepository.excluirOcorrencia(id);
        } else {
            // O cidadão só pode excluir a própria ocorrência.
            if (
                String(ocorrenciaExistente.usuario_id) !==
                String(usuario.id)
            ) {
                return res.status(403).json({
                    erro: "Você não tem permissão para excluir esta ocorrência"
                });
            }

            ocorrencia =
                await ocorrenciaRepository.excluirOcorrenciaDoCidadao(
                    id,
                    usuario.id
                );
        }

        if (!ocorrencia) {
            return res.status(404).json({
                erro: "Ocorrência não encontrada ou já excluída"
            });
        }

        return res.status(200).json({
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