import { useState } from "react";
import {
    FileText,
    Calendar,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowLeft,
    Download,
    Printer,
} from "lucide-react";

import "../styles/emitirRelatorios.css";
import Header from "../components/Header.jsx";

function EmitirRelatorios({
    onVoltar,
    onLogout,
    userName,
}) {

    const [periodo, setPeriodo] = useState("7d");

    const periodos = [
        { label: "Últimos 7 dias", value: "7d" },
        { label: "Últimos 30 dias", value: "30d" },
        { label: "Últimos 3 meses", value: "3m" },
        { label: "Este ano", value: "year" },
    ];

    const dados = {
        "7d": {
            total: 45,
            resolvidas: 33,
            andamento: 8,
            urgentes: 4,

            tipos: [
                ["Buraco na via", 8],
                ["Iluminação", 5],
                ["Semáforo", 3],
                ["Calçada", 6],
                ["Esgoto", 4],
                ["Lixo", 7],
                ["Árvore", 2],
            ],

            bairros: [
                ["Centro", 12, 8],
                ["Bairro Novo", 8, 5],
                ["Zona Sul", 7, 6],
                ["Vila Esperança", 5, 3],
                ["Residencial A", 3, 1],
            ],
        },

        "30d": {
            total: 140,
            resolvidas: 107,
            andamento: 22,
            urgentes: 11,

            tipos: [
                ["Buraco na via", 31],
                ["Iluminação", 20],
                ["Semáforo", 11],
                ["Calçada", 25],
                ["Esgoto", 16],
                ["Lixo", 28],
                ["Árvore", 9],
            ],

            bairros: [
                ["Centro", 45, 32],
                ["Bairro Novo", 28, 20],
                ["Zona Sul", 22, 18],
                ["Vila Esperança", 17, 11],
                ["Residencial A", 10, 7],
            ],
        },

        "3m": {
            total: 418,
            resolvidas: 321,
            andamento: 58,
            urgentes: 39,

            tipos: [
                ["Buraco na via", 92],
                ["Iluminação", 64],
                ["Semáforo", 31],
                ["Calçada", 75],
                ["Esgoto", 48],
                ["Lixo", 82],
                ["Árvore", 26],
            ],

            bairros: [
                ["Centro", 120, 92],
                ["Bairro Novo", 86, 65],
                ["Zona Sul", 72, 58],
                ["Vila Esperança", 55, 42],
                ["Residencial A", 38, 29],
            ],
        },

        "year": {
            total: 1643,
            resolvidas: 1289,
            andamento: 210,
            urgentes: 144,

            tipos: [
                ["Buraco na via", 340],
                ["Iluminação", 245],
                ["Semáforo", 130],
                ["Calçada", 280],
                ["Esgoto", 190],
                ["Lixo", 330],
                ["Árvore", 128],
            ],

            bairros: [
                ["Centro", 420, 340],
                ["Bairro Novo", 310, 245],
                ["Zona Sul", 270, 215],
                ["Vila Esperança", 220, 180],
                ["Residencial A", 170, 130],
            ],
        },
    };

    const dadosPeriodo = dados[periodo];

    const periodoSelecionado =
        periodos.find((item) => item.value === periodo);

    const taxaResolucao = Math.round(
        (dadosPeriodo.resolvidas / dadosPeriodo.total) * 100
    );

    const imprimirRelatorio = () => {
        window.print();
    };

    return (
        <div className="relatorios-container">

            <Header
                userName={userName}
                userRole="Administrador"
                onLogout={onLogout}
            />

            <main className="relatorios-main">

                {/* Voltar */}

                <button
                    className="relatorios-voltar"
                    onClick={onVoltar}
                >
                    <ArrowLeft size={18} />
                    Voltar ao painel
                </button>

                {/* Título */}

                <section className="relatorios-topo">

                    <div>
                        <h1>Emitir Relatórios</h1>

                        <p>
                            Análise estatística das ocorrências —{" "}
                            {periodoSelecionado.label}
                        </p>
                    </div>

                    <div className="relatorios-acoes">

                        <button
                            className="relatorios-btn-imprimir"
                            onClick={imprimirRelatorio}
                        >
                            <Printer size={17} />
                            Imprimir
                        </button>

                        <button
                            className="relatorios-btn-exportar"
                            onClick={imprimirRelatorio}
                        >
                            <Download size={17} />
                            Exportar PDF
                        </button>

                    </div>

                </section>

                {/* Período */}

                <section className="relatorios-periodos">

                    <Calendar size={18} />

                    {periodos.map((item) => (

                        <button
                            key={item.value}
                            className={
                                periodo === item.value
                                    ? "periodo-ativo"
                                    : ""
                            }
                            onClick={() =>
                                setPeriodo(item.value)
                            }
                        >
                            {item.label}
                        </button>

                    ))}

                </section>

                {/* Indicadores */}

                <section className="relatorios-indicadores">

                    <div className="relatorio-card">

                        <div>
                            <span>Total registradas</span>
                            <strong>{dadosPeriodo.total}</strong>
                        </div>

                        <FileText size={25} />

                    </div>

                    <div className="relatorio-card verde">

                        <div>
                            <span>Resolvidas</span>
                            <strong>{dadosPeriodo.resolvidas}</strong>
                            <small>
                                {taxaResolucao}% de resolução
                            </small>
                        </div>

                        <CheckCircle2 size={25} />

                    </div>

                    <div className="relatorio-card azul">

                        <div>
                            <span>Em andamento</span>
                            <strong>{dadosPeriodo.andamento}</strong>
                        </div>

                        <Clock size={25} />

                    </div>

                    <div className="relatorio-card vermelho">

                        <div>
                            <span>Urgentes abertas</span>
                            <strong>{dadosPeriodo.urgentes}</strong>
                            <small>
                                Requerem atenção
                            </small>
                        </div>

                        <AlertCircle size={25} />

                    </div>

                </section>

                {/* Ocorrências por tipo */}

                <section className="relatorio-box">

                    <div className="relatorio-box-header">

                        <div>
                            <h2>Ocorrências por tipo</h2>

                            <p>
                                {periodoSelecionado.label}
                            </p>
                        </div>

                        <TrendingUp size={20} />

                    </div>

                    <div className="grafico-barras">

                        {dadosPeriodo.tipos.map(
                            ([tipo, quantidade]) => {

                                const maior =
                                    Math.max(
                                        ...dadosPeriodo.tipos.map(
                                            (item) => item[1]
                                        )
                                    );

                                const porcentagem =
                                    (quantidade / maior) * 100;

                                return (
                                    <div
                                        className="barra-item"
                                        key={tipo}
                                    >

                                        <div className="barra-info">
                                            <span>{tipo}</span>
                                            <strong>
                                                {quantidade}
                                            </strong>
                                        </div>

                                        <div className="barra-fundo">

                                            <div
                                                className="barra"
                                                style={{
                                                    width: `${porcentagem}%`,
                                                }}
                                            />

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                </section>

                {/* Status */}

                <section className="relatorio-box">

                    <div className="relatorio-box-header">

                        <div>
                            <h2>
                                Distribuição por status
                            </h2>

                            <p>
                                Situação das ocorrências
                            </p>
                        </div>

                    </div>

                    <div className="status-relatorio">

                        <div className="status-item">
                            <span className="status-bolinha concluido" />
                            <span>Concluídas</span>
                            <strong>
                                {dadosPeriodo.resolvidas}
                            </strong>
                        </div>

                        <div className="status-item">
                            <span className="status-bolinha andamento" />
                            <span>Em andamento</span>
                            <strong>
                                {dadosPeriodo.andamento}
                            </strong>
                        </div>

                        <div className="status-item">
                            <span className="status-bolinha pendente" />
                            <span>Pendentes</span>
                            <strong>
                                {Math.max(
                                    dadosPeriodo.total -
                                    dadosPeriodo.resolvidas -
                                    dadosPeriodo.andamento -
                                    dadosPeriodo.urgentes,
                                    0
                                )}
                            </strong>
                        </div>

                        <div className="status-item">
                            <span className="status-bolinha urgente" />
                            <span>Urgentes</span>
                            <strong>
                                {dadosPeriodo.urgentes}
                            </strong>
                        </div>

                    </div>

                </section>

                {/* Bairros */}

                <section className="relatorio-box">

                    <div className="relatorio-box-header">

                        <div>
                            <h2>
                                Bairros com mais ocorrências
                            </h2>

                            <p>
                                {periodoSelecionado.label}
                            </p>
                        </div>

                    </div>

                    <div className="tabela-container">

                        <table>

                            <thead>
                                <tr>
                                    <th>Bairro</th>
                                    <th>Total</th>
                                    <th>Resolvidas</th>
                                    <th>Taxa</th>
                                    <th>Progresso</th>
                                </tr>
                            </thead>

                            <tbody>

                                {dadosPeriodo.bairros.map(
                                    ([bairro, total, resolvidas]) => {

                                        const taxa =
                                            Math.round(
                                                (resolvidas / total) *
                                                100
                                            );

                                        return (
                                            <tr key={bairro}>

                                                <td>
                                                    {bairro}
                                                </td>

                                                <td>
                                                    {total}
                                                </td>

                                                <td className="texto-verde">
                                                    {resolvidas}
                                                </td>

                                                <td>
                                                    <span className="taxa">
                                                        {taxa}%
                                                    </span>
                                                </td>

                                                <td>

                                                    <div className="progresso-fundo">

                                                        <div
                                                            className="progresso"
                                                            style={{
                                                                width: `${taxa}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

                {/* Botões finais */}

                <section className="relatorios-final">

                    <button
                        className="relatorios-btn-imprimir"
                        onClick={imprimirRelatorio}
                    >
                        <Printer size={18} />
                        Imprimir relatório
                    </button>

                    <button
                        className="relatorios-btn-exportar"
                        onClick={imprimirRelatorio}
                    >
                        <Download size={18} />
                        Exportar PDF completo
                    </button>

                </section>

            </main>

        </div>
    );
}

export default EmitirRelatorios;