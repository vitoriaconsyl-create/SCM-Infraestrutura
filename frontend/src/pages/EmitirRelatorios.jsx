
import { useState, useEffect } from "react";
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
import { apiRequest } from "../services/api.js";

function EmitirRelatorios({
    onVoltar,
    onLogout,
    userName,
    token,
}) {
    const [periodo, setPeriodo] = useState("7d");
    const [relatorio, setRelatorio] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [tentativa, setTentativa] = useState(0);

    const periodos = [
        { label: "Últimos 7 dias", value: "7d", api: "7" },
        { label: "Últimos 30 dias", value: "30d", api: "30" },
        { label: "Últimos 3 meses", value: "3m", api: "3meses" },
        { label: "Este ano", value: "year", api: "ano" },
    ];

    const periodoSelecionado = periodos.find(
        (item) => item.value === periodo
    );

    useEffect(() => {
        let ativo = true;

        async function carregarRelatorio() {
            setCarregando(true);
            setErro("");

            try {
                if (!token) {
                    throw new Error(
                        "Sua sessão não foi identificada. Entre novamente no sistema."
                    );
                }

                const dados = await apiRequest(
                    `/relatorios?periodo=${periodoSelecionado.api}`,
                    {},
                    token
                );

                if (ativo) {
                    setRelatorio(dados);
                }
            } catch (error) {
                if (ativo) {
                    setErro(
                        error.message ||
                        "Não foi possível carregar os relatórios."
                    );
                    setRelatorio(null);
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarRelatorio();

        return () => {
            ativo = false;
        };
    }, [periodo, token, tentativa]);

    const imprimirRelatorio = () => {
        const tituloOriginal = document.title;

        document.title = "Relatorio_SCM_Infraestrutura";

        window.print();

        document.title = tituloOriginal;
    };

    const numero = (valor) => Number(valor || 0);

    const resumo = relatorio?.resumo || {};
    const indicadores = relatorio?.indicadores || {};

    const total = numero(resumo.total);
    const resolvidas = numero(resumo.resolvidas);
    const andamento = numero(resumo.em_andamento);
    const urgentes = numero(indicadores.urgentes_abertas);

    const taxaResolucao = total > 0
        ? Math.round((resolvidas / total) * 100)
        : 0;

    const categorias = (relatorio?.categorias || []).map((item) => ({
        nome: item.categoria || "Sem categoria",
        total: numero(item.total),
    }));

    const maiorCategoria = Math.max(
        1,
        ...categorias.map((item) => item.total)
    );

    const bairros = relatorio?.bairros || [];
    const status = relatorio?.status || [];

    const nomesStatus = {
        pendente: "Pendente",
        "em_análise": "Em análise",
        "em_analise": "Em análise",
        "em andament": "Em andamento",
        em_andament: "Em andamento",
        em_andamento: "Em andamento",
        "aguardando_peças": "Aguardando peças",
        aguardando_pecas: "Aguardando peças",
        concluido: "Concluído",
        concluida: "Concluído",
        cancelado: "Cancelado",
    };

    const nomeCategoria = (categoria) => {
        const nomes = {
            buraco: "Buraco na via",
            iluminacao: "Iluminação",
            semaforo: "Semáforo",
            calcada: "Calçada",
            esgoto: "Esgoto",
            lixo: "Lixo",
            arvore: "Árvore",
            sinalizacao: "Sinalização",
        };

        const chave = String(categoria || "").toLowerCase();

        return nomes[chave] || categoria || "Sem categoria";
    };

    return (
        <div className="relatorios-container">

            <Header
                userName={userName}
                userRole="Administrador"
                onLogout={onLogout}
            />

            <main className="relatorios-main">

                <button
                    className="relatorios-voltar"
                    onClick={onVoltar}
                >
                    <ArrowLeft size={18} />
                    Voltar ao painel
                </button>

                <section className="relatorios-topo">
                    <div>
                        <h1>Relatório de Ocorrências</h1>
                        <p>
                            Análise estatística das ocorrências —{" "}
                            {periodoSelecionado.label}
                        </p>
                    </div>

                    <div className="relatorios-acoes">
                        <button
                            className="relatorios-btn-imprimir"
                            onClick={imprimirRelatorio}
                            disabled={carregando || !!erro}
                        >
                            <Printer size={17} />
                            Imprimir
                        </button>

                        <button
                            className="relatorios-btn-exportar"
                            onClick={imprimirRelatorio}
                            disabled={carregando || !!erro}
                        >
                            <Download size={17} />
                            Exportar PDF
                        </button>
                    </div>
                </section>

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
                            onClick={() => setPeriodo(item.value)}
                            disabled={carregando}
                        >
                            {item.label}
                        </button>
                    ))}
                </section>

                {carregando && (
                    <p className="relatorio-mensagem">
                        Carregando dados do relatório...
                    </p>
                )}

                {!carregando && erro && (
                    <section className="relatorio-mensagem relatorio-erro">
                        <p>{erro}</p>
                        <button onClick={() => setTentativa((valor) => valor + 1)}>
                            Tentar novamente
                        </button>
                    </section>
                )}

                {!carregando && !erro && relatorio && (
                    <>
                        <section className="relatorios-indicadores">

                            <div className="relatorio-card">
                                <div>
                                    <span>Total registradas</span>
                                    <strong>{total}</strong>
                                </div>
                                <FileText size={25} />
                            </div>

                            <div className="relatorio-card verde">
                                <div>
                                    <span>Resolvidas</span>
                                    <strong>{resolvidas}</strong>
                                    <small>{taxaResolucao}% de resolução</small>
                                </div>
                                <CheckCircle2 size={25} />
                            </div>

                            <div className="relatorio-card azul">
                                <div>
                                    <span>Em andamento</span>
                                    <strong>{andamento}</strong>
                                </div>
                                <Clock size={25} />
                            </div>

                            <div className="relatorio-card vermelho">
                                <div>
                                    <span>Urgentes abertas</span>
                                    <strong>{urgentes}</strong>
                                    <small>Requerem atenção</small>
                                </div>
                                <AlertCircle size={25} />
                            </div>

                        </section>

                        <section className="relatorio-box">
                            <div className="relatorio-box-header">
                                <div>
                                    <h2>Ocorrências por tipo</h2>
                                    <p>{periodoSelecionado.label}</p>
                                </div>
                                <TrendingUp size={20} />
                            </div>

                            {categorias.length === 0 ? (
                                <p>Nenhuma ocorrência no período selecionado.</p>
                            ) : (
                                <div className="grafico-barras">
                                    {categorias.map((item) => (
                                        <div
                                            className="barra-item"
                                            key={item.nome}
                                        >
                                            <div className="barra-info">
                                                <span>
                                                    {nomeCategoria(item.nome)}
                                                </span>
                                                <strong>{item.total}</strong>
                                            </div>

                                            <div className="barra-fundo">
                                                <div
                                                    className="barra"
                                                    style={{
                                                        width: `${(item.total / maiorCategoria) * 100
                                                            }%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="relatorio-box">
                            <div className="relatorio-box-header">
                                <div>
                                    <h2>Distribuição por status</h2>
                                    <p>Situação das ocorrências</p>
                                </div>
                            </div>

                            {status.length === 0 ? (
                                <p>Nenhum status encontrado no período.</p>
                            ) : (
                                <div className="status-relatorio">
                                    {status.map((item) => (
                                        <div
                                            className="status-item"
                                            key={item.status}
                                        >
                                            <span
                                                className={`status-bolinha ${item.status === "concluido" ||
                                                    item.status === "concluida"
                                                    ? "concluido"
                                                    : item.status === "pendente"
                                                        ? "pendente"
                                                        : "andamento"
                                                    }`}
                                            />
                                            <span>
                                                {nomesStatus[item.status] ||
                                                    item.status}
                                            </span>
                                            <strong>{numero(item.total)}</strong>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="relatorio-box">
                            <div className="relatorio-box-header">
                                <div>
                                    <h2>Bairros com mais ocorrências</h2>
                                    <p>{periodoSelecionado.label}</p>
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
                                        {bairros.length === 0 ? (
                                            <tr>
                                                <td colSpan="5">
                                                    Nenhuma ocorrência encontrada.
                                                </td>
                                            </tr>
                                        ) : (
                                            bairros.map((item, indice) => {
                                                const totalBairro = numero(item.total);
                                                const resolvidasBairro = numero(item.resolvidas);

                                                const taxa = totalBairro > 0
                                                    ? Math.round(
                                                        (resolvidasBairro / totalBairro) * 100
                                                    )
                                                    : 0;

                                                return (
                                                    <tr
                                                        key={`${item.bairro}-${indice}`}
                                                    >
                                                        <td>
                                                            {item.bairro || "Não informado"}
                                                        </td>
                                                        <td>{totalBairro}</td>
                                                        <td className="texto-verde">
                                                            {resolvidasBairro}
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
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

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
                    </>
                )}
            </main>
        </div>
    );
}

export default EmitirRelatorios;
