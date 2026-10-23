
import { useEffect, useState } from "react";

import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    AlertCircle,
    MapPin,
    Calendar,
    FileText,
    Pencil,
    Trash2,
    X,
    Save,
} from "lucide-react";

import { apiRequest } from "../services/api";
import "../styles/acompanharOcorrencias.css";

function AcompanharOcorrencias({ token, onVoltar }) {
    const [ocorrencias, setOcorrencias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [ocorrenciaEditando, setOcorrenciaEditando] = useState(null);
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erroAcao, setErroAcao] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregarOcorrencias() {
            try {
                setCarregando(true);
                setErro("");

                const dados = await apiRequest(
                    "/usuarios/minhas/ocorrencias",
                    { method: "GET" },
                    token
                );

                if (ativo) {
                    setOcorrencias(
                        Array.isArray(dados) ? dados : []
                    );
                }
            } catch (erro) {
                console.error(
                    "Erro ao carregar minhas ocorrências:",
                    erro
                );

                if (ativo) {
                    setErro(
                        "Não foi possível carregar suas ocorrências. Verifique sua conexão e tente novamente."
                    );
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        if (token) {
            carregarOcorrencias();
        } else {
            setErro("Sua sessão expirou. Entre novamente no sistema.");
            setCarregando(false);
        }

        return () => {
            ativo = false;
        };
    }, [token]);

    function iniciarEdicao(ocorrencia) {
        setErroAcao("");
        setMensagem("");

        setOcorrenciaEditando({
            ...ocorrencia,
            descricao: ocorrencia.descricao || "",
            categoria: ocorrencia.categoria || "outro",
            endereco: ocorrencia.endereco || "",
            bairro: ocorrencia.bairro || "",
            complemento: ocorrencia.complemento || "",
            prioridade: ocorrencia.prioridade || "baixa",
        });
    }

    function cancelarEdicao() {
        setOcorrenciaEditando(null);
        setErroAcao("");
    }

    function atualizarCampo(campo, valor) {
        setOcorrenciaEditando((anterior) => ({
            ...anterior,
            [campo]: valor,
        }));
    }

    async function salvarEdicao(event) {
        event.preventDefault();

        if (!ocorrenciaEditando) return;

        try {
            setSalvando(true);
            setErroAcao("");
            setMensagem("");

            const dados = {
                descricao: ocorrenciaEditando.descricao.trim(),
                categoria: ocorrenciaEditando.categoria,
                endereco: ocorrenciaEditando.endereco.trim(),
                bairro: ocorrenciaEditando.bairro.trim(),
                complemento: ocorrenciaEditando.complemento.trim() || null,
                latitude: ocorrenciaEditando.latitude ?? null,
                longitude: ocorrenciaEditando.longitude ?? null,
                imagem: ocorrenciaEditando.imagem || null,
                prioridade: ocorrenciaEditando.prioridade,
            };

            if (
                !dados.descricao ||
                !dados.categoria ||
                !dados.endereco ||
                !dados.bairro
            ) {
                setErroAcao(
                    "Preencha a descrição, a categoria, o endereço e o bairro."
                );
                return;
            }

            await apiRequest(
                `/ocorrencias/${ocorrenciaEditando.id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(dados),
                },
                token
            );

            setOcorrencias((anteriores) =>
                anteriores.map((item) =>
                    String(item.id) === String(ocorrenciaEditando.id)
                        ? { ...item, ...dados }
                        : item
                )
            );

            setOcorrenciaEditando(null);
            setMensagem("Ocorrência atualizada com sucesso!");
        } catch (erro) {
            console.error("Erro ao editar ocorrência:", erro);
            setErroAcao(erro.message || "Não foi possível editar a ocorrência.");
        } finally {
            setSalvando(false);
        }
    }

    async function excluirOcorrencia(ocorrencia) {
        const confirmar = window.confirm(
            `Tem certeza de que deseja excluir a ocorrência #${ocorrencia.id}? Essa ação não poderá ser desfeita.`
        );

        if (!confirmar) return;

        try {
            setErroAcao("");
            setMensagem("");

            await apiRequest(
                `/ocorrencias/${ocorrencia.id}`,
                {
                    method: "DELETE",
                },
                token
            );

            setOcorrencias((anteriores) =>
                anteriores.filter(
                    (item) => String(item.id) !== String(ocorrencia.id)
                )
            );

            if (
                String(ocorrenciaEditando?.id) === String(ocorrencia.id)
            ) {
                setOcorrenciaEditando(null);
            }

            setMensagem("Ocorrência excluída com sucesso!");
        } catch (erro) {
            console.error("Erro ao excluir ocorrência:", erro);
            setErroAcao(erro.message || "Não foi possível excluir a ocorrência.");
        }
    }

    function formatarData(data) {
        if (!data) return "Data não informada";

        const dataObjeto = new Date(data);

        if (Number.isNaN(dataObjeto.getTime())) {
            return "Data não informada";
        }

        return dataObjeto.toLocaleDateString("pt-BR", {
            timeZone: "UTC",
        });
    }

    function formatarCategoria(categoria) {
        const categorias = {
            buraco: "Buraco na via",
            iluminacao: "Iluminação pública",
            semaforo: "Semáforo",
            calcada: "Calçada danificada",
            esgoto: "Problema de esgoto",
            lixo: "Acúmulo de lixo",
            arvore: "Árvore",
            sinalizacao: "Sinalização",
            outro: "Outra ocorrência",
        };

        if (!categoria) return "Ocorrência";

        return categorias[categoria.toLowerCase()] ||
            categoria.charAt(0).toUpperCase() + categoria.slice(1);
    }

    function normalizarStatus(status) {
        return String(status || "pendente")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[\s-]+/g, "_");
    }

    function obterStatus(status) {
        const statusNormalizado = normalizarStatus(status);

        if (
            ["concluido", "concluida", "resolvido", "resolvida"].includes(
                statusNormalizado
            )
        ) {
            return {
                texto: "Concluída",
                classe: "acompanhar-status-concluido",
                etapa: 4,
            };
        }

        if (
            ["em_andamento", "em_atendimento", "em_execucao"].includes(
                statusNormalizado
            )
        ) {
            return {
                texto: "Em andamento",
                classe: "acompanhar-status-andamento",
                etapa: 3,
            };
        }

        if (
            ["em_analise", "em_analise_tecnica", "em_analise_da_prefeitura"].includes(
                statusNormalizado
            )
        ) {
            return {
                texto: "Em análise",
                classe: "acompanhar-status-analise",
                etapa: 2,
            };
        }

        if (statusNormalizado === "cancelado" || statusNormalizado === "cancelada") {
            return {
                texto: "Cancelada",
                classe: "acompanhar-status-cancelado",
                etapa: 0,
            };
        }

        return {
            texto: "Pendente",
            classe: "acompanhar-status-aguardando",
            etapa: 1,
        };
    }

    function montarEndereco(ocorrencia) {
        return [
            ocorrencia.endereco,
            ocorrencia.bairro,
        ]
            .filter(Boolean)
            .join(" — ") || "Endereço não informado";
    }

    function etapaConcluida(ocorrencia, etapa) {
        const status = obterStatus(ocorrencia.status);

        if (status.etapa === 0) return false;

        return status.etapa >= etapa;
    }

    function etapaAtual(ocorrencia, etapa) {
        return obterStatus(ocorrencia.status).etapa === etapa;
    }

    function renderizarEtapa(ocorrencia, numero, texto, Icone) {
        const concluida = etapaConcluida(ocorrencia, numero);
        const atual = etapaAtual(ocorrencia, numero);

        return (
            <div
                className={`acompanhar-progresso-item ${concluida ? "concluido" : ""
                    } ${atual ? "atual" : ""}`}
                key={numero}
            >
                <div className="acompanhar-progresso-icon">
                    <Icone size={18} />
                </div>

                <span>{texto}</span>
            </div>
        );
    }

    return (
        <div className="acompanhar-container">
            <main className="acompanhar-main">
                <button
                    type="button"
                    className="acompanhar-voltar"
                    onClick={onVoltar}
                >
                    <ArrowLeft size={18} />
                    Voltar ao painel
                </button>

                <section className="acompanhar-header">
                    <div>
                        <h2>Minhas Ocorrências</h2>
                        <p>
                            Consulte suas solicitações e acompanhe o andamento
                            de cada uma delas.
                        </p>
                    </div>
                </section>
                {mensagem && (
                    <div className="acompanhar-mensagem" role="status">
                        {mensagem}
                    </div>
                )}

                {erroAcao && (
                    <div
                        className="acompanhar-mensagem acompanhar-mensagem-erro"
                        role="alert"
                    >
                        {erroAcao}
                    </div>
                )}
                {carregando && (
                    <div className="acompanhar-mensagem">
                        Carregando suas ocorrências...
                    </div>
                )}

                {!carregando && erro && (
                    <div
                        className="acompanhar-mensagem acompanhar-mensagem-erro"
                        role="alert"
                    >
                        <p>{erro}</p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {!carregando && !erro && ocorrencias.length === 0 && (
                    <div className="acompanhar-vazio">
                        <FileText size={38} />

                        <h3>Nenhuma ocorrência registrada</h3>

                        <p>
                            Quando você registrar uma solicitação, ela aparecerá
                            aqui para acompanhamento.
                        </p>
                    </div>
                )}

                {!carregando && !erro && ocorrencias.length > 0 && (
                    <section className="acompanhar-lista">
                        {ocorrencias.map((ocorrencia) => {
                            const status = obterStatus(ocorrencia.status);

                            const podeEditar =
                                normalizarStatus(ocorrencia.status) === "pendente";


                            return (
                                <article
                                    key={ocorrencia.id}
                                    className="acompanhar-card"
                                >
                                    <div className="acompanhar-card-top">
                                        <div className="acompanhar-card-title">
                                            <div className="acompanhar-icon">
                                                <FileText size={22} />
                                            </div>

                                            <div>
                                                <h3>
                                                    #{ocorrencia.id} -{" "}
                                                    {formatarCategoria(
                                                        ocorrencia.categoria
                                                    )}
                                                </h3>

                                                <span>
                                                    Protocolo:{" "}
                                                    {ocorrencia.protocolo ||
                                                        "Não informado"}
                                                </span>
                                            </div>
                                        </div>

                                        <span
                                            className={`acompanhar-status ${status.classe}`}
                                        >
                                            {status.texto}
                                        </span>

                                        <div className="acompanhar-acoes">
                                            {podeEditar && (
                                                <button
                                                    type="button"
                                                    className="acompanhar-botao-editar"
                                                    onClick={() => iniciarEdicao(ocorrencia)}
                                                    title="Editar ocorrência"
                                                >
                                                    <Pencil size={16} />
                                                    Editar
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="acompanhar-botao-excluir"
                                                onClick={() => excluirOcorrencia(ocorrencia)}
                                                title="Excluir ocorrência"
                                            >
                                                <Trash2 size={16} />
                                                Excluir
                                            </button>
                                        </div>
                                    </div>

                                    <div className="acompanhar-informacoes">
                                        <div className="acompanhar-info">
                                            <MapPin size={17} />
                                            <span>
                                                {montarEndereco(ocorrencia)}
                                            </span>
                                        </div>

                                        <div className="acompanhar-info">
                                            <Calendar size={17} />
                                            <span>
                                                Registrada em{" "}
                                                {formatarData(
                                                    ocorrencia.criado_em
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="acompanhar-descricao">
                                        {ocorrencia.descricao ||
                                            "Sem descrição informada."}
                                    </p>

                                    {ocorrenciaEditando &&
                                        String(ocorrenciaEditando.id) === String(ocorrencia.id) && (
                                            <form
                                                className="acompanhar-form-edicao"
                                                onSubmit={salvarEdicao}
                                            >
                                                <h4>Editar ocorrência #{ocorrencia.id}</h4>

                                                <label htmlFor={`categoria-${ocorrencia.id}`}>
                                                    Categoria
                                                </label>
                                                <select
                                                    id={`categoria-${ocorrencia.id}`}
                                                    value={ocorrenciaEditando.categoria}
                                                    onChange={(e) =>
                                                        atualizarCampo("categoria", e.target.value)
                                                    }
                                                    required
                                                >
                                                    <option value="buraco">Buraco na via</option>
                                                    <option value="iluminacao">Iluminação pública</option>
                                                    <option value="semaforo">Semáforo</option>
                                                    <option value="calcada">Calçada danificada</option>
                                                    <option value="esgoto">Problema de esgoto</option>
                                                    <option value="lixo">Acúmulo de lixo</option>
                                                    <option value="arvore">Árvore</option>
                                                    <option value="sinalizacao">Sinalização</option>
                                                    <option value="outro">Outra ocorrência</option>
                                                </select>

                                                <label htmlFor={`descricao-${ocorrencia.id}`}>
                                                    Descrição
                                                </label>
                                                <textarea
                                                    id={`descricao-${ocorrencia.id}`}
                                                    value={ocorrenciaEditando.descricao}
                                                    onChange={(e) =>
                                                        atualizarCampo("descricao", e.target.value)
                                                    }
                                                    minLength={20}
                                                    maxLength={500}
                                                    required
                                                    rows={4}
                                                />

                                                <label htmlFor={`endereco-${ocorrencia.id}`}>
                                                    Endereço
                                                </label>
                                                <input
                                                    id={`endereco-${ocorrencia.id}`}
                                                    type="text"
                                                    value={ocorrenciaEditando.endereco}
                                                    onChange={(e) =>
                                                        atualizarCampo("endereco", e.target.value)
                                                    }
                                                    required
                                                />

                                                <label htmlFor={`bairro-${ocorrencia.id}`}>
                                                    Bairro
                                                </label>
                                                <input
                                                    id={`bairro-${ocorrencia.id}`}
                                                    type="text"
                                                    value={ocorrenciaEditando.bairro}
                                                    onChange={(e) =>
                                                        atualizarCampo("bairro", e.target.value)
                                                    }
                                                    required
                                                />

                                                <label htmlFor={`complemento-${ocorrencia.id}`}>
                                                    Complemento (opcional)
                                                </label>
                                                <input
                                                    id={`complemento-${ocorrencia.id}`}
                                                    type="text"
                                                    value={ocorrenciaEditando.complemento}
                                                    onChange={(e) =>
                                                        atualizarCampo("complemento", e.target.value)
                                                    }
                                                />

                                                <label htmlFor={`prioridade-${ocorrencia.id}`}>
                                                    Prioridade
                                                </label>
                                                <select
                                                    id={`prioridade-${ocorrencia.id}`}
                                                    value={ocorrenciaEditando.prioridade}
                                                    onChange={(e) =>
                                                        atualizarCampo("prioridade", e.target.value)
                                                    }
                                                    required
                                                >
                                                    <option value="baixa">Baixa</option>
                                                    <option value="media">Média</option>
                                                    <option value="alta">Alta</option>
                                                    <option value="urgente">Urgente</option>
                                                </select>

                                                {erroAcao && (
                                                    <p className="acompanhar-form-erro" role="alert">
                                                        {erroAcao}
                                                    </p>
                                                )}

                                                <div className="acompanhar-form-botoes">
                                                    <button
                                                        type="submit"
                                                        className="acompanhar-botao-editar"
                                                        disabled={salvando}
                                                    >
                                                        <Save size={16} />
                                                        {salvando ? "Salvando..." : "Salvar alterações"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="acompanhar-botao-cancelar"
                                                        onClick={cancelarEdicao}
                                                        disabled={salvando}
                                                    >
                                                        <X size={16} />
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                    <div className="acompanhar-progresso">
                                        {renderizarEtapa(
                                            ocorrencia,
                                            1,
                                            "Registrada",
                                            CheckCircle2
                                        )}

                                        <div className="acompanhar-linha" />

                                        {renderizarEtapa(
                                            ocorrencia,
                                            2,
                                            "Em análise",
                                            Clock
                                        )}

                                        <div className="acompanhar-linha" />

                                        {renderizarEtapa(
                                            ocorrencia,
                                            3,
                                            "Em atendimento",
                                            AlertCircle
                                        )}

                                        <div className="acompanhar-linha" />

                                        {renderizarEtapa(
                                            ocorrencia,
                                            4,
                                            "Concluída",
                                            CheckCircle2
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </main>
        </div>
    );
}

export default AcompanharOcorrencias;
