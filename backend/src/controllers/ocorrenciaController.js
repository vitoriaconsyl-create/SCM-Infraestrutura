const ocorrenciaRepository = require("../repositories/ocorrenciaRepository");

const notificacaoRepository = require("../repositories/notificacaoRepository");

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

        // ATUALIZAÇÃO ADMINISTRATIVA
        if (ehAdministrador) {
            const camposPermitidos = [
                "descricao",
                "categoria",
                "status",
                "endereco",
                "bairro",
                "complemento",
                "latitude",
                "longitude",
                "imagem",
                "prioridade",
                "equipe"
            ];

            const camposEnviados = Object.keys(req.body);

            if (camposEnviados.length === 0) {
                return res.status(400).json({
                    erro: "Informe pelo menos um campo para atualizar"
                });
            }

            const campoInvalido = camposEnviados.some(
                (campo) => !camposPermitidos.includes(campo)
            );

            if (campoInvalido) {
                return res.status(400).json({
                    erro: "A requisição contém campos não permitidos"
                });
            }

            const statusPermitidos = [
                "pendente",
                "em_análise",
                "em_andamento",
                "aguardando_peças",
                "concluido",
                "cancelado"
            ];

            if (req.body.status !== undefined) {
                const statusRecebido = String(req.body.status)
                    .trim()
                    .toLowerCase();

                if (!statusPermitidos.includes(statusRecebido)) {
                    return res.status(400).json({
                        erro: "Status inválido"
                    });
                }
            }

            const equipesPermitidas = [
                "Equipe Pavimentação A",
                "Equipe Pavimentação B",
                "Equipe Elétrica A",
                "Equipe Elétrica B",
                "Equipe Saneamento A",
                "Equipe Saneamento B",
                "Equipe de Limpeza",
                "Equipe de Sinalização"
            ];

            if (req.body.equipe !== undefined) {
                if (
                    req.body.equipe !== null &&
                    !equipesPermitidas.includes(req.body.equipe)
                ) {
                    return res.status(400).json({
                        erro: "Equipe inválida"
                    });
                }
            }

            const dados = {};

            for (const campo of camposEnviados) {
                dados[campo] = req.body[campo];
            }
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

            // Cria uma notificação somente quando o status realmente muda.
            const statusAnterior = String(
                ocorrenciaExistente.status || ""
            ).trim().toLowerCase();

            const statusNovo = String(
                ocorrencia.status || ""
            ).trim().toLowerCase();

            if (
                dados.status !== undefined &&
                statusAnterior !== statusNovo &&
                ocorrencia.usuario_id
            ) {
                const statusExibicao = {
                    pendente: "Pendente",
                    "em_análise": "Em análise",
                    em_analise: "Em análise",
                    em_andamento: "Em andamento",
                    "aguardando_peças": "Aguardando peças",
                    aguardando_pecas: "Aguardando peças",
                    concluido: "Concluído",
                    concluída: "Concluído",
                    cancelado: "Cancelado"
                };

                const statusFormatado =
                    statusExibicao[statusNovo] || statusNovo;

                await notificacaoRepository.criarNotificacao({
                    usuario_id: ocorrencia.usuario_id,
                    ocorrencia_id: ocorrencia.id,
                    mensagem:
                        `O status da sua ocorrência ${ocorrencia.protocolo || ""} foi atualizado para "${statusFormatado}".`
                });
            }

            return res.status(200).json(
                criarOcorrenciaResponseDto(ocorrencia)
            );
        }

        // O CIDADÃO SÓ PODE EDITAR A PRÓPRIA OCORRÊNCIA.
        if (
            String(ocorrenciaExistente.usuario_id) !==
            String(usuario.id)
        ) {
            return res.status(403).json({
                erro: "Você não tem permissão para editar esta ocorrência"
            });
        }

        // A EDIÇÃO DO CIDADÃO SÓ É PERMITIDA ENQUANTO PENDENTE.
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
            complemento: req.body.complemento ?? null,
            latitude: req.body.latitude ?? null,
            longitude: req.body.longitude ?? null,
            imagem: req.body.imagem ?? null,
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

        return res.status(500).json({
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

            const statusAtual = String(
                ocorrenciaExistente.status || ""
            )
                .trim()
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[\s-]+/g, "_");

            if (statusAtual !== "pendente") {
                return res.status(403).json({
                    erro: "Esta ocorrência não pode ser excluída porque já teve seu atendimento iniciado ou seu status foi alterado."
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