import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

import {
  ArrowLeft,
  MapPin,
  AlertCircle,
  Filter,
  Clock,
  CheckCircle2,
  Flame,
  RefreshCw,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "../styles/mapaOcorrencias.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// CENTRO DE SANTA CRUZ DOS MILAGRES

const CENTRO = [
  -5.804537713240668,
  -41.95461325125385,
];


// CONFIGURAÇÃO DOS STATUS

const STATUS_CONFIG = {
  Urgente: {
    cor: "#ef4444",
    classe: "status-urgente",
    Icone: Flame,
  },

  "Em andamento": {
    cor: "#3b82f6",
    classe: "status-andamento",
    Icone: Clock,
  },

  Aguardando: {
    cor: "#f97316",
    classe: "status-aguardando",
    Icone: AlertCircle,
  },

  Concluído: {
    cor: "#22c55e",
    classe: "status-concluido",
    Icone: CheckCircle2,
  },
};


// FILTROS

const FILTROS = [
  "Todos",
  "Urgente",
  "Em andamento",
  "Aguardando",
  "Concluído",
];


// ÍCONE PERSONALIZADO DO LEAFLET

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


// COMPONENTE

function MapaOcorrencias({
  onVoltar,
  onLogout,
  userName = "Usuário",
  token,
}) {

  const [filtro, setFiltro] = useState("Todos");
  const [selecionada, setSelecionada] = useState(null);
  const [ocorrencias, setOcorrencias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizacao, setAtualizacao] = useState(0);
  useEffect(() => {
    async function carregarOcorrencias() {
      if (!token) {
        setErro("Faça login para consultar as ocorrências.");
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
          throw new Error("A API retornou um formato inesperado.");
        }

        setOcorrencias(dados);
      } catch (erro) {
        console.error("Erro ao carregar ocorrências:", erro);
        setErro(
          erro.message || "Não foi possível carregar as ocorrências."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarOcorrencias();
  }, [token, atualizacao]);

  function normalizarStatus(status) {
    const valor = (status || "").toLowerCase().trim();

    if (["pendente", "aguardando"].includes(valor)) {
      return "Aguardando";
    }

    if (["em andamento", "em_andamento"].includes(valor)) {
      return "Em andamento";
    }

    if (
      ["resolvida", "resolvido", "concluída", "concluida",
        "concluído", "concluido"].includes(valor)
    ) {
      return "Concluído";
    }

    return status || "Aguardando";
  }

  function normalizarPrioridade(prioridade) {
    return (prioridade || "baixa")
      .toLowerCase()
      .trim();
  }

  function obterStatusExibido(ocorrencia) {
    if (normalizarPrioridade(ocorrencia.prioridade) === "urgente") {
      return "Urgente";
    }

    return normalizarStatus(ocorrencia.status);
  }

  function obterPosicao(ocorrencia) {
    const latitude = Number(ocorrencia.latitude);
    const longitude = Number(ocorrencia.longitude);

    if (
      ocorrencia.latitude === null ||
      ocorrencia.latitude === undefined ||
      ocorrencia.latitude === "" ||
      ocorrencia.longitude === null ||
      ocorrencia.longitude === undefined ||
      ocorrencia.longitude === "" ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180 ||
      (latitude === 0 && longitude === 0)
    ) {
      return null;
    }

    return [latitude, longitude];
  }

  function formatarData(data) {
    if (!data) return "Data não informada";

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
      return "Data não informada";
    }

    return dataConvertida.toLocaleDateString("pt-BR");
  }

  // FILTRAR OCORRÊNCIAS

  const visiveis = ocorrencias.filter((ocorrencia) => {
    if (filtro === "Todos") return true;

    return obterStatusExibido(ocorrencia) === filtro;
  });

  const ocorrenciasNoMapa = visiveis.filter(
    (ocorrencia) => obterPosicao(ocorrencia) !== null
  );


  // SELECIONAR OCORRÊNCIA

  function selecionarOcorrencia(ocorrencia) {

    if (selecionada?.id === ocorrencia.id) {

      setSelecionada(null);

    } else {

      setSelecionada(ocorrencia);

    }

  }


  return (

    <div className="mapa-page">

      {/* BARRA DE FILTROS */}

      <div className="barra-filtros">


        <button
          className="botao-voltar"
          onClick={onVoltar}
        >

          <ArrowLeft size={17} />

          Voltar ao painel

        </button>
        <button
          type="button"
          className="botao-voltar"
          onClick={() => setAtualizacao((valor) => valor + 1)}
          disabled={carregando}
          title="Buscar ocorrências atualizadas"
        >
          <RefreshCw size={17} />
          {carregando ? "Atualizando..." : "Atualizar mapa"}
        </button>

        <span className="separador">
          |
        </span>


        <div className="filtros">

          <Filter
            size={17}
            className="icone-filtro"
          />


          {FILTROS.map((item) => {

            const quantidade =
              item === "Todos"
                ? ocorrencias.length
                : ocorrencias.filter(
                  (ocorrencia) =>
                    obterStatusExibido(ocorrencia) === item
                ).length;


            return (

              <button
                key={item}
                className={
                  filtro === item
                    ? "filtro ativo"
                    : "filtro"
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


      {/* CONTEÚDO PRINCIPAL */}

      <main className="mapa-conteudo">


        {/* MAPA */}

        <section className="mapa-area">


          <MapContainer
            center={CENTRO}
            zoom={16}
            scrollWheelZoom={true}
            className="leaflet-mapa"
          >

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup
              chunkedLoading
              spiderfyOnMaxZoom
              showCoverageOnHover={false}
            >
              {ocorrenciasNoMapa.map((ocorrencia) => {
                const statusExibido = obterStatusExibido(ocorrencia);

                const config =
                  STATUS_CONFIG[statusExibido] ||
                  STATUS_CONFIG["Aguardando"];

                const ativo = selecionada?.id === ocorrencia.id;

                return (

                  <Marker
                    key={ocorrencia.id}
                    position={obterPosicao(ocorrencia)}
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

                      <div className="popup-ocorrencia">

                        <div className="popup-topo">

                          <div
                            className="popup-icone"
                            style={{
                              backgroundColor:
                                `${config.cor}20`,
                              color: config.cor,
                            }}
                          >

                            <MapPin size={20} />

                          </div>


                          <div className="popup-titulo">

                            <strong>
                              #{ocorrencia.protocolo || ocorrencia.id} —{" "}
                              {ocorrencia.categoria}
                            </strong>

                            <span>
                              {[ocorrencia.bairro, ocorrencia.endereco]
                                .filter(Boolean)
                                .join(" - ")}
                            </span>

                          </div>

                        </div>


                        <p className="popup-descricao">

                          {ocorrencia.descricao}

                        </p>


                        <div className="popup-rodape">

                          <span
                            className={`badge ${config.classe}`}
                          >

                            {statusExibido}

                          </span>

                          <span className="popup-data">

                            {formatarData(ocorrencia.criado_em)}

                          </span>

                        </div>

                      </div>

                    </Popup>

                  </Marker>

                );

              })}
            </MarkerClusterGroup>
          </MapContainer>


          {/* CONTADOR */}

          <div className="contador-mapa">

            <span>
              Exibindo
            </span>

            <strong>
              {ocorrenciasNoMapa.length}
            </strong>

            <small>
              ocorrência
              {visiveis.length !== 1
                ? "s"
                : ""}
            </small>

          </div>


          {/* LEGENDA */}

          <div className="legenda">

            <strong>
              Legenda
            </strong>


            {[
              "Urgente",
              "Em andamento",
              "Aguardando",
              "Concluído",
            ].map((status) => {

              const config =
                STATUS_CONFIG[status];


              return (

                <div
                  className="item-legenda"
                  key={status}
                >

                  <span
                    className="bolinha-legenda"
                    style={{
                      backgroundColor:
                        config.cor,
                    }}
                  />

                  <span>
                    {status}
                  </span>

                </div>

              );

            })}

          </div>

        </section>


        {/* SIDEBAR */}

        <aside className="sidebar-ocorrencias">


          <div className="sidebar-header">

            <h2>

              {filtro === "Todos"
                ? "Todas as ocorrências"
                : filtro}

            </h2>

            <span>

              {visiveis.length} registro
              {visiveis.length !== 1
                ? "s"
                : ""}

            </span>

          </div>

          <div className="lista-ocorrencias">
            {carregando ? (
              <p>Carregando ocorrências...</p>
            ) : erro ? (
              <p role="alert">{erro}</p>
            ) : visiveis.length === 0 ? (
              <div className="nenhuma-ocorrencia">
                <MapPin size={42} strokeWidth={1.5} />

                <strong>Nenhuma ocorrência</strong>

                <span>
                  Nenhum registro com o filtro selecionado.
                </span>
              </div>
            ) : (
              visiveis.map((ocorrencia) => {
                const statusExibido = obterStatusExibido(ocorrencia);

                const config =
                  STATUS_CONFIG[statusExibido] ||
                  STATUS_CONFIG["Aguardando"];

                const Icone = config.Icone;

                const ativo = selecionada?.id === ocorrencia.id;

                return (
                  <button
                    key={ocorrencia.id}
                    className={
                      ativo
                        ? "ocorrencia-item selecionada"
                        : "ocorrencia-item"
                    }
                    onClick={() => selecionarOcorrencia(ocorrencia)}
                  >
                    <div
                      className="ocorrencia-icone"
                      style={{
                        backgroundColor: `${config.cor}15`,
                        color: config.cor,
                      }}
                    >
                      <Icone size={17} />
                    </div>

                    <div className="ocorrencia-info">
                      <strong>
                        #{ocorrencia.protocolo || ocorrencia.id} —{" "}
                        {ocorrencia.categoria}
                      </strong>

                      <span className="endereco">
                        {[ocorrencia.bairro, ocorrencia.endereco]
                          .filter(Boolean)
                          .join(" — ")}
                      </span>

                      <div className="ocorrencia-detalhes">
                        <span className={`badge ${config.classe}`}>
                          {statusExibido}
                        </span>

                        <span className="data">
                          {formatarData(ocorrencia.criado_em)}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </aside>

      </main>

    </div>

  );
}


export default MapaOcorrencias;