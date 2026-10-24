import { useEffect, useState } from "react";

import {
    MapPin,
    FileText,
    Settings,
    AlertCircle,
    TrendingUp,
    Clock,
    CheckCircle2,
} from "lucide-react";

import "../styles/telaInicialAdmin.css";
import Header from "../components/Header.jsx";
import { apiRequest } from "../services/api.js";
function TelaInicialAdmin({
    usuario,
    token,
    onLogout,
    onGerenciarOcorrencias,
    onVisualizarMapa,
    onRelatorios,
}) {
    const [indicadores, setIndicadores] = useState({
        ocorrencias_ativas: 0,
        em_andamento: 0,
        concluidas_hoje: 0,
    });

    const [pendingOccurrences, setPendingOccurrences] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erroCarregamento, setErroCarregamento] = useState("");

    useEffect(() => {
        if (!token) {
            setErroCarregamento("Não foi possível identificar a sessão do administrador.");
            setCarregando(false);
            return;
        }

        async function carregarDadosPainel() {
            try {
                setCarregando(true);
                setErroCarregamento("");

                const [dadosIndicadores, dadosPendentes] = await Promise.all([
                    apiRequest("/relatorios/painel", {}, token),
                    apiRequest("/relatorios/pendentes-painel", {}, token),
                ]);

                setIndicadores({
                    ocorrencias_ativas: Number(dadosIndicadores.ocorrencias_ativas ?? 0),
                    em_andamento: Number(dadosIndicadores.em_andamento ?? 0),
                    concluidas_hoje: Number(dadosIndicadores.concluidas_hoje ?? 0),
                });

                setPendingOccurrences(
                    Array.isArray(dadosPendentes) ? dadosPendentes : []
                );
            } catch (erro) {
                console.error("Erro ao carregar painel administrativo:", erro);
                setErroCarregamento(
                    erro.message || "Não foi possível carregar os dados do painel."
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarDadosPainel();
    }, [token]);

    const menuItems = [
        {
            icon: Settings,
            title: "Gerenciar Ocorrências",
            description: "Atribuir, atualizar e resolver ocorrências",
            action: "gerenciar",
            color: "blue",
            onClick: onGerenciarOcorrencias,
        },
        {
            icon: MapPin,
            title: "Visualizar Mapa",
            description: "Veja todas as ocorrências no mapa",
            action: "mapa",
            color: "green",
            onClick: onVisualizarMapa,
        },
        {
            icon: FileText,
            title: "Emitir Relatórios",
            description: "Gere relatórios e estatísticas",
            action: "relatorios",
            color: "purple",
            onClick: onRelatorios,
        },
    ];

    const stats = [
        {
            label: "Ocorrências Ativas",
            value: carregando ? "..." : indicadores.ocorrencias_ativas,
            icon: Clock,
            color: "orange",
        },
        {
            label: "Em Andamento",
            value: carregando ? "..." : indicadores.em_andamento,
            icon: TrendingUp,
            color: "blue",
        },
        {
            label: "Concluídas Hoje",
            value: carregando ? "..." : indicadores.concluidas_hoje,
            icon: CheckCircle2,
            color: "green",
        },
    ];

    const getPriorityClass = (priority) => {
        const prioridade = String(priority || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        switch (prioridade) {
            case "urgente":
                return "admin-priority-urgente";

            case "alta":
                return "admin-priority-alta";

            case "media":
                return "admin-priority-media";

            case "baixa":
                return "admin-priority-baixa";

            default:
                return "";
        }
    };

    return (
        <div className="tela-inicial-admin">

            <Header
                userName={usuario?.nome || "Administrador"}
                userRole="Administrador"
                onLogout={onLogout}
            />

            <main className="tela-inicial-admin-main">

                {/* Boas-vindas */}

                <section className="tela-inicial-admin-welcome">
                    <h2>Painel Administrativo</h2>

                    <p>
                        Gerencie ocorrências e monitore a infraestrutura da cidade
                    </p>
                </section>

                {/* Indicadores */}

                <section className="admin-stats-grid">

                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <article
                                key={stat.label}
                                className="admin-stat-card"
                            >

                                <div className="admin-stat-content">

                                    <p className="admin-stat-label">
                                        {stat.label}
                                    </p>

                                    <p className="admin-stat-value">
                                        {stat.value}
                                    </p>

                                </div>

                                <div
                                    className={`admin-stat-icon admin-stat-icon-${stat.color}`}
                                >
                                    <Icon size={24} />
                                </div>

                            </article>
                        );
                    })}

                </section>

                {/* Ações administrativas */}

                <section className="admin-actions-grid">

                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <article
                                key={item.action}
                                className="admin-action-card"
                            >

                                <div
                                    className={`admin-action-icon admin-action-icon-${item.color}`}
                                >
                                    <Icon size={24} />
                                </div>

                                <div className="admin-action-content">

                                    <h3>
                                        {item.title}
                                    </h3>

                                    <p>
                                        {item.description}
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    className={`admin-action-button admin-action-button-${item.color}`}
                                    onClick={item.onClick}
                                >
                                    Acessar
                                </button>

                            </article>
                        );
                    })}

                </section>

                {/* Ocorrências pendentes */}

                <section className="admin-pending">

                    <div className="admin-pending-header">

                        <div>
                            <h2>Ocorrências Pendentes</h2>

                            <p>
                                Solicitações aguardando atribuição ou ação
                            </p>
                        </div>

                        <button
                            type="button"
                            className="admin-see-all-button"
                            onClick={onGerenciarOcorrencias}
                        >
                            Ver todas
                        </button>

                    </div>

                    <div className="admin-pending-list">
                        {carregando && (
                            <p>Carregando ocorrências...</p>
                        )}

                        {!carregando && erroCarregamento && (
                            <p>{erroCarregamento}</p>
                        )}

                        {!carregando &&
                            !erroCarregamento &&
                            pendingOccurrences.length === 0 && (
                                <p>Não há ocorrências pendentes no momento.</p>
                            )}
                        {pendingOccurrences.map((occurrence) => (

                            <article
                                key={occurrence.id}
                                className="admin-pending-item"
                            >
                                <div className="admin-pending-information">
                                    <div className="admin-pending-icon">
                                        <AlertCircle size={20} />
                                    </div>

                                    <div className="admin-pending-content">
                                        <p className="admin-pending-title">
                                            #{occurrence.protocolo || occurrence.id} - {occurrence.categoria}

                                            <span
                                                className={`admin-priority ${getPriorityClass(
                                                    String(occurrence.prioridade || "Baixa")
                                                        .toLowerCase()
                                                        .replace("média", "media")
                                                        .replace("urgente", "urgente")
                                                        .replace("alta", "alta")
                                                        .replace("baixa", "baixa")
                                                )}`}
                                            >
                                                {String(occurrence.prioridade || "Baixa")
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    String(occurrence.prioridade || "Baixa").slice(1)}
                                            </span>
                                        </p>

                                        <p className="admin-pending-location">
                                            {[occurrence.endereco, occurrence.bairro]
                                                .filter(Boolean)
                                                .join(" - ") || "Endereço não informado"}
                                        </p>

                                        <p className="admin-pending-citizen">
                                            Solicitante: {occurrence.solicitante || "Não informado"}
                                            {" • "}
                                            {occurrence.criado_em
                                                ? new Date(occurrence.criado_em).toLocaleDateString("pt-BR")
                                                : "Data não informada"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="admin-assign-button"
                                    onClick={onGerenciarOcorrencias}
                                >
                                    Atribuir
                                </button>
                            </article>
                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default TelaInicialAdmin;