import { useState } from "react";
import {
  Building2,
  LogOut,
  ArrowLeft,
  MapPin,
  AlertCircle,
  Filter,
  X,
  Clock,
  CheckCircle2,
  Flame,
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


// =====================================================
// CENTRO DE SANTA CRUZ DOS MILAGRES
// =====================================================

const CENTRO = [
  -5.804537713240668,
  -41.95461325125385,
];


// =====================================================
// OCORRÊNCIAS DE EXEMPLO
// =====================================================

const OCORRENCIAS = [
  {
    id: "001",
    tipo: "Buraco na via",
    endereco: "Região central",
    status: "Em andamento",
    urgencia: "Alta",
    data: "20/01/2026",
    descricao:
      "Buraco de aproximadamente 1 metro de diâmetro na via, causando dificuldade para a passagem de veículos.",
    posicao: [-5.8039, -41.9551],
  },

  {
    id: "002",
    tipo: "Iluminação pública",
    endereco: "Região central",
    status: "Aguardando",
    urgencia: "Média",
    data: "18/01/2026",
    descricao:
      "Poste de iluminação pública apagado há vários dias, deixando o trecho sem iluminação durante a noite.",
    posicao: [-5.8052, -41.9539],
  },

  {
    id: "003",
    tipo: "Lixo acumulado",
    endereco: "Região central",
    status: "Urgente",
    urgencia: "Urgente",
    data: "21/01/2026",
    descricao:
      "Acúmulo de lixo e entulho na lateral da via, prejudicando a circulação de pedestres.",
    posicao: [-5.8057, -41.9548],
  },

  {
    id: "004",
    tipo: "Calçada danificada",
    endereco: "Região central",
    status: "Concluído",
    urgencia: "Baixa",
    data: "15/01/2026",
    descricao:
      "Trecho da calçada apresentava danos, dificultando a passagem de pedestres.",
    posicao: [-5.8046, -41.9540],
  },

  {
    id: "005",
    tipo: "Árvore caída",
    endereco: "Região central",
    status: "Em andamento",
    urgencia: "Alta",
    data: "20/01/2026",
    descricao:
      "Árvore caída parcialmente sobre a calçada, dificultando a passagem de pedestres.",
    posicao: [-5.8035, -41.9544],
  },

  {
    id: "006",
    tipo: "Sinalização danificada",
    endereco: "Região central",
    status: "Aguardando",
    urgencia: "Média",
    data: "19/01/2026",
    descricao:
      "Placa de sinalização danificada e com pouca visibilidade para motoristas.",
    posicao: [-5.8060, -41.9554],
  },
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


// =====================================================
// FILTROS
// =====================================================

const FILTROS = [
  "Todos",
  "Urgente",
  "Em andamento",
  "Aguardando",
  "Concluído",
];


// =====================================================
// ÍCONE PERSONALIZADO DO LEAFLET
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

function MapaOcorrencias({
  onVoltar,
  onLogout,
  userName = "Usuário",
}) {

  const [filtro, setFiltro] = useState("Todos");

  const [selecionada, setSelecionada] = useState(null);


  // ===================================================
  // FILTRAR OCORRÊNCIAS
  // ===================================================

  const visiveis = OCORRENCIAS.filter((ocorrencia) => {

    if (filtro === "Todos") {
      return true;
    }

    return ocorrencia.status === filtro;

  });


  // ===================================================
  // SELECIONAR OCORRÊNCIA
  // ===================================================

  function selecionarOcorrencia(ocorrencia) {

    if (selecionada?.id === ocorrencia.id) {

      setSelecionada(null);

    } else {

      setSelecionada(ocorrencia);

    }

  }


  return (

    <div className="mapa-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <header className="mapa-header">

        <div className="header-esquerda">

          <div className="logo-prefeitura">

            <Building2 size={24} />

          </div>

          <div>

            <h1>
              Sistema de Infraestrutura
            </h1>

            <p>
              Prefeitura Municipal de Santa Cruz dos Milagres
            </p>

          </div>

        </div>


        <div className="header-direita">

          <div className="usuario">

            <strong>
              {userName}
            </strong>

            <span>
              Cidadão
            </span>

          </div>


          <button
            className="botao-sair"
            onClick={onLogout}
          >

            <LogOut size={17} />

            <span>
              Sair
            </span>

          </button>

        </div>

      </header>


      {/* =================================================
          BARRA DE FILTROS
      ================================================= */}

      <div className="barra-filtros">


        <button
          className="botao-voltar"
          onClick={onVoltar}
        >

          <ArrowLeft size={17} />

          Voltar ao painel

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
                ? OCORRENCIAS.length
                : OCORRENCIAS.filter(
                    (ocorrencia) =>
                      ocorrencia.status === item
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


      {/* =================================================
          CONTEÚDO PRINCIPAL
      ================================================= */}

      <main className="mapa-conteudo">


        {/* =================================================
            MAPA
        ================================================= */}

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


            {visiveis.map((ocorrencia) => {

              const config =
                STATUS_CONFIG[ocorrencia.status];

              const ativo =
                selecionada?.id === ocorrencia.id;


              return (

                <Marker
                  key={ocorrencia.id}
                  position={ocorrencia.posicao}
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
                            #{ocorrencia.id} —{" "}
                            {ocorrencia.tipo}
                          </strong>

                          <span>
                            {ocorrencia.endereco}
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

                          {ocorrencia.status}

                        </span>

                        <span className="popup-data">

                          {ocorrencia.data}

                        </span>

                      </div>

                    </div>

                  </Popup>

                </Marker>

              );

            })}

          </MapContainer>


          {/* =================================================
              CONTADOR
          ================================================= */}

          <div className="contador-mapa">

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


          {/* =================================================
              LEGENDA
          ================================================= */}

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


        {/* =================================================
            SIDEBAR
        ================================================= */}

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


            {visiveis.map((ocorrencia) => {

              const config =
                STATUS_CONFIG[ocorrencia.status];

              const Icone =
                config.Icone;

              const ativo =
                selecionada?.id === ocorrencia.id;


              return (

                <button
                  key={ocorrencia.id}
                  className={
                    ativo
                      ? "ocorrencia-item selecionada"
                      : "ocorrencia-item"
                  }
                  onClick={() =>
                    selecionarOcorrencia(
                      ocorrencia
                    )
                  }
                >

                  <div
                    className="ocorrencia-icone"
                    style={{
                      backgroundColor:
                        `${config.cor}15`,
                      color: config.cor,
                    }}
                  >

                    <Icone size={17} />

                  </div>


                  <div className="ocorrencia-info">

                    <strong>

                      #{ocorrencia.id} —{" "}
                      {ocorrencia.tipo}

                    </strong>


                    <span className="endereco">

                      {ocorrencia.endereco}

                    </span>


                    <div className="ocorrencia-detalhes">

                      <span
                        className={`badge ${config.classe}`}
                      >

                        {ocorrencia.status}

                      </span>


                      <span className="data">

                        {ocorrencia.data}

                      </span>

                    </div>

                  </div>

                </button>

              );

            })}


            {visiveis.length === 0 && (

              <div className="nenhuma-ocorrencia">

                <MapPin
                  size={42}
                  strokeWidth={1.5}
                />

                <strong>
                  Nenhuma ocorrência
                </strong>

                <span>
                  Nenhum registro com o filtro selecionado.
                </span>

              </div>

            )}

          </div>

        </aside>

      </main>

    </div>

  );
}


export default MapaOcorrencias;