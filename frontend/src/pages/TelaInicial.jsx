import { useEffect, useState } from "react";

import {
    MapPin,
    Eye,
    AlertCircle,
    Plus,
    List,
} from "lucide-react";

import { apiRequest } from "../services/api";

import "../styles/TelaInicial.css";

function TelaInicial({
    token,
    usuario,
    onLogout,
    onRegistrarOcorrencia,
    onVisualizarMapa,
    onAcompanharOcorrencias,
}) {
    const userName = usuario?.nome || "Cidadão";
    const [recentOccurrences, setRecentOccurrences] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarOcorrencias() {
            if (!token) {
                setErro("Faça login para consultar suas ocorrências.");
                setCarregando(false);
                return;
            }

            try {
                setCarregando(true);
                setErro("");

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

                setRecentOccurrences(dados.slice(0, 3));
            } catch (erro) {
                console.error(
                    "Erro ao carregar ocorrências:",
                    erro
                );

                setErro(
                    erro.message ||
                    "Não foi possível carregar as ocorrências."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarOcorrencias();
    }, [token]);

    const getStatusClass = (status) => {
        switch ((status || "").toLowerCase()) {
            case "resolvida":
            case "resolvido":
            case "concluída":
            case "concluida":
                return "status-concluido";

            case "em andamento":
            case "em_andamento":
                return "status-andamento";

            case "pendente":
            case "aguardando":
                return "status-aguardando";

            default:
                return "status-default";
        }
    };

    const formatarData = (data) => {
        if (!data) return "Data não informada";

        const dataConvertida = new Date(data);

        if (Number.isNaN(dataConvertida.getTime())) {
            return "Data não informada";
        }

        return dataConvertida.toLocaleDateString("pt-BR", {
            timeZone: "UTC",
        });
    };

    const formatarStatus = (status) => {
        const statusNormalizado = (status || "").toLowerCase();

        const statusConhecidos = {
            pendente: "Aguardando",
            aguardando: "Aguardando",
            "em andamento": "Em andamento",
            em_andamento: "Em andamento",
            resolvida: "Concluída",
            resolvido: "Concluído",
            concluida: "Concluída",
        };

        if (statusConhecidos[statusNormalizado]) {
            return statusConhecidos[statusNormalizado];
        }

        if (!status) return "Não informado";

        return status.charAt(0).toUpperCase() + status.slice(1);
    };
    const menuItems = [
        {
            icon: MapPin,
            title: "Visualizar Mapa",
            description: "Veja ocorrências na sua região",
            action: "mapa",
            color: "green",
        },
        {
            icon: Eye,
            title: "Acompanhar Ocorrências",
            description: "Veja o status das suas solicitações",
            action: "acompanhar",
            color: "orange",
        },
    ];

    return (
        <div className="tela-inicial">

            <main className="tela-inicial-main">

                {/* Boas-vindas */}

                <section className="tela-inicial-welcome">

                    <h2>
                        Bem-vindo, {userName}!
                    </h2>

                    <p>
                        Escolha uma opção abaixo para gerenciar suas ocorrências
                    </p>

                </section>


                {/* CARDS DE AÇÕES */}

                <section className="quick-actions">
                    <div
                        className="main-action-card"
                        onClick={onRegistrarOcorrencia}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                onRegistrarOcorrencia();
                            }
                        }}
                    >
                        <div className="main-action-left">

                            <div className="main-action-icon">
                                <Plus size={30} strokeWidth={2.5} />
                            </div>

                            <div className="main-action-text">
                                <h3>Registrar Ocorrência</h3>
                                <p>Reporte um problema de infraestrutura na sua região</p>
                            </div>

                        </div>

                        <button
                            type="button"
                            className="main-action-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRegistrarOcorrencia();
                            }}
                        >
                            →
                        </button>
                    </div>
                </section>

                <section className="tela-inicial-actions-grid">
                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        return (

                            <article
                                key={item.action}
                                className="action-card"
                            >

                                <div className={`action-icon action-icon-${item.color}`}>
                                    <Icon
                                        size={24}
                                        strokeWidth={2}
                                    />
                                </div>
                                <div className="action-card-content">
                                    <h3>
                                        {item.title}
                                    </h3>
                                    <p>
                                        {item.description}
                                    </p> </div>

                                <button
                                    type="button"
                                    className={`action-button action-button-${item.color}`}
                                    onClick={() => {
                                        if (item.action === "mapa") {
                                            onVisualizarMapa();
                                        }

                                        if (item.action === "acompanhar") {
                                            onAcompanharOcorrencias();
                                        }
                                    }}
                                >
                                    Acessar
                                </button>
                            </article>
                        );
                    })}
                </section>

                {/* =================================================
            OCORRÊNCIAS RECENTES
        ================================================= */}

                <section className="recent-occurrences">

                    <div className="recent-occurrences-header">

                        <div>

                            <h2>
                                Ocorrências Recentes
                            </h2>

                            <p>
                                Suas últimas solicitações registradas
                            </p>

                        </div>

                        <button
                            type="button"
                            className="see-all-button"
                        >
                            Ver todas
                        </button>

                    </div>



                    <div className="occurrences-list">
                        {carregando ? (
                            <p>Carregando ocorrências...</p>
                        ) : erro ? (
                            <p role="alert">{erro}</p>
                        ) : recentOccurrences.length === 0 ? (
                            <p>Nenhuma ocorrência cadastrada.</p>
                        ) : (
                            recentOccurrences.map((occurrence) => (
                                <div
                                    key={occurrence.id}
                                    className="occurrence-item"
                                >
                                    <div className="occurrence-information">
                                        <div className="occurrence-icon">
                                            <AlertCircle size={20} />
                                        </div>

                                        <div>
                                            <p className="occurrence-title">
                                                #{occurrence.protocolo || occurrence.id}
                                                {" - "}
                                                {occurrence.categoria}
                                            </p>

                                            <p className="occurrence-date">
                                                {formatarData(occurrence.criado_em)}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className={`occurrence-status ${getStatusClass(
                                            occurrence.status
                                        )}`}
                                    >
                                        {formatarStatus(occurrence.status)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>


                </section>

            </main>

        </div>
    );
}

export default TelaInicial;