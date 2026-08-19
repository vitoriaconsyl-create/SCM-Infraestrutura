import { useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Pencil,
  Search,
  SlidersHorizontal,
  Tag,
  Trash2,
  X,
} from "lucide-react";

import Header from "../components/Header.jsx";
import "../styles/minhasOcorrencias.css";

function MinhasOcorrencias({ onVoltar, onLogout }) {
  const userName = "João Silva";

  const [ocorrencias, setOcorrencias] = useState([
    {
      id: "001",
      protocolo: "SCM-48271",
      tipo: "Buraco na via",
      endereco: "Rua das Flores, Centro",
      descricao:
        "Buraco de aproximadamente 1 metro de diâmetro na pista, causando risco para motoristas e motociclistas.",
      urgencia: "Alta",
      status: "Em andamento",
      data: "20/01/2026",
    },
    {
      id: "002",
      protocolo: "SCM-31904",
      tipo: "Iluminação pública",
      endereco: "Rua São Pedro, Centro",
      descricao:
        "Poste de iluminação pública apagado durante a noite, deixando o trecho sem iluminação adequada.",
      urgencia: "Média",
      status: "Aguardando",
      data: "18/01/2026",
    },
    {
      id: "003",
      protocolo: "SCM-20045",
      tipo: "Calçada danificada",
      endereco: "Rua do Comércio, Centro",
      descricao:
        "Calçada apresenta partes quebradas e levantadas, dificultando a passagem dos pedestres.",
      urgencia: "Baixa",
      status: "Concluído",
      data: "15/01/2026",
    },
    {
      id: "004",
      protocolo: "SCM-62190",
      tipo: "Lixo acumulado",
      endereco: "Rua João Alves, Centro",
      descricao:
        "Acúmulo de lixo e entulho próximo à via pública, ocupando parte da calçada.",
      urgencia: "Média",
      status: "Cancelado",
      data: "10/01/2026",
    },
  ]);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [expandido, setExpandido] = useState(null);

  const [editando, setEditando] = useState(null);
  const [cancelando, setCancelando] = useState(null);

  const [editForm, setEditForm] = useState({});

  const ocorrenciasVisiveis = ocorrencias.filter((ocorrencia) => {
    const textoBusca = busca.toLowerCase();

    const encontrouBusca =
      ocorrencia.tipo.toLowerCase().includes(textoBusca) ||
      ocorrencia.protocolo.toLowerCase().includes(textoBusca);

    const encontrouStatus =
      filtroStatus === "Todos" ||
      ocorrencia.status === filtroStatus;

    return encontrouBusca && encontrouStatus;
  });

  const total = ocorrencias.filter(
    (ocorrencia) => ocorrencia.status !== "Cancelado"
  ).length;

  const aguardando = ocorrencias.filter(
    (ocorrencia) => ocorrencia.status === "Aguardando"
  ).length;

  const andamento = ocorrencias.filter(
    (ocorrencia) => ocorrencia.status === "Em andamento"
  ).length;

  const concluidas = ocorrencias.filter(
    (ocorrencia) => ocorrencia.status === "Concluído"
  ).length;

  const abrirEdicao = (ocorrencia) => {
    setEditando(ocorrencia);

    setEditForm({
      tipo: ocorrencia.tipo,
      endereco: ocorrencia.endereco,
      descricao: ocorrencia.descricao,
      urgencia: ocorrencia.urgencia,
    });
  };

  const salvarEdicao = () => {
    setOcorrencias((lista) =>
      lista.map((ocorrencia) =>
        ocorrencia.id === editando.id
          ? {
              ...ocorrencia,
              ...editForm,
            }
          : ocorrencia
      )
    );

    setEditando(null);
  };

  const confirmarCancelamento = () => {
    setOcorrencias((lista) =>
      lista.map((ocorrencia) =>
        ocorrencia.id === cancelando.id
          ? {
              ...ocorrencia,
              status: "Cancelado",
            }
          : ocorrencia
      )
    );

    setCancelando(null);
  };

  const podeEditar = (status) => status === "Aguardando";

  const podeCancelar = (status) =>
    status === "Aguardando" || status === "Em andamento";

  const getStatusClass = (status) => {
    switch (status) {
      case "Aguardando":
        return "statusAguardando";

      case "Em andamento":
        return "statusAndamento";

      case "Concluído":
        return "statusConcluido";

      case "Cancelado":
        return "statusCancelado";

      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Aguardando":
        return <AlertCircle size={18} />;

      case "Em andamento":
        return <Clock size={18} />;

      case "Concluído":
        return <CheckCircle2 size={18} />;

      case "Cancelado":
        return <X size={18} />;

      default:
        return <AlertCircle size={18} />;
    }
  };

  return (
    <div className="minhasOcorrencias">

      <Header
        userName={userName}
        onLogout={onLogout}
      />

      <main className="minhasOcorrenciasMain">

        <button
          className="voltarButton"
          onClick={onVoltar}
        >
          <ArrowLeft size={18} />
          Voltar ao painel
        </button>

        <section className="minhasOcorrenciasTitulo">

          <h2>Minhas Ocorrências</h2>

          <p>
            Visualize, edite ou cancele suas solicitações.
          </p>

        </section>

        {/* ESTATÍSTICAS */}

        <section className="estatisticasOcorrencias">

          <div className="estatisticaCard total">
            <strong>{total}</strong>
            <span>Total</span>
          </div>

          <div className="estatisticaCard aguardando">
            <strong>{aguardando}</strong>
            <span>Aguardando</span>
          </div>

          <div className="estatisticaCard andamento">
            <strong>{andamento}</strong>
            <span>Em andamento</span>
          </div>

          <div className="estatisticaCard concluido">
            <strong>{concluidas}</strong>
            <span>Concluídas</span>
          </div>

        </section>

        {/* BUSCA E FILTRO */}

        <section className="filtrosOcorrencias">

          <div className="campoBusca">

            <Search size={18} />

            <input
              type="text"
              placeholder="Buscar por tipo ou protocolo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

          </div>

          <div className="campoFiltro">

            <SlidersHorizontal size={18} />

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="Todos">Todos os status</option>
              <option value="Aguardando">Aguardando</option>
              <option value="Em andamento">
                Em andamento
              </option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>

          </div>

        </section>

        {/* LISTA */}

        <section className="listaMinhasOcorrencias">

          {ocorrenciasVisiveis.length === 0 && (

            <div className="nenhumaOcorrencia">

              <AlertCircle size={40} />

              <h3>Nenhuma ocorrência encontrada</h3>

              <p>
                Tente alterar o filtro ou realizar uma nova busca.
              </p>

            </div>

          )}

          {ocorrenciasVisiveis.map((ocorrencia) => {

            const aberto =
              expandido === ocorrencia.id;

            return (

              <article
                key={ocorrencia.id}
                className={`ocorrenciaCard ${
                  aberto ? "ocorrenciaCardAberto" : ""
                }`}
              >

                {/* CABEÇALHO */}

                <button
                  className="ocorrenciaCabecalho"
                  onClick={() =>
                    setExpandido(
                      aberto ? null : ocorrencia.id
                    )
                  }
                >

                  <div
                    className={`ocorrenciaIcone ${getStatusClass(
                      ocorrencia.status
                    )}`}
                  >
                    {getStatusIcon(ocorrencia.status)}
                  </div>

                  <div className="ocorrenciaResumo">

                    <div className="ocorrenciaTituloLinha">

                      <h3>
                        {ocorrencia.tipo}
                      </h3>

                      <span
                        className={`statusBadge ${getStatusClass(
                          ocorrencia.status
                        )}`}
                      >
                        {ocorrencia.status}
                      </span>

                    </div>

                    <div className="ocorrenciaMeta">

                      <span>
                        {ocorrencia.protocolo}
                      </span>

                      <span>
                        {ocorrencia.data}
                      </span>

                    </div>

                  </div>

                  {aberto ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}

                </button>

                {/* DETALHES */}

                {aberto && (

                  <div className="ocorrenciaDetalhes">

                    <div className="detalhesGrid">

                      <div className="detalheItem">

                        <MapPin size={17} />

                        <span>
                          {ocorrencia.endereco}
                        </span>

                      </div>

                      <div className="detalheItem">

                        <Tag size={17} />

                        <span>
                          Urgência:{" "}
                          <strong>
                            {ocorrencia.urgencia}
                          </strong>
                        </span>

                      </div>

                      <div className="detalheItem">

                        <Calendar size={17} />

                        <span>
                          Registrada em{" "}
                          {ocorrencia.data}
                        </span>

                      </div>

                    </div>

                    <div className="descricaoOcorrencia">

                      <strong>Descrição</strong>

                      <p>
                        {ocorrencia.descricao}
                      </p>

                    </div>

                    {/* AÇÕES */}

                    {(podeEditar(ocorrencia.status) ||
                      podeCancelar(ocorrencia.status)) && (

                      <div className="acoesOcorrencia">

                        {podeEditar(ocorrencia.status) && (

                          <button
                            className="editarButton"
                            onClick={() =>
                              abrirEdicao(ocorrencia)
                            }
                          >
                            <Pencil size={16} />
                            Editar
                          </button>

                        )}

                        {podeCancelar(ocorrencia.status) && (

                          <button
                            className="cancelarButton"
                            onClick={() =>
                              setCancelando(ocorrencia)
                            }
                          >
                            <Trash2 size={16} />
                            Cancelar
                          </button>

                        )}

                      </div>

                    )}

                    {ocorrencia.status === "Concluído" && (

                      <div className="mensagemConcluida">

                        <CheckCircle2 size={16} />

                        Ocorrência encerrada com sucesso.

                      </div>

                    )}

                    {ocorrencia.status === "Cancelado" && (

                      <div className="mensagemCancelada">

                        <X size={16} />

                        Esta ocorrência foi cancelada.

                      </div>

                    )}

                  </div>

                )}

              </article>

            );
          })}

        </section>

      </main>

      {/* MODAL EDITAR */}

      {editando && (

        <div className="modalOverlay">

          <div className="modalOcorrencia">

            <div className="modalCabecalho">

              <h3>Editar Ocorrência</h3>

              <button
                onClick={() => setEditando(null)}
              >
                <X size={20} />
              </button>

            </div>

            <div className="modalConteudo">

              <label>
                Tipo de ocorrência

                <select
                  value={editForm.tipo}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      tipo: e.target.value,
                    })
                  }
                >
                  <option>Buraco na via</option>
                  <option>Iluminação pública</option>
                  <option>Semáforo quebrado</option>
                  <option>Calçada danificada</option>
                  <option>Esgoto entupido</option>
                  <option>Lixo acumulado</option>
                  <option>Árvore caída</option>
                  <option>Sinalização danificada</option>
                  <option>Outro</option>
                </select>

              </label>

              <label>
                Endereço

                <input
                  value={editForm.endereco || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      endereco: e.target.value,
                    })
                  }
                />

              </label>

              <label>
                Descrição

                <textarea
                  rows="4"
                  value={editForm.descricao || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      descricao: e.target.value,
                    })
                  }
                />

              </label>

              <label>
                Urgência

                <select
                  value={editForm.urgencia}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      urgencia: e.target.value,
                    })
                  }
                >
                  <option>Baixa</option>
                  <option>Média</option>
                  <option>Alta</option>
                  <option>Urgente</option>
                </select>

              </label>

            </div>

            <div className="modalAcoes">

              <button
                className="modalCancelar"
                onClick={() => setEditando(null)}
              >
                Voltar
              </button>

              <button
                className="modalSalvar"
                onClick={salvarEdicao}
              >
                Salvar alterações
              </button>

            </div>

          </div>

        </div>

      )}

      {/* MODAL CANCELAR */}

      {cancelando && (

        <div className="modalOverlay">

          <div className="modalConfirmacao">

            <div className="iconeConfirmacao">
              <Trash2 size={28} />
            </div>

            <h3>
              Cancelar ocorrência?
            </h3>

            <p>
              A ocorrência{" "}
              <strong>
                #{cancelando.protocolo}
              </strong>{" "}
              será marcada como cancelada.
            </p>

            <div className="modalAcoes">

              <button
                className="modalCancelar"
                onClick={() => setCancelando(null)}
              >
                Manter ocorrência
              </button>

              <button
                className="modalExcluir"
                onClick={confirmarCancelamento}
              >
                Confirmar cancelamento
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default MinhasOcorrencias;