import {
    Building2,
    MapPin,
    Eye,
    LogOut,
    AlertCircle,
    Plus,
    List,
} from "lucide-react";

import "../styles/TelaInicial.css";
import Header from "../components/Header.jsx";

function TelaInicial({
    onLogout,
    onRegistrarOcorrencia,
    onVisualizarMapa,
    onMinhasOcorrencias,
    onAcompanharOcorrencias,
}) {
    const userName = "João Silva";

    const menuItems = [
        {
            icon: MapPin,
            title: "Visualizar Mapa",
            description: "Veja ocorrências na sua região",
            action: "mapa",
            color: "green",
        },
        {
            icon: List,
            title: "Minhas Ocorrências",
            description: "Editar ou cancelar ocorrências",
            action: "minhas",
            color: "purple",
        },
        {
            icon: Eye,
            title: "Acompanhar Ocorrências",
            description: "Veja o status das suas solicitações",
            action: "acompanhar",
            color: "orange",
        },
    ];

    const recentOccurrences = [
        {
            id: "001",
            type: "Buraco na via",
            status: "Em andamento",
            date: "20/01/2025",
        },
        {
            id: "002",
            type: "Iluminação pública",
            status: "Aguardando",
            date: "18/01/2025",
        },
        {
            id: "003",
            type: "Calçada danificada",
            status: "Concluído",
            date: "15/01/2025",
        },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case "Concluído":
                return "status-concluido";

            case "Em andamento":
                return "status-andamento";

            case "Aguardando":
                return "status-aguardando";

            default:
                return "status-default";
        }
    };

    return (
        <div className="tela-inicial">

            <Header
                userName={userName}
                userRole="Cidadão"
                onLogout={onLogout}
            />
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


                {/* =================================================
            CARDS DE AÇÕES
        ================================================= */}

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

                                        if (item.action === "minhas") {
                                            onMinhasOcorrencias();
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

                        {recentOccurrences.map((occurrence) => (

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
                                            #{occurrence.id} - {occurrence.type}
                                        </p>

                                        <p className="occurrence-date">
                                            {occurrence.date}
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className={`occurrence-status ${getStatusClass(
                                        occurrence.status
                                    )}`}
                                >
                                    {occurrence.status}
                                </div>

                            </div>

                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default TelaInicial;