import { useState } from "react";

import {
    Building2,
    LogOut,
    ArrowLeft,
    MapPin,
    Filter,
    X,
    Clock,
    CheckCircle2,
    Flame,
    AlertCircle,
    Users,
    Bell,
    Loader2,
} from "lucide-react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "../styles/mapaAdmin.css";


// =====================================================
// CENTRO DE SANTA CRUZ DOS MILAGRES
// =====================================================

const CENTRO = [
    -5.804537713240668,
    -41.95461325125385,
];


// =====================================================
// OCORRÊNCIAS
// =====================================================

const OCORRENCIAS_INICIAIS = [
    {
        id: "047",
        protocolo: "SCM-48271",
        tipo: "Buraco na via",
        endereco: "Rua das Flores, 142",
        cidadao: "Carlos Santos",
        status: "Pendente",
        prioridade: "Alta",
        equipe: "",
        data: "24/01/2026",
        descricao:
            "Buraco de aproximadamente 1 metro de diâmetro na pista principal, causando desvios no trânsito local.",
        posicao: [-5.8039, -41.9551],
    },

    {
        id: "046",
        protocolo: "SCM-31904",
        tipo: "Semáforo quebrado",
        endereco: "Av. Getúlio Vargas c/ Rua Central",
        cidadao: "Ana Costa",
        status: "Urgente",
        prioridade: "Urgente",
        equipe: "",
        data: "24/01/2026",
        descricao:
            "Semáforo da esquina não está funcionando, causando congestionamento e risco de acidentes.",
        posicao: [-5.8052, -41.9539],
    },

    {
        id: "045",
        protocolo: "SCM-20311",
        tipo: "Iluminação pública",
        endereco: "Rua do Comércio, 789",
        cidadao: "Pedro Lima",
        status: "Em andamento",
        prioridade: "Média",
        equipe: "Equipe Elétrica A",
        data: "23/01/2026",
        descricao:
            "Diversos postes de luz apagados em trecho de aproximadamente 200 metros.",
        posicao: [-5.8057, -41.9548],
    },

    {
        id: "044",
        protocolo: "SCM-19204",
        tipo: "Calçada danificada",
        endereco: "Rua das Palmeiras, 321",
        cidadao: "Julia Sousa",
        status: "Em andamento",
        prioridade: "Baixa",
        equipe: "Equipe Pavimentação B",
        data: "23/01/2026",
        descricao:
            "Calçada com buracos e pedras soltas próximo à escola municipal.",
        posicao: [-5.8046, -41.9540],
    },

    {
        id: "043",
        protocolo: "SCM-17882",
        tipo: "Esgoto entupido",
        endereco: "Travessa São João, 555",
        cidadao: "Roberto Silva",
        status: "Concluído",
        prioridade: "Alta",
        equipe: "Equipe Saneamento A",
        data: "22/01/2026",
        descricao:
            "Esgoto transbordando na rua. Área higienizada e desentupida.",
        posicao: [-5.8035, -41.9544],
    },

    {
        id: "041",
        protocolo: "SCM-14090",
        tipo: "Árvore caída",
        endereco: "Av. Principal, 88",
        cidadao: "Lucas Faria",
        status: "Pendente",
        prioridade: "Alta",
        equipe: "",
        data: "20/01/2026",
        descricao:
            "Árvore tombada após chuva, aguardando equipamento para remoção.",
        posicao: [-5.8060, -41.9554],
    },
];


// =====================================================
// EQUIPES
// =====================================================

const EQUIPES = [
    "Equipe Pavimentação A",
    "Equipe Pavimentação B",
    "Equipe Elétrica A",
    "Equipe Elétrica B",
    "Equipe Saneamento A",
    "Equipe Saneamento B",
    "Equipe de Limpeza",
    "Equipe de Sinalização",
];


// =====================================================
// STATUS
// =====================================================

const STATUS_OPTIONS = [
    "Pendente",
    "Em andamento",
    "Concluído",
    "Cancelado",
];


// =====================================================
// CONFIGURAÇÃO DOS STATUS
// =====================================================

const STATUS_CONFIG = {
    Urgente: {
        cor: "#ef4444",
        classe: "status-urgente",
        Icone: Flame,
    },

    Pendente: {
        cor: "#f97316",
        classe: "status-pendente",
        Icone: AlertCircle,
    },

    "Em andamento": {
        cor: "#3b82f6",
        classe: "status-andamento",
        Icone: Clock,
    },

    Concluído: {
        cor: "#22c55e",
        classe: "status-concluido",
        Icone: CheckCircle2,
    },

    Cancelado: {
        cor: "#64748b",
        classe: "status-cancelado",
        Icone: X,
    },
};


// =====================================================
// FILTROS
// =====================================================

const FILTROS = [
    "Todos",
    "Urgente",
    "Pendente",
    "Em andamento",
    "Concluído",
];


// =====================================================
// ÍCONE DO MAPA
// =====================================================

function criarIcone(cor, ativo = false) {

    return L.divIcon({

        className: "marcador-leaflet",

        html: `
            <div
                class="marcador-principal ${ativo ? "marcador-ativo" : ""}"
                style="--cor-marcador: ${cor};"
            >

                <div class="marcador-circulo">
                    !
                </div>

                <div class="marcador-ponta"></div>

            </div>
        `,

        iconSize: [44, 52],

        iconAnchor: [22, 52],

        popupAnchor: [0, -52],
    });
}


// =====================================================
// COMPONENTE
// =====================================================

function MapaAdmin({
    onVoltar,
    onLogout,
    userName = "Administrador",
}) {

    const [ocorrencias, setOcorrencias] = useState(
        OCORRENCIAS_INICIAIS
    );

    const [filtro, setFiltro] = useState("Todos");

    const [selecionada, setSelecionada] = useState(null);

    const [aba, setAba] = useState("detalhes");

    const [novaEquipe, setNovaEquipe] = useState("");

    const [novoStatus, setNovoStatus] = useState("");

    const [mensagem, setMensagem] = useState("");

    const [salvando, setSalvando] = useState(false);

    const [toast, setToast] = useState("");


    // ===================================================
    // FILTRO
    // ===================================================

    const visiveis = ocorrencias.filter(
        (ocorrencia) => {

            if (filtro === "Todos") {
                return true;
            }

            return ocorrencia.status === filtro;
        }
    );


    // ===================================================
    // SELECIONAR
    // ===================================================

    function selecionarOcorrencia(ocorrencia) {

        setSelecionada(ocorrencia);

        setAba("detalhes");

        setNovaEquipe(ocorrencia.equipe);

        setNovoStatus(ocorrencia.status);

        setMensagem("");
    }


    // ===================================================
    // FECHAR
    // ===================================================

    function fecharDetalhes() {

        setSelecionada(null);
    }


    // ===================================================
    // TOAST
    // ===================================================

    function mostrarToast(texto) {

        setToast(texto);

        setTimeout(() => {

            setToast("");

        }, 3500);
    }


    // ===================================================
    // SALVAR EQUIPE
    // ===================================================

    function salvarEquipe() {

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

            setSelecionada((anterior) =>
                anterior
                    ? {
                          ...anterior,
                          equipe: novaEquipe,
                          status:
                              anterior.status ===
                              "Pendente"
                                  ? "Em andamento"
                                  : anterior.status,
                      }
                    : anterior
            );

            setSalvando(false);

            setAba("detalhes");

            mostrarToast(
                `Equipe "${novaEquipe}" atribuída à ocorrência ${selecionada.protocolo}.`
            );

        }, 800);
    }


    // ===================================================
    // SALVAR STATUS
    // ===================================================

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

            setSelecionada((anterior) =>
                anterior
                    ? {
                          ...anterior,
                          status: novoStatus,
                      }
                    : anterior
            );

            setSalvando(false);

            setAba("detalhes");

            mostrarToast(
                `Status da ocorrência ${selecionada.protocolo} atualizado.`
            );

        }, 800);
    }


    // ===================================================
    // NOTIFICAÇÃO
    // ===================================================

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

            setAba("detalhes");

            mostrarToast(
                `Notificação registrada para ${selecionada.cidadao}.`
            );

            setMensagem("");

        }, 800);
    }


    return (

        <div className="mapa-admin-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="mapa-admin-header">

                <div className="mapa-admin-header-esquerda">

                    <div className="mapa-admin-logo">

                        <Building2 size={24} />

                    </div>

                    <div>

                        <h1>
                            Sistema de Infraestrutura
                        </h1>

                        <p>
                            Prefeitura Municipal de
                            Santa Cruz dos Milagres
                        </p>

                    </div>

                </div>


                <div className="mapa-admin-header-direita">

                    <div className="mapa-admin-usuario">

                        <strong>
                            {userName}
                        </strong>

                        <span>
                            Administrador
                        </span>

                    </div>


                    <button
                        className="mapa-admin-sair"
                        onClick={onLogout}
                    >

                        <LogOut size={17} />

                        Sair

                    </button>

                </div>

            </header>


            {/* =================================================
                FILTROS
            ================================================= */}

            <div className="mapa-admin-filtros">

                <button
                    className="mapa-admin-voltar"
                    onClick={onVoltar}
                >

                    <ArrowLeft size={17} />

                    Voltar ao painel

                </button>


                <span className="mapa-admin-separador">
                    |
                </span>


                <div className="mapa-admin-filtro-lista">

                    <Filter size={17} />


                    {FILTROS.map((item) => {

                        const quantidade =
                            item === "Todos"
                                ? ocorrencias.length
                                : ocorrencias.filter(
                                      (ocorrencia) =>
                                          ocorrencia.status ===
                                          item
                                  ).length;


                        return (

                            <button
                                key={item}
                                className={
                                    filtro === item
                                        ? "mapa-admin-filtro ativo"
                                        : "mapa-admin-filtro"
                                }
                                onClick={() => {

                                    setFiltro(item);

                                    setSelecionada(null);

                                }}
                            >

                                {item}

                                {item !== "Todos" && (
                                    <span>
                                        ({quantidade})
                                    </span>
                                )}

                            </button>

                        );

                    })}

                </div>

            </div>


            {/* =================================================
                CONTEÚDO
            ================================================= */}

            <main className="mapa-admin-conteudo">


                {/* =================================================
                    MAPA REAL
                ================================================= */}

                <section className="mapa-admin-area">

                    <MapContainer
                        center={CENTRO}
                        zoom={16}
                        scrollWheelZoom={true}
                        className="mapa-admin-leaflet"
                    >

                        <TileLayer
                            attribution="&copy; OpenStreetMap contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />


                        {visiveis.map(
                            (ocorrencia) => {

                                const config =
                                    STATUS_CONFIG[
                                        ocorrencia.status
                                    ] ||
                                    STATUS_CONFIG.Pendente;

                                const ativo =
                                    selecionada?.id ===
                                    ocorrencia.id;


                                return (

                                    <Marker
                                        key={
                                            ocorrencia.id
                                        }
                                        position={
                                            ocorrencia.posicao
                                        }
                                        icon={criarIcone(
                                            config.cor,
                                            ativo
                                        )}
                                        eventHandlers={{
                                            click: () =>
                                                selecionarOcorrencia(
                                                    ocorrencia
                                                ),
                                        }}
                                    >

                                        <Popup>

                                            <div className="popup-admin">

                                                <div className="popup-admin-topo">

                                                    <div
                                                        className="popup-admin-icone"
                                                        style={{
                                                            backgroundColor:
                                                                `${config.cor}20`,
                                                            color:
                                                                config.cor,
                                                        }}
                                                    >
                                                        <MapPin
                                                            size={
                                                                20
                                                            }
                                                        />
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            #
                                                            {
                                                                ocorrencia.id
                                                            }{" "}
                                                            —{" "}
                                                            {
                                                                ocorrencia.tipo
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                ocorrencia.endereco
                                                            }
                                                        </span>

                                                    </div>

                                                </div>


                                                <p>
                                                    {
                                                        ocorrencia.descricao
                                                    }
                                                </p>


                                                <div className="popup-admin-rodape">

                                                    <span
                                                        className={`badge-admin ${config.classe}`}
                                                    >
                                                        {
                                                            ocorrencia.status
                                                        }
                                                    </span>

                                                    <span>
                                                        {
                                                            ocorrencia.data
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                        </Popup>

                                    </Marker>

                                );
                            }
                        )}

                    </MapContainer>


                    {/* CONTADOR */}

                    <div className="mapa-admin-contador">

                        <span>
                            Exibindo
                        </span>

                        <strong>
                            {visiveis.length}
                        </strong>

                        <small>
                            ocorrência
                            {visiveis.length !== 1
                                ? "s"
                                : ""}
                        </small>

                    </div>


                    {/* LEGENDA */}

                    <div className="mapa-admin-legenda">

                        <strong>
                            Legenda
                        </strong>


                        {[
                            "Urgente",
                            "Pendente",
                            "Em andamento",
                            "Concluído",
                        ].map((status) => {

                            const config =
                                STATUS_CONFIG[
                                    status
                                ];


                            return (

                                <div
                                    className="mapa-admin-item-legenda"
                                    key={status}
                                >

                                    <span
                                        style={{
                                            backgroundColor:
                                                config.cor,
                                        }}
                                    />

                                    {status}

                                </div>

                            );

                        })}

                    </div>

                </section>


                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="mapa-admin-sidebar">


                    {!selecionada ? (

                        <>

                            <div className="mapa-admin-sidebar-header">

                                <h2>
                                    {filtro === "Todos"
                                        ? "Todas as ocorrências"
                                        : filtro}
                                </h2>

                                <span>
                                    {visiveis.length} registro
                                    {visiveis.length !==
                                    1
                                        ? "s"
                                        : ""}
                                </span>

                            </div>


                            <div className="mapa-admin-lista">

                                {visiveis.map(
                                    (ocorrencia) => {

                                        const config =
                                            STATUS_CONFIG[
                                                ocorrencia.status
                                            ] ||
                                            STATUS_CONFIG.Pendente;

                                        const Icone =
                                            config.Icone;


                                        return (

                                            <button
                                                key={
                                                    ocorrencia.id
                                                }
                                                className="mapa-admin-item"
                                                onClick={() =>
                                                    selecionarOcorrencia(
                                                        ocorrencia
                                                    )
                                                }
                                            >

                                                <div
                                                    className="mapa-admin-item-icone"
                                                    style={{
                                                        backgroundColor:
                                                            `${config.cor}15`,
                                                        color:
                                                            config.cor,
                                                    }}
                                                >

                                                    <Icone
                                                        size={
                                                            17
                                                        }
                                                    />

                                                </div>


                                                <div className="mapa-admin-item-info">

                                                    <strong>
                                                        #
                                                        {
                                                            ocorrencia.id
                                                        }{" "}
                                                        —{" "}
                                                        {
                                                            ocorrencia.tipo
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            ocorrencia.endereco
                                                        }
                                                    </span>

                                                    <div>

                                                        <span
                                                            className={`badge-admin ${config.classe}`}
                                                        >
                                                            {
                                                                ocorrencia.status
                                                            }
                                                        </span>

                                                        <small>
                                                            {
                                                                ocorrencia.data
                                                            }
                                                        </small>

                                                    </div>

                                                </div>

                                            </button>

                                        );
                                    }
                                )}

                            </div>

                        </>

                    ) : (

                        <div className="mapa-admin-detalhes">


                            {/* CABEÇALHO */}

                            <div className="mapa-admin-detalhes-header">

                                <div>

                                    <span>
                                        {
                                            selecionada.protocolo
                                        }
                                    </span>

                                    <h2>
                                        {
                                            selecionada.tipo
                                        }
                                    </h2>

                                </div>


                                <button
                                    onClick={
                                        fecharDetalhes
                                    }
                                >

                                    <X size={19} />

                                </button>

                            </div>


                            {/* ABAS */}

                            <div className="mapa-admin-abas">

                                <button
                                    className={
                                        aba ===
                                        "detalhes"
                                            ? "ativa"
                                            : ""
                                    }
                                    onClick={() =>
                                        setAba(
                                            "detalhes"
                                        )
                                    }
                                >
                                    Detalhes
                                </button>

                                <button
                                    className={
                                        aba ===
                                        "equipe"
                                            ? "ativa"
                                            : ""
                                    }
                                    onClick={() =>
                                        setAba(
                                            "equipe"
                                        )
                                    }
                                >
                                    Equipe
                                </button>

                                <button
                                    className={
                                        aba ===
                                        "status"
                                            ? "ativa"
                                            : ""
                                    }
                                    onClick={() =>
                                        setAba(
                                            "status"
                                        )
                                    }
                                >
                                    Status
                                </button>

                                <button
                                    className={
                                        aba ===
                                        "notificar"
                                            ? "ativa"
                                            : ""
                                    }
                                    onClick={() =>
                                        setAba(
                                            "notificar"
                                        )
                                    }
                                >
                                    Notificar
                                </button>

                            </div>


                            {/* CONTEÚDO */}

                            <div className="mapa-admin-detalhes-corpo">


                                {/* DETALHES */}

                                {aba === "detalhes" && (

                                    <>

                                        <span
                                            className={`badge-admin grande ${
                                                STATUS_CONFIG[
                                                    selecionada
                                                        .status
                                                ]?.classe ||
                                                ""
                                            }`}
                                        >
                                            {
                                                selecionada.status
                                            }
                                        </span>


                                        <div className="campos-admin">

                                            <div>
                                                <label>
                                                    Endereço
                                                </label>

                                                <p>
                                                    {
                                                        selecionada.endereco
                                                    }
                                                </p>
                                            </div>


                                            <div>
                                                <label>
                                                    Cidadão
                                                </label>

                                                <p>
                                                    {
                                                        selecionada.cidadao
                                                    }
                                                </p>
                                            </div>


                                            <div>
                                                <label>
                                                    Prioridade
                                                </label>

                                                <p>
                                                    {
                                                        selecionada.prioridade
                                                    }
                                                </p>
                                            </div>


                                            <div>
                                                <label>
                                                    Equipe
                                                </label>

                                                <p>
                                                    {
                                                        selecionada.equipe ||
                                                        "Não atribuída"
                                                    }
                                                </p>
                                            </div>


                                            <div>
                                                <label>
                                                    Data
                                                </label>

                                                <p>
                                                    {
                                                        selecionada.data
                                                    }
                                                </p>
                                            </div>


                                            <div>
                                                <label>
                                                    Descrição
                                                </label>

                                                <p>
                                                    {
                                                        selecionada.descricao
                                                    }
                                                </p>
                                            </div>

                                        </div>


                                        <div className="acoes-admin">

                                            <button
                                                onClick={() =>
                                                    setAba(
                                                        "equipe"
                                                    )
                                                }
                                            >
                                                <Users
                                                    size={
                                                        15
                                                    }
                                                />
                                                Equipe
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setAba(
                                                        "status"
                                                    )
                                                }
                                            >
                                                <CheckCircle2
                                                    size={
                                                        15
                                                    }
                                                />
                                                Status
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setAba(
                                                        "notificar"
                                                    )
                                                }
                                            >
                                                <Bell
                                                    size={
                                                        15
                                                    }
                                                />
                                                Notificar
                                            </button>

                                        </div>

                                    </>

                                )}


                                {/* EQUIPE */}

                                {aba === "equipe" && (

                                    <div className="form-admin">

                                        <p>
                                            Equipe atual:
                                            <strong>
                                                {" "}
                                                {selecionada.equipe ||
                                                    "Nenhuma"}
                                            </strong>
                                        </p>

                                        <label>
                                            Nova equipe
                                        </label>

                                        <select
                                            value={
                                                novaEquipe
                                            }
                                            onChange={(e) =>
                                                setNovaEquipe(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        >

                                            <option value="">
                                                Selecione uma equipe
                                            </option>

                                            {EQUIPES.map(
                                                (
                                                    equipe
                                                ) => (

                                                    <option
                                                        key={
                                                            equipe
                                                        }
                                                        value={
                                                            equipe
                                                        }
                                                    >
                                                        {
                                                            equipe
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>


                                        <button
                                            className="botao-admin-principal"
                                            disabled={
                                                !novaEquipe ||
                                                salvando
                                            }
                                            onClick={
                                                salvarEquipe
                                            }
                                        >

                                            {salvando ? (
                                                <Loader2
                                                    size={
                                                        17
                                                    }
                                                    className="girando"
                                                />
                                            ) : (
                                                <>
                                                    <Users
                                                        size={
                                                            16
                                                        }
                                                    />
                                                    Atribuir equipe
                                                </>
                                            )}

                                        </button>

                                    </div>

                                )}


                                {/* STATUS */}

                                {aba === "status" && (

                                    <div className="form-admin">

                                        <p>
                                            Status atual:
                                            <strong>
                                                {" "}
                                                {
                                                    selecionada.status
                                                }
                                            </strong>
                                        </p>

                                        <label>
                                            Novo status
                                        </label>

                                        <select
                                            value={
                                                novoStatus
                                            }
                                            onChange={(e) =>
                                                setNovoStatus(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        >

                                            {STATUS_OPTIONS.map(
                                                (
                                                    status
                                                ) => (

                                                    <option
                                                        key={
                                                            status
                                                        }
                                                        value={
                                                            status
                                                        }
                                                    >
                                                        {
                                                            status
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>


                                        <button
                                            className="botao-admin-principal"
                                            disabled={
                                                !novoStatus ||
                                                salvando
                                            }
                                            onClick={
                                                salvarStatus
                                            }
                                        >

                                            {salvando ? (
                                                <Loader2
                                                    size={
                                                        17
                                                    }
                                                    className="girando"
                                                />
                                            ) : (
                                                <>
                                                    <CheckCircle2
                                                        size={
                                                            16
                                                        }
                                                    />
                                                    Salvar status
                                                </>
                                            )}

                                        </button>

                                    </div>

                                )}


                                {/* NOTIFICAR */}

                                {aba === "notificar" && (

                                    <div className="form-admin">

                                        <p>
                                            Para:
                                            <strong>
                                                {" "}
                                                {
                                                    selecionada.cidadao
                                                }
                                            </strong>
                                        </p>

                                        <label>
                                            Mensagem
                                        </label>

                                        <textarea
                                            rows="6"
                                            placeholder="Digite a mensagem para o cidadão..."
                                            value={
                                                mensagem
                                            }
                                            onChange={(e) =>
                                                setMensagem(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        />


                                        <button
                                            className="botao-admin-notificar"
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
                                                    size={
                                                        17
                                                    }
                                                    className="girando"
                                                />
                                            ) : (
                                                <>
                                                    <Bell
                                                        size={
                                                            16
                                                        }
                                                    />
                                                    Enviar notificação
                                                </>
                                            )}

                                        </button>

                                    </div>

                                )}

                            </div>

                        </div>

                    )}

                </aside>

            </main>


            {/* TOAST */}

            {toast && (

                <div className="mapa-admin-toast">

                    <CheckCircle2 size={17} />

                    {toast}

                </div>

            )}

        </div>
    );
}


export default MapaAdmin;