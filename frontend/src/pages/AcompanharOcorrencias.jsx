import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    AlertCircle,
    MapPin,
    Calendar,
    FileText,
} from "lucide-react";

import "../styles/acompanharOcorrencias.css";
import Header from "../components/Header.jsx";

function AcompanharOcorrencias({ onVoltar, onLogout }) {

    const userName = "João Silva";

    const ocorrencias = [
        {
            id: "001",
            protocolo: "SCM-48271",
            tipo: "Buraco na via",
            endereco: "Rua das Flores, 142 — Centro",
            data: "20/01/2026",
            status: "Em andamento",
            descricao:
                "Buraco de aproximadamente 1m de diâmetro na pista principal.",
        },
        {
            id: "002",
            protocolo: "SCM-31904",
            tipo: "Iluminação pública",
            endereco: "Av. Getúlio Vargas, 450",
            data: "18/01/2026",
            status: "Aguardando",
            descricao:
                "Poste apagado há mais de 5 dias, deixando o trecho sem iluminação.",
        },
        {
            id: "003",
            protocolo: "SCM-20045",
            tipo: "Calçada danificada",
            endereco: "Rua do Comércio, 321",
            data: "15/01/2026",
            status: "Concluído",
            descricao:
                "Calçada com placas levantadas próximo à escola municipal.",
        },
    ];

    const getStatusClass = (status) => {

        switch (status) {

            case "Aguardando":
                return "acompanhar-status-aguardando";

            case "Em andamento":
                return "acompanhar-status-andamento";

            case "Concluído":
                return "acompanhar-status-concluido";

            default:
                return "";
        }
    };

    return (
        <div className="acompanhar-container">

            <Header
                userName={userName}
                onLogout={onLogout}
            />

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
                        <h2>Acompanhar Ocorrências</h2>

                        <p>
                            Acompanhe o andamento das suas solicitações.
                        </p>
                    </div>

                </section>

                <section className="acompanhar-lista">

                    {ocorrencias.map((ocorrencia) => (

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
                                            #{ocorrencia.id} - {ocorrencia.tipo}
                                        </h3>

                                        <span>
                                            Protocolo: {ocorrencia.protocolo}
                                        </span>

                                    </div>

                                </div>

                                <span
                                    className={`acompanhar-status ${getStatusClass(
                                        ocorrencia.status
                                    )}`}
                                >
                                    {ocorrencia.status}
                                </span>

                            </div>

                            <div className="acompanhar-informacoes">

                                <div className="acompanhar-info">
                                    <MapPin size={17} />
                                    <span>{ocorrencia.endereco}</span>
                                </div>

                                <div className="acompanhar-info">
                                    <Calendar size={17} />
                                    <span>
                                        Registrada em {ocorrencia.data}
                                    </span>
                                </div>

                            </div>

                            <p className="acompanhar-descricao">
                                {ocorrencia.descricao}
                            </p>

                            <div className="acompanhar-progresso">

                                <div className="acompanhar-progresso-item concluido">

                                    <div className="acompanhar-progresso-icon">
                                        <CheckCircle2 size={18} />
                                    </div>

                                    <span>Registrada</span>

                                </div>

                                <div className="acompanhar-linha"></div>

                                <div
                                    className={`acompanhar-progresso-item ${
                                        ocorrencia.status === "Aguardando"
                                            ? "atual"
                                            : "concluido"
                                    }`}
                                >

                                    <div className="acompanhar-progresso-icon">
                                        <Clock size={18} />
                                    </div>

                                    <span>Em análise</span>

                                </div>

                                <div className="acompanhar-linha"></div>

                                <div
                                    className={`acompanhar-progresso-item ${
                                        ocorrencia.status === "Em andamento" ||
                                        ocorrencia.status === "Concluído"
                                            ? "concluido"
                                            : ""
                                    }`}
                                >

                                    <div className="acompanhar-progresso-icon">
                                        <AlertCircle size={18} />
                                    </div>

                                    <span>Em atendimento</span>

                                </div>

                                <div className="acompanhar-linha"></div>

                                <div
                                    className={`acompanhar-progresso-item ${
                                        ocorrencia.status === "Concluído"
                                            ? "concluido"
                                            : ""
                                    }`}
                                >

                                    <div className="acompanhar-progresso-icon">
                                        <CheckCircle2 size={18} />
                                    </div>

                                    <span>Concluída</span>

                                </div>

                            </div>

                        </article>

                    ))}

                </section>

            </main>

        </div>
    );
}

export default AcompanharOcorrencias;