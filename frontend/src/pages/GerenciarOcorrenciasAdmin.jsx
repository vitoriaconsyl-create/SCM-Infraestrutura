import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import Header from "../components/Header";
import {
    Building2,
    LogOut,
    ArrowLeft,
    Search,
    Eye,
    Users,
    Bell,
    CheckCircle2,
    X,
    ChevronDown,
    ChevronUp,
    MapPin,
    Calendar,
    User,
    Tag,
    AlertCircle,
    Clock,
    Loader2,
    SlidersHorizontal,
} from "lucide-react";

import "../styles/gerenciarOcorrencias.css";

function GerenciarOcorrenciasAdmin({
    onVoltar,
    onLogout,
    userName,
    token,
}) {
    const [ocorrencias, setOcorrencias] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");

    const [busca, setBusca] = useState("");
    const [filtroStatus, setFiltroStatus] = useState("Todos");
    const [filtroPrioridade, setFiltroPrioridade] = useState("Todos");

    const [expandida, setExpandida] = useState(null);

    const [modal, setModal] = useState(null);
    const [selecionada, setSelecionada] = useState(null);

    const [novaEquipe, setNovaEquipe] = useState("");
    const [novoStatus, setNovoStatus] = useState("");
    const [mensagem, setMensagem] = useState("");

    const [salvando, setSalvando] = useState(false);
    const [toast, setToast] = useState("");

    function formatarStatus(status) {
        const valor = String(status || "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "_");

        const statusMap = {
            pendente: "Pendente",
            em_analise: "Em análise",
            "em_análise": "Em análise",
            em_andamento: "Em andamento",
            aguardando_pecas: "Aguardando peças",
            "aguardando_peças": "Aguardando peças",
            concluido: "Concluído",
            concluida: "Concluído",
            cancelado: "Cancelado",
        };

        return statusMap[valor] || status || "Pendente";
    }

    function formatarPrioridade(prioridade) {
        const valor = String(prioridade || "baixa").toLowerCase();

        const prioridadeMap = {
            baixa: "Baixa",
            media: "Média",
            alta: "Alta",
            urgente: "Urgente",
        };

        return prioridadeMap[valor] || prioridade;
    }

    function formatarData(data) {
        if (!data) return "Data não informada";

        const dataObj = new Date(data);

        if (Number.isNaN(dataObj.getTime())) {
            return "Data não informada";
        }

        return dataObj.toLocaleDateString("pt-BR", {
            timeZone: "UTC",
        });
    }

    function adaptarOcorrencia(dados) {
        return {
            ...dados,
            id: String(dados.id),
            tipo: dados.categoria || "Não informado",
            endereco: [
                dados.endereco,
                dados.bairro,
                dados.complemento,
            ]
                .filter(Boolean)
                .join(", "),
            cidadao: dados.usuario_nome || (
                dados.usuario_id
                    ? `Usuário ${dados.usuario_id}`
                    : "Cidadão não identificado"
            ),
            data: formatarData(dados.criado_em),
            status: formatarStatus(dados.status),
            prioridade: formatarPrioridade(dados.prioridade),
            equipe: dados.equipe || "",
            descricao: dados.descricao || "",
        };
    }

    useEffect(() => {
        async function carregarOcorrencias() {
            if (!token) {
                setErroCarregamento(
                    "Sessão não encontrada. Faça login novamente."
                );
                setCarregando(false);
                return;
            }

            try {
                setCarregando(true);
                setErroCarregamento("");

                const dados = await apiRequest(
                    "/ocorrencias",
                    { method: "GET" },
                    token
                );

                if (!Array.isArray(dados)) {
                    throw new Error(
                        "A API retornou um formato inesperado."
                    );
                }

                setOcorrencias(dados.map(adaptarOcorrencia));
            } catch (erro) {
                setErroCarregamento(
                    erro.message || "Não foi possível carregar as ocorrências."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarOcorrencias();
    }, [token]);

    const equipes = [
        "Equipe Pavimentação A",
        "Equipe Pavimentação B",
        "Equipe Elétrica A",
        "Equipe Elétrica B",
        "Equipe Saneamento A",
        "Equipe Saneamento B",
        "Equipe de Limpeza",
        "Equipe de Sinalização",
    ];

    const statusOptions = [
        "Pendente",
        "Em análise",
        "Em andamento",
        "Aguardando peças",
        "Concluído",
        "Cancelado",
    ];

    const ocorrenciasFiltradas = ocorrencias.filter((ocorrencia) => {
        const termo = busca.toLowerCase();

        const correspondeBusca =
            !termo ||
            ocorrencia.tipo.toLowerCase().includes(termo) ||
            ocorrencia.protocolo.toLowerCase().includes(termo) ||
            ocorrencia.cidadao.toLowerCase().includes(termo) ||
            ocorrencia.endereco.toLowerCase().includes(termo);

        const correspondeStatus =
            filtroStatus === "Todos" ||
            ocorrencia.status === filtroStatus;

        const correspondePrioridade =
            filtroPrioridade === "Todos" ||
            ocorrencia.prioridade === filtroPrioridade;

        return (
            correspondeBusca &&
            correspondeStatus &&
            correspondePrioridade
        );
    });

    const estatisticas = {
        total: ocorrencias.length,

        pendentes: ocorrencias.filter(
            (ocorrencia) =>
                ocorrencia.status === "Pendente"
        ).length,

        andamento: ocorrencias.filter(
            (ocorrencia) =>
                ocorrencia.status === "Em andamento"
        ).length,

        concluidas: ocorrencias.filter(
            (ocorrencia) =>
                ocorrencia.status === "Concluído"
        ).length,
    };

    function abrirModal(ocorrencia, tipo) {
        setSelecionada(ocorrencia);
        setModal(tipo);
        setNovaEquipe(ocorrencia.equipe);
        setNovoStatus(ocorrencia.status);
        setMensagem("");
    }

    function fecharModal() {
        if (!salvando) {
            setModal(null);
            setSelecionada(null);
        }
    }

    function mostrarToast(texto) {
        setToast(texto);

        setTimeout(() => {
            setToast("");
        }, 3500);
    }


    async function salvarAtribuicao() {
        if (!selecionada || !novaEquipe) {
            return;
        }

        setSalvando(true);
        setErroCarregamento("");

        try {
            const dadosAtualizados = {
                equipe: novaEquipe,
            };

            // Se a ocorrência estiver pendente, também inicia o andamento.
            if (selecionada.status === "Pendente") {
                dadosAtualizados.status = "em_andamento";
            }

            const resposta = await apiRequest(
                `/ocorrencias/${selecionada.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dadosAtualizados),
                },
                token
            );

            // Atualiza a lista com os dados retornados pela API.
            const ocorrenciaAtualizada = adaptarOcorrencia({
                ...selecionada,
                ...resposta,
                equipe: resposta.equipe ?? novaEquipe,
                status: resposta.status ??
                    dadosAtualizados.status ??
                    selecionada.status,
            });

            setOcorrencias((lista) =>
                lista.map((ocorrencia) =>
                    ocorrencia.id === selecionada.id
                        ? ocorrenciaAtualizada
                        : ocorrencia
                )
            );

            setSelecionada(ocorrenciaAtualizada);
            setModal(null);

            mostrarToast(
                `Equipe "${novaEquipe}" atribuída à ocorrência ${selecionada.protocolo}.`
            );
        } catch (erro) {
            setErroCarregamento(
                erro.message || "Não foi possível atribuir a equipe."
            );

            mostrarToast(
                erro.message || "Erro ao salvar a equipe. Tente novamente."
            );
        } finally {
            setSalvando(false);
        }
    }


    async function salvarStatus() {
        if (!selecionada || !novoStatus) {
            return;
        }

        setSalvando(true);

        try {
            // Converte o status exibido na tela para o formato da API.
            const statusMap = {
                "Pendente": "pendente",
                "Em análise": "em_análise",
                "Em andamento": "em_andamento",
                "Aguardando peças": "aguardando_pecas",
                "Concluído": "concluido",
                "Cancelado": "cancelado",
            };

            const statusParaEnviar = statusMap[novoStatus];

            if (!statusParaEnviar) {
                throw new Error("O status selecionado não é válido.");
            }

            // Envia o novo status ao backend.
            const resposta = await apiRequest(
                `/ocorrencias/${selecionada.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: statusParaEnviar,
                    }),
                },
                token
            );

            // Atualiza a ocorrência com o retorno da API.
            const ocorrenciaAtualizada = adaptarOcorrencia({
                ...selecionada,
                ...resposta,
                status: resposta.status ?? statusParaEnviar,
            });

            setOcorrencias((lista) =>
                lista.map((ocorrencia) =>
                    ocorrencia.id === selecionada.id
                        ? ocorrenciaAtualizada
                        : ocorrencia
                )
            );

            setSelecionada(ocorrenciaAtualizada);
            setModal(null);

            mostrarToast(
                `Status da ocorrência ${selecionada.protocolo} atualizado.`
            );
        } catch (erro) {
            mostrarToast(
                erro.message || "Não foi possível atualizar o status."
            );
        } finally {
            setSalvando(false);
        }
    }

    async function enviarNotificacao() {
        if (!selecionada || !mensagem.trim() || salvando) {
            return;
        }

        setSalvando(true);

        try {
            await apiRequest(
                "/notificacoes",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ocorrencia_id: Number(selecionada.id),
                        mensagem: mensagem.trim(),
                    }),
                },
                token
            );

            const protocolo = selecionada.protocolo;

            setModal(null);
            setMensagem("");

            mostrarToast(
                `Notificação enviada para ${selecionada.cidadao} — ${protocolo}.`
            );
        } catch (erro) {
            mostrarToast(
                erro.message || "Não foi possível enviar a notificação."
            );
        } finally {
            setSalvando(false);
        }
    }


    function classeStatus(status) {
        switch (status) {
            case "Pendente":
                return "status-pendente";

            case "Em andamento":
                return "status-andamento";

            case "Aguardando peças":
                return "status-pecas";

            case "Concluído":
                return "status-concluido";

            case "Cancelado":
                return "status-cancelado";

            default:
                return "";
        }
    }

    function classePrioridade(prioridade) {
        switch (prioridade) {
            case "Urgente":
                return "prioridade-urgente";

            case "Alta":
                return "prioridade-alta";

            case "Média":
                return "prioridade-media";

            case "Baixa":
                return "prioridade-baixa";

            default:
                return "";
        }
    }

    return (
        <div className="gerenciar-admin">

            {/* HEADER */}
            <Header
                userName={userName}
                userRole="Administrador"
                onLogout={onLogout}
            />

            {/* CONTEÚDO */}

            <main className="gerenciar-admin-main">

                <button
                    type="button"
                    className="gerenciar-voltar"
                    onClick={onVoltar}
                >
                    <ArrowLeft size={16} />
                    Voltar ao painel
                </button>

                <section className="gerenciar-titulo">

                    <h2>
                        Gerenciar Ocorrências
                    </h2>

                    <p>
                        Atribua equipes, atualize status
                        e notifique cidadãos.
                    </p>

                </section>

                {/* ESTATÍSTICAS */}

                <section className="gerenciar-stats">

                    <div className="gerenciar-stat stat-total">
                        <strong>
                            {estatisticas.total}
                        </strong>

                        <span>
                            Total
                        </span>
                    </div>

                    <div className="gerenciar-stat stat-pendente">
                        <strong>
                            {estatisticas.pendentes}
                        </strong>

                        <span>
                            Pendentes
                        </span>
                    </div>

                    <div className="gerenciar-stat stat-andamento">
                        <strong>
                            {estatisticas.andamento}
                        </strong>

                        <span>
                            Em andamento
                        </span>
                    </div>

                    <div className="gerenciar-stat stat-concluido">
                        <strong>
                            {estatisticas.concluidas}
                        </strong>

                        <span>
                            Concluídas
                        </span>
                    </div>

                </section>

                {/* FILTROS */}

                <section className="gerenciar-filtros">

                    <div className="gerenciar-busca">

                        <Search size={17} />

                        <input
                            type="text"
                            placeholder="Buscar por tipo, protocolo, cidadão ou endereço..."
                            value={busca}
                            onChange={(e) =>
                                setBusca(e.target.value)
                            }
                        />

                    </div>

                    <div className="gerenciar-selects">

                        <div className="gerenciar-select-icon">
                            <SlidersHorizontal size={16} />
                        </div>

                        <select
                            value={filtroStatus}
                            onChange={(e) =>
                                setFiltroStatus(
                                    e.target.value
                                )
                            }
                        >
                            <option value="Todos">
                                Todos os status
                            </option>

                            {statusOptions.map(
                                (status) => (
                                    <option
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </option>
                                )
                            )}
                        </select>

                        <select
                            value={filtroPrioridade}
                            onChange={(e) =>
                                setFiltroPrioridade(
                                    e.target.value
                                )
                            }
                        >
                            <option value="Todos">
                                Todas as prioridades
                            </option>

                            <option value="Urgente">
                                Urgente
                            </option>

                            <option value="Alta">
                                Alta
                            </option>

                            <option value="Média">
                                Média
                            </option>

                            <option value="Baixa">
                                Baixa
                            </option>
                        </select>

                    </div>

                </section>

                <p className="gerenciar-contador">
                    Exibindo{" "}
                    {ocorrenciasFiltradas.length} de{" "}
                    {ocorrencias.length} ocorrências
                </p>

                {carregando && (
                    <p role="status">
                        Carregando ocorrências...
                    </p>
                )}

                {!carregando && erroCarregamento && (
                    <div role="alert" className="gerenciar-vazio">
                        <AlertCircle size={40} />

                        <h3>Não foi possível carregar as ocorrências</h3>

                        <p>{erroCarregamento}</p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {/* LISTA */}

                <section className="gerenciar-lista">

                    {!carregando &&
                        !erroCarregamento &&
                        ocorrenciasFiltradas.length === 0 && (
                            <div className="gerenciar-vazio">

                                <AlertCircle
                                    size={40}
                                />

                                <h3>
                                    Nenhuma ocorrência
                                    encontrada
                                </h3>

                                <p>
                                    Tente alterar os filtros
                                    ou a busca.
                                </p>

                            </div>
                        )}

                    {ocorrenciasFiltradas.map(
                        (ocorrencia) => {

                            const aberta =
                                expandida ===
                                ocorrencia.id;

                            return (
                                <article
                                    key={ocorrencia.id}
                                    className={`gerenciar-card ${aberta
                                        ? "gerenciar-card-aberta"
                                        : ""
                                        }`}
                                >

                                    {/* RESUMO */}

                                    <div
                                        className="gerenciar-card-resumo"
                                        onClick={() =>
                                            setExpandida(
                                                aberta
                                                    ? null
                                                    : ocorrencia.id
                                            )
                                        }
                                    >

                                        <div
                                            className={`gerenciar-status-icon ${classeStatus(
                                                ocorrencia.status
                                            )}`}
                                        >
                                            {ocorrencia.status ===
                                                "Concluído" ? (
                                                <CheckCircle2
                                                    size={18}
                                                />
                                            ) : ocorrencia.status ===
                                                "Pendente" ? (
                                                <AlertCircle
                                                    size={18}
                                                />
                                            ) : (
                                                <Clock
                                                    size={18}
                                                />
                                            )}
                                        </div>

                                        <div className="gerenciar-card-info">

                                            <div className="gerenciar-card-titulo">

                                                <strong>
                                                    {ocorrencia.tipo}
                                                </strong>

                                                <span
                                                    className={`gerenciar-badge ${classeStatus(
                                                        ocorrencia.status
                                                    )}`}
                                                >
                                                    {ocorrencia.status}
                                                </span>

                                                <span
                                                    className={`gerenciar-badge ${classePrioridade(
                                                        ocorrencia.prioridade
                                                    )}`}
                                                >
                                                    {ocorrencia.prioridade}
                                                </span>

                                            </div>

                                            <div className="gerenciar-card-meta">

                                                <span>
                                                    {ocorrencia.protocolo}
                                                </span>

                                                <span>
                                                    {ocorrencia.cidadao}
                                                </span>

                                                <span>
                                                    {ocorrencia.data}
                                                </span>

                                            </div>

                                        </div>

                                        {/* AÇÕES DESKTOP */}

                                        <div
                                            className="gerenciar-acoes-desktop"
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        >

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    abrirModal(
                                                        ocorrencia,
                                                        "ver"
                                                    )
                                                }
                                            >
                                                <Eye size={14} />
                                                Ver
                                            </button>

                                            <button
                                                type="button"
                                                className="acao-blue"
                                                onClick={() =>
                                                    abrirModal(
                                                        ocorrencia,
                                                        "atribuir"
                                                    )
                                                }
                                            >
                                                <Users size={14} />
                                                Atribuir
                                            </button>

                                            <button
                                                type="button"
                                                className="acao-purple"
                                                onClick={() =>
                                                    abrirModal(
                                                        ocorrencia,
                                                        "status"
                                                    )
                                                }
                                            >
                                                <CheckCircle2
                                                    size={14}
                                                />
                                                Status
                                            </button>

                                            <button
                                                type="button"
                                                className="acao-green"
                                                onClick={() =>
                                                    abrirModal(
                                                        ocorrencia,
                                                        "notificar"
                                                    )
                                                }
                                            >
                                                <Bell size={14} />
                                                Notificar
                                            </button>

                                        </div>

                                        {aberta ? (
                                            <ChevronUp
                                                size={18}
                                            />
                                        ) : (
                                            <ChevronDown
                                                size={18}
                                            />
                                        )}

                                    </div>

                                    {/* DETALHES */}

                                    {aberta && (
                                        <div className="gerenciar-detalhes">

                                            <div className="gerenciar-detalhes-grid">

                                                <div>
                                                    <MapPin size={16} />

                                                    <span>
                                                        {ocorrencia.endereco}
                                                    </span>
                                                </div>

                                                <div>
                                                    <User size={16} />

                                                    <span>
                                                        {ocorrencia.cidadao}
                                                    </span>
                                                </div>

                                                <div>
                                                    <Tag size={16} />

                                                    <span>
                                                        Equipe:{" "}
                                                        <strong>
                                                            {ocorrencia.equipe ||
                                                                "Não atribuída"}
                                                        </strong>
                                                    </span>
                                                </div>

                                                <div>
                                                    <Calendar size={16} />

                                                    <span>
                                                        Registrada em{" "}
                                                        {ocorrencia.data}
                                                    </span>
                                                </div>

                                            </div>

                                            <p className="gerenciar-descricao">
                                                {ocorrencia.descricao}
                                            </p>

                                            {/* AÇÕES MOBILE */}

                                            <div className="gerenciar-acoes-mobile">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        abrirModal(
                                                            ocorrencia,
                                                            "ver"
                                                        )
                                                    }
                                                >
                                                    <Eye size={14} />
                                                    Ver
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        abrirModal(
                                                            ocorrencia,
                                                            "atribuir"
                                                        )
                                                    }
                                                >
                                                    <Users size={14} />
                                                    Atribuir
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        abrirModal(
                                                            ocorrencia,
                                                            "status"
                                                        )
                                                    }
                                                >
                                                    <CheckCircle2
                                                        size={14}
                                                    />
                                                    Status
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        abrirModal(
                                                            ocorrencia,
                                                            "notificar"
                                                        )
                                                    }
                                                >
                                                    <Bell size={14} />
                                                    Notificar
                                                </button>

                                            </div>

                                        </div>
                                    )}

                                </article>
                            );
                        }
                    )}

                </section>

            </main>

            {/* MODAL */}

            {modal && selecionada && (

                <div className="gerenciar-modal-overlay">

                    <div className="gerenciar-modal">

                        <div className="gerenciar-modal-header">

                            <h3>

                                {modal === "ver" &&
                                    `Detalhes — ${selecionada.protocolo}`}

                                {modal === "atribuir" &&
                                    "Atribuir Equipe"}

                                {modal === "status" &&
                                    "Atualizar Status"}

                                {modal === "notificar" &&
                                    "Notificar Cidadão"}

                            </h3>

                            <button
                                type="button"
                                onClick={fecharModal}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="gerenciar-modal-content">

                            {/* VISUALIZAR */}

                            {modal === "ver" && (

                                <>

                                    <div className="modal-detalhes-grid">

                                        <div>
                                            <label>
                                                Tipo
                                            </label>

                                            <p>
                                                {selecionada.tipo}
                                            </p>
                                        </div>

                                        <div>
                                            <label>
                                                Data
                                            </label>

                                            <p>
                                                {selecionada.data}
                                            </p>
                                        </div>

                                        <div>
                                            <label>
                                                Status
                                            </label>

                                            <span
                                                className={`gerenciar-badge ${classeStatus(
                                                    selecionada.status
                                                )}`}
                                            >
                                                {selecionada.status}
                                            </span>
                                        </div>

                                        <div>
                                            <label>
                                                Prioridade
                                            </label>

                                            <span
                                                className={`gerenciar-badge ${classePrioridade(
                                                    selecionada.prioridade
                                                )}`}
                                            >
                                                {selecionada.prioridade}
                                            </span>
                                        </div>

                                        <div className="modal-campo-largo">
                                            <label>
                                                Endereço
                                            </label>

                                            <p>
                                                {selecionada.endereco}
                                            </p>
                                        </div>

                                        <div>
                                            <label>
                                                Cidadão
                                            </label>

                                            <p>
                                                {selecionada.cidadao}
                                            </p>
                                        </div>

                                        <div>
                                            <label>
                                                Equipe
                                            </label>

                                            <p>
                                                {selecionada.equipe ||
                                                    "Não atribuída"}
                                            </p>
                                        </div>

                                        <div className="modal-campo-largo">
                                            <label>
                                                Descrição
                                            </label>

                                            <p>
                                                {selecionada.descricao}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="modal-botoes">

                                        <button
                                            type="button"
                                            className="modal-botao-secundario"
                                            onClick={fecharModal}
                                        >
                                            Fechar
                                        </button>

                                        <button
                                            type="button"
                                            className="modal-botao-principal"
                                            onClick={() =>
                                                setModal(
                                                    "atribuir"
                                                )
                                            }
                                        >
                                            Atribuir equipe
                                        </button>

                                    </div>

                                </>

                            )}

                            {/* ATRIBUIR */}

                            {modal === "atribuir" && (

                                <>

                                    <div className="modal-resumo">
                                        {selecionada.tipo} —{" "}
                                        {selecionada.endereco}
                                    </div>

                                    <label>
                                        Equipe responsável
                                    </label>

                                    <select
                                        value={novaEquipe}
                                        onChange={(e) =>
                                            setNovaEquipe(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Selecione uma equipe
                                        </option>

                                        {equipes.map(
                                            (equipe) => (
                                                <option
                                                    key={equipe}
                                                    value={equipe}
                                                >
                                                    {equipe}
                                                </option>
                                            )
                                        )}

                                    </select>

                                    <div className="modal-botoes">

                                        <button
                                            type="button"
                                            className="modal-botao-secundario"
                                            onClick={fecharModal}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="button"
                                            className="modal-botao-principal"
                                            disabled={
                                                !novaEquipe ||
                                                salvando
                                            }
                                            onClick={
                                                salvarAtribuicao
                                            }
                                        >
                                            {salvando ? (
                                                <Loader2
                                                    size={17}
                                                    className="girando"
                                                />
                                            ) : (
                                                "Confirmar"
                                            )}
                                        </button>

                                    </div>

                                </>

                            )}

                            {/* STATUS */}

                            {modal === "status" && (

                                <>

                                    <div className="modal-resumo">
                                        {selecionada.tipo} —{" "}
                                        {selecionada.protocolo}
                                    </div>

                                    <p className="modal-status-atual">
                                        Status atual:{" "}

                                        <span
                                            className={`gerenciar-badge ${classeStatus(
                                                selecionada.status
                                            )}`}
                                        >
                                            {selecionada.status}
                                        </span>
                                    </p>

                                    <label>
                                        Novo status
                                    </label>

                                    <select
                                        value={novoStatus}
                                        onChange={(e) =>
                                            setNovoStatus(
                                                e.target.value
                                            )
                                        }
                                    >

                                        {statusOptions.map(
                                            (status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>
                                            )
                                        )}

                                    </select>

                                    <div className="modal-botoes">

                                        <button
                                            type="button"
                                            className="modal-botao-secundario"
                                            onClick={fecharModal}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="button"
                                            className="modal-botao-principal"
                                            disabled={salvando}
                                            onClick={salvarStatus}
                                        >
                                            {salvando ? (
                                                <Loader2
                                                    size={17}
                                                    className="girando"
                                                />
                                            ) : (
                                                "Salvar"
                                            )}
                                        </button>

                                    </div>

                                </>

                            )}

                            {/* NOTIFICAR */}

                            {modal === "notificar" && (

                                <>

                                    <div className="modal-resumo">

                                        <span>
                                            Destinatário:
                                        </span>{" "}

                                        <strong>
                                            {selecionada.cidadao}
                                        </strong>

                                        <br />

                                        <small>
                                            {selecionada.tipo}
                                        </small>

                                    </div>

                                    <label>
                                        Mensagem
                                    </label>

                                    <textarea
                                        rows="5"
                                        placeholder="Digite a mensagem para o cidadão..."
                                        value={mensagem}
                                        onChange={(e) =>
                                            setMensagem(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <p className="modal-ajuda">
                                        A mensagem será registrada
                                        no sistema.
                                    </p>

                                    <div className="modal-botoes">

                                        <button
                                            type="button"
                                            className="modal-botao-secundario"
                                            onClick={fecharModal}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="button"
                                            className="modal-botao-notificar"
                                            disabled={
                                                !mensagem.trim() ||
                                                salvando
                                            }
                                            onClick={
                                                enviarNotificacao
                                            }
                                        >
                                            {salvando ? (
                                                <Loader2
                                                    size={17}
                                                    className="girando"
                                                />
                                            ) : (
                                                <>
                                                    <Bell
                                                        size={16}
                                                    />
                                                    Enviar
                                                </>
                                            )}
                                        </button>

                                    </div>

                                </>

                            )}

                        </div>

                    </div>

                </div>

            )}

            {/* TOAST */}

            {toast && (

                <div className="gerenciar-toast">

                    <CheckCircle2 size={17} />

                    {toast}

                </div>

            )}

        </div>
    );
}

export default GerenciarOcorrenciasAdmin;