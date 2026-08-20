import { useState } from "react";

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
}) {
    const [ocorrencias, setOcorrencias] = useState([
        {
            id: "047",
            protocolo: "SCM-48271",
            tipo: "Buraco na via",
            endereco: "Rua das Flores, 142",
            cidadao: "Carlos Santos",
            data: "24/01/2026",
            status: "Pendente",
            prioridade: "Alta",
            equipe: "",
            descricao:
                "Buraco de aproximadamente 1 metro de diâmetro na pista principal, causando desvios no trânsito local.",
        },
        {
            id: "046",
            protocolo: "SCM-31904",
            tipo: "Semáforo quebrado",
            endereco: "Av. Getúlio Vargas c/ Rua Central",
            cidadao: "Ana Costa",
            data: "24/01/2026",
            status: "Pendente",
            prioridade: "Urgente",
            equipe: "",
            descricao:
                "Semáforo da esquina não está funcionando, causando congestionamento e risco de acidentes.",
        },
        {
            id: "045",
            protocolo: "SCM-20311",
            tipo: "Iluminação pública",
            endereco: "Rua do Comércio, 789",
            cidadao: "Pedro Lima",
            data: "23/01/2026",
            status: "Em andamento",
            prioridade: "Média",
            equipe: "Equipe Elétrica A",
            descricao:
                "Diversos postes de luz apagados em trecho de aproximadamente 200 metros.",
        },
        {
            id: "044",
            protocolo: "SCM-19204",
            tipo: "Calçada danificada",
            endereco: "Rua das Palmeiras, 321",
            cidadao: "Julia Sousa",
            data: "23/01/2026",
            status: "Em andamento",
            prioridade: "Baixa",
            equipe: "Equipe Pavimentação B",
            descricao:
                "Calçada com buracos e pedras soltas próximo à escola municipal.",
        },
        {
            id: "043",
            protocolo: "SCM-17882",
            tipo: "Esgoto entupido",
            endereco: "Travessa São João, 555",
            cidadao: "Roberto Silva",
            data: "22/01/2026",
            status: "Concluído",
            prioridade: "Alta",
            equipe: "Equipe Saneamento A",
            descricao:
                "Esgoto transbordando na rua. Área higienizada e desentupida.",
        },
        {
            id: "042",
            protocolo: "SCM-15600",
            tipo: "Lixo acumulado",
            endereco: "Praça da Independência",
            cidadao: "Mariana Reis",
            data: "21/01/2026",
            status: "Concluído",
            prioridade: "Média",
            equipe: "Equipe de Limpeza",
            descricao:
                "Entulho acumulado na praça, recolhido pela equipe de limpeza.",
        },
        {
            id: "041",
            protocolo: "SCM-14090",
            tipo: "Árvore caída",
            endereco: "Av. Principal, 88",
            cidadao: "Lucas Faria",
            data: "20/01/2026",
            status: "Aguardando peças",
            prioridade: "Alta",
            equipe: "Equipe Pavimentação A",
            descricao:
                "Árvore tombada após chuva, aguardando equipamento para remoção.",
        },
    ]);

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

    function salvarAtribuicao() {
        if (!selecionada || !novaEquipe) {
            return;
        }

        setSalvando(true);

        setTimeout(() => {
            setOcorrencias((lista) =>
                lista.map((ocorrencia) => {
                    if (
                        ocorrencia.id !==
                        selecionada.id
                    ) {
                        return ocorrencia;
                    }

                    return {
                        ...ocorrencia,
                        equipe: novaEquipe,
                        status:
                            ocorrencia.status ===
                            "Pendente"
                                ? "Em andamento"
                                : ocorrencia.status,
                    };
                })
            );

            setSalvando(false);
            setModal(null);

            mostrarToast(
                `Equipe "${novaEquipe}" atribuída à ocorrência ${selecionada.protocolo}.`
            );
        }, 900);
    }

    function salvarStatus() {
        if (!selecionada || !novoStatus) {
            return;
        }

        setSalvando(true);

        setTimeout(() => {
            setOcorrencias((lista) =>
                lista.map((ocorrencia) => {
                    if (
                        ocorrencia.id !==
                        selecionada.id
                    ) {
                        return ocorrencia;
                    }

                    return {
                        ...ocorrencia,
                        status: novoStatus,
                    };
                })
            );

            setSalvando(false);
            setModal(null);

            mostrarToast(
                `Status da ocorrência ${selecionada.protocolo} atualizado.`
            );
        }, 900);
    }

    function enviarNotificacao() {
        if (
            !selecionada ||
            !mensagem.trim()
        ) {
            return;
        }

        setSalvando(true);

        setTimeout(() => {
            setSalvando(false);
            setModal(null);

            mostrarToast(
                `Notificação registrada para ${selecionada.cidadao}.`
            );
        }, 900);
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

            <header className="gerenciar-admin-header">

                <div className="gerenciar-admin-header-content">

                    <div className="gerenciar-admin-brand">

                        <div className="gerenciar-admin-logo">
                            <Building2 size={23} />
                        </div>

                        <div>
                            <h1>
                                SCM Infraestrutura
                            </h1>

                            <p>
                                Prefeitura Municipal —
                                Painel Administrativo
                            </p>
                        </div>

                    </div>

                    <div className="gerenciar-admin-user">

                        <div>
                            <strong>
                                {userName}
                            </strong>

                            <span>
                                Administrador
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={onLogout}
                        >
                            <LogOut size={16} />
                            Sair
                        </button>

                    </div>

                </div>

            </header>

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

                {/* LISTA */}

                <section className="gerenciar-lista">

                    {ocorrenciasFiltradas.length ===
                        0 && (
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
                                    className={`gerenciar-card ${
                                        aberta
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