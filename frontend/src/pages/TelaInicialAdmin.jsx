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

function TelaInicialAdmin({
    onLogout,
    onGerenciarOcorrencias,
    onVisualizarMapa,
    onRelatorios,
}) {
    const userName = "Maria Oliveira";
    
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
            value: "47",
            icon: Clock,
            color: "orange",
        },
        {
            label: "Em Andamento",
            value: "23",
            icon: TrendingUp,
            color: "blue",
        },
        {
            label: "Concluídas Hoje",
            value: "12",
            icon: CheckCircle2,
            color: "green",
        },
    ];

    const pendingOccurrences = [
        {
            id: "047",
            type: "Buraco na via",
            location: "Rua Cosmo Catirino, 2",
            priority: "Alta",
            date: "24/01/2026",
            citizen: "Carlos Santos",
        },
        {
            id: "046",
            type: "Entulho na rua",
            location: "Av. Antônio Tomé, 23",
            priority: "Média",
            date: "24/01/2026",
            citizen: "Ana Costa",
        },
        {
            id: "045",
            type: "Iluminação pública",
            location: "Rua Teodoro Pereira, 52",
            priority: "Média",
            date: "23/01/2026",
            citizen: "Pedro Lima",
        },
        {
            id: "044",
            type: "Calçada danificada",
            location: "Rua Miguel Militão, 21",
            priority: "Baixa",
            date: "23/01/2026",
            citizen: "Julia Sousa",
        },
    ];

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "Urgente":
                return "admin-priority-urgente";

            case "Alta":
                return "admin-priority-alta";

            case "Média":
                return "admin-priority-media";

            case "Baixa":
                return "admin-priority-baixa";

            default:
                return "";
        }
    };

    return (
        <div className="tela-inicial-admin">

            <Header
                userName={userName}
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

                                            #{occurrence.id} - {occurrence.type}

                                            <span
                                                className={`admin-priority ${getPriorityClass(
                                                    occurrence.priority
                                                )}`}
                                            >
                                                {occurrence.priority}
                                            </span>

                                        </p>

                                        <p className="admin-pending-location">
                                            {occurrence.location}
                                        </p>

                                        <p className="admin-pending-citizen">
                                            Solicitante: {occurrence.citizen} • {occurrence.date}
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