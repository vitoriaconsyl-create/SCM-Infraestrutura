import { useState, useRef } from "react";
import { apiRequest } from "../services/api";

import {
  ArrowLeft,
  MapPin,
  Image as ImageIcon,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  TriangleAlert,
  Zap,
  Flame,
  Info,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  useMapEvents,
} from "react-leaflet";

import "../styles/registrarOcorrencia.css";


function CapturarCliqueMapa({ onSelecionar }) {
  useMapEvents({
    click(evento) {
      onSelecionar({
        latitude: evento.latlng.lat,
        longitude: evento.latlng.lng,
      });
    },
  });

  return null;
}

function RegistrarOcorrencia({
  onVoltar,
  onLogout,
  userName,
  token
}) {

  const TIPOS = [
    { value: "buraco", label: "Buraco na via", icon: "🕳️" },
    { value: "iluminacao", label: "Iluminação pública", icon: "💡" },
    { value: "semaforo", label: "Semáforo quebrado", icon: "🚦" },
    { value: "calcada", label: "Calçada danificada", icon: "🧱" },
    { value: "esgoto", label: "Esgoto entupido", icon: "🚧" },
    { value: "lixo", label: "Lixo acumulado", icon: "🗑️" },
    { value: "arvore", label: "Árvore caída", icon: "🌳" },
    { value: "sinalizacao", label: "Sinalização danificada", icon: "⚠️" },
    { value: "outro", label: "Outro", icon: "📋" },
  ];

  const URGENCIAS = [
    {
      value: "baixa",
      label: "Baixa",
      desc: "Sem risco imediato",
      icon: Info,
      classe: "baixa",
    },
    {
      value: "media",
      label: "Média",
      desc: "Impacta o tráfego",
      icon: TriangleAlert,
      classe: "media",
    },
    {
      value: "alta",
      label: "Alta",
      desc: "Risco à população",
      icon: Zap,
      classe: "alta",
    },
    {
      value: "urgente",
      label: "Urgente",
      desc: "Perigo imediato",
      icon: Flame,
      classe: "urgente",
    },
  ];

  const [form, setForm] = useState({
    tipo: "",
    endereco: "",
    bairro: "",
    complemento: "",
    descricao: "",
    urgencia: "",
    latitude: null,
    longitude: null,
  });

  const [errors, setErrors] = useState({});

  const [image, setImage] = useState(null);

  const [imageName, setImageName] = useState("");

  const [gpsLoading, setGpsLoading] = useState(false);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [protocol, setProtocol] = useState("");

  const fileRef = useRef(null);

  function atualizarCampo(campo, valor) {
    setForm((old) => ({
      ...old,
      [campo]: valor,
    }));

    if (errors[campo]) {
      setErrors((old) => ({
        ...old,
        [campo]: "",
      }));
    }
  }

  function usarGPS() {
    setLocalSelecionado(
      form.latitude !== null && form.longitude !== null
        ? {
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        }
        : null
    );

    setMostrarMapa(true);
  }

  function selecionarImagem(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Imagem maior que 5MB.");
      return;
    }

    setImageName(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function validar() {
    const novo = {};

    if (!form.tipo)
      novo.tipo = "Selecione o tipo.";

    if (!form.endereco)
      novo.endereco = "Informe o endereço.";

    if (!form.bairro)
      novo.bairro = "Informe o bairro.";

    if (form.descricao.length < 20)
      novo.descricao =
        "Descrição deve ter pelo menos 20 caracteres.";

    if (!form.urgencia)
      novo.urgencia = "Selecione a urgência.";

    setErrors(novo);

    return Object.keys(novo).length === 0;
  }

  async function enviar(e) {
    e.preventDefault();

    if (!validar()) return;

    if (!token) {
      alert("Sua sessão expirou. Faça login novamente.");
      return;
    }

    try {
      const dados = await apiRequest(
        "/ocorrencias",
        {
          method: "POST",
          body: JSON.stringify({
            descricao: form.descricao.trim(),
            categoria: form.tipo,
            endereco: form.endereco.trim(),
            bairro: form.bairro.trim(),
            complemento: form.complemento.trim() || null,
            latitude: form.latitude ?? null,
            longitude: form.longitude ?? null,
            imagem: image || null,
            prioridade: form.urgencia
          })
        },
        token
      );

      if (!dados?.protocolo) {
        throw new Error(
          "A ocorrência foi enviada mas o protocolo não foi retornado pela API."
        );
      }

      setProtocol(dados.protocolo);
      setSubmitted(true);
    } catch (erro) {
      console.error("Erro ao cadastrar ocorrência", erro);

      alert(
        erro.message ||
        "Não foi possível cadastrar a ocorrência. Tente novamente."
      );
    }
  }

  function novaOcorrencia() {
    setSubmitted(false);

    setProtocol("");

    setImage(null);

    setImageName("");

    setErrors({});

    setForm({
      tipo: "",
      endereco: "",
      bairro: "",
      complemento: "",
      descricao: "",
      urgencia: "",
      latitude: null,
      longitude: null,
    });
  }

  return (
    <div className="registrar-page">

      <main className="registrar-main">

        <div className="breadcrumb">

          <button
            onClick={onVoltar}
            className="btn-voltar"
          >
            <ArrowLeft size={18} />
            Voltar ao painel
          </button>

        </div>

        {submitted ? (

          <section className="success-card">

            <div className="success-icon">
              <CheckCircle2 size={60} />
            </div>

            <h2>Ocorrência registrada com sucesso!</h2>

            <p>
              Sua solicitação foi enviada para análise da Prefeitura.
            </p>

            <div className="protocol-box">
              <span>Protocolo</span>

              <strong>{protocol}</strong>
            </div>

            <div className="success-buttons">

              <button
                className="btn-secondary"
                onClick={onVoltar}
              >
                Voltar ao painel
              </button>

              <button
                className="btn-primary"
                onClick={novaOcorrencia}
              >
                Registrar outra
              </button>

            </div>

          </section>

        ) : (

          <>

            <div className="page-title">

              <h2>Registrar Ocorrência</h2>

              <p>
                Preencha os dados abaixo para reportar um problema de infraestrutura.
              </p>

            </div>

            <form
              className="registrar-form"
              onSubmit={enviar}
            >

              {/* Tipo */}

              <section className="form-card">

                <h3>
                  1. Tipo de ocorrência
                </h3>

                <div className="tipos-grid">

                  {TIPOS.map((tipo) => (

                    <button
                      key={tipo.value}
                      type="button"
                      className={`tipo-card ${form.tipo === tipo.value ? "selected" : ""
                        }`}
                      onClick={() =>
                        atualizarCampo("tipo", tipo.value)
                      }
                    >

                      <span className="emoji">
                        {tipo.icon}
                      </span>

                      <span>
                        {tipo.label}
                      </span>

                    </button>

                  ))}

                </div>

                {errors.tipo && (

                  <p className="error">

                    <AlertCircle size={16} />

                    {errors.tipo}

                  </p>

                )}

              </section>

              {/* Localização */}

              <section className="form-card">

                <h3>
                  2. Localização
                </h3>

                <label>
                  Endereço
                </label>

                <div className="gps-row">

                  <input
                    type="text"
                    placeholder="Rua, número ou ponto de referência"
                    value={form.endereco}
                    onChange={(e) =>
                      atualizarCampo(
                        "endereco",
                        e.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="gps-button"
                    onClick={usarGPS}
                  >

                    {gpsLoading ? (
                      <Loader2
                        size={18}
                        className="spin"
                      />
                    ) : (
                      <MapPin size={18} />
                    )}

                    Escolher local

                  </button>

                </div>
                {form.latitude !== null && form.longitude !== null && (
                  <p className="localizacao-confirmada">
                    <CheckCircle2 size={16} />
                    Local selecionado: {Number(form.latitude).toFixed(6)},{" "}
                    {Number(form.longitude).toFixed(6)}
                  </p>
                )}
                {errors.endereco && (

                  <p className="error">

                    <AlertCircle size={16} />

                    {errors.endereco}

                  </p>

                )}
                <label>
                  Bairro
                </label>

                <input
                  type="text"
                  placeholder="Informe o bairro"
                  value={form.bairro}
                  onChange={(e) =>
                    atualizarCampo(
                      "bairro",
                      e.target.value
                    )
                  }
                />
                {
                  errors.bairro && (
                    <p className="error">
                      <AlertCircle size={16} />
                      {errors.bairro}
                    </p>
                  )
                }


                <label>
                  Complemento
                </label>

                <input
                  type="text"
                  placeholder="Opcional"
                  value={form.complemento}
                  onChange={(e) =>
                    atualizarCampo(
                      "complemento",
                      e.target.value
                    )
                  }
                />

              </section>

              {/* Descrição */}

              <section className="form-card">

                <h3>
                  3. Descrição
                </h3>

                <textarea
                  rows={6}
                  maxLength={500}
                  placeholder="Descreva detalhadamente o problema..."
                  value={form.descricao}
                  onChange={(e) =>
                    atualizarCampo(
                      "descricao",
                      e.target.value
                    )
                  }
                />

                <div className="textarea-footer">

                  {errors.descricao ? (

                    <p className="error">

                      <AlertCircle size={16} />

                      {errors.descricao}

                    </p>

                  ) : (

                    <span>
                      Mínimo de 20 caracteres
                    </span>

                  )}

                  <span>
                    {form.descricao.length}/500
                  </span>

                </div>

              </section>

              {/* Urgência */}

              <section className="form-card">

                <h3>
                  4. Nível de urgência
                </h3>

                <div className="urgencia-grid">

                  {URGENCIAS.map((item) => {

                    const Icon = item.icon;

                    return (

                      <button
                        key={item.value}
                        type="button"
                        className={`urgencia-card ${form.urgencia === item.value
                          ? item.classe
                          : ""
                          }`}
                        onClick={() =>
                          atualizarCampo(
                            "urgencia",
                            item.value
                          )
                        }
                      >

                        <Icon size={24} />

                        <strong>
                          {item.label}
                        </strong>

                        <small>
                          {item.desc}
                        </small>

                      </button>

                    );

                  })}

                </div>

                {errors.urgencia && (

                  <p className="error">

                    <AlertCircle size={16} />

                    {errors.urgencia}

                  </p>

                )}

              </section>

              {/* Foto */}

              <section className="form-card">

                <div className="foto-header">

                  <h3>
                    5. Foto do Local
                  </h3>

                  {image && (

                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => {
                        setImage(null);
                        setImageName("");
                      }}
                    >
                      <X size={16} />
                      Remover
                    </button>

                  )}

                </div>

                {!image ? (

                  <label
                    htmlFor="foto"
                    className="upload-area"
                  >

                    <ImageIcon size={42} />

                    <h4>
                      Clique para adicionar uma foto
                    </h4>

                    <p>
                      PNG, JPG ou JPEG • máximo 5 MB
                    </p>

                  </label>

                ) : (

                  <div className="preview-image">

                    <img
                      src={image}
                      alt="Preview"
                    />

                    <div className="preview-info">

                      <ImageIcon size={18} />

                      <span>{imageName}</span>

                    </div>

                  </div>

                )}

                <input
                  id="foto"
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={selecionarImagem}
                  hidden
                />

              </section>

              {/* Aviso */}

              <div className="info-box">

                <Info size={20} />

                <p>
                  Ao enviar esta ocorrência será gerado um número
                  de protocolo para acompanhamento.
                </p>

              </div>

              {/* Botões */}

              <div className="buttons-area">

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onVoltar}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  Enviar Ocorrência
                </button>

              </div>

            </form>

          </>

        )}

      </main>

      {mostrarMapa && (
        <div className="seletor-mapa-fundo">
          <section
            className="seletor-mapa-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-seletor-mapa"
          >
            <div className="seletor-mapa-cabecalho">
              <div>
                <h2 id="titulo-seletor-mapa">
                  Escolha o local da ocorrência
                </h2>
                <p>
                  Clique no mapa para marcar onde está o problema.
                </p>
              </div>

              <button
                type="button"
                className="seletor-mapa-fechar"
                onClick={() => setMostrarMapa(false)}
                aria-label="Fechar mapa"
              >
                <X size={22} />
              </button>
            </div>

            <MapContainer
              center={
                localSelecionado
                  ? [
                    localSelecionado.latitude,
                    localSelecionado.longitude,
                  ]
                  : [-5.8045377, -41.9546133]
              }
              zoom={16}
              scrollWheelZoom={true}
              className="seletor-mapa"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <CapturarCliqueMapa
                onSelecionar={setLocalSelecionado}
              />

              {localSelecionado && (
                <CircleMarker
                  center={[
                    localSelecionado.latitude,
                    localSelecionado.longitude,
                  ]}
                  radius={10}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 3,
                    fillColor: "#2563eb",
                    fillOpacity: 1,
                  }}
                />
              )}
            </MapContainer>

            <div className="seletor-mapa-rodape">
              {localSelecionado ? (
                <p>
                  Local selecionado:{" "}
                  {localSelecionado.latitude.toFixed(6)},{" "}
                  {localSelecionado.longitude.toFixed(6)}
                </p>
              ) : (
                <p>Nenhum local selecionado.</p>
              )}

              <div className="seletor-mapa-botoes">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setMostrarMapa(false)}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  disabled={!localSelecionado}
                  onClick={() => {
                    atualizarCampo(
                      "latitude",
                      localSelecionado.latitude
                    );

                    atualizarCampo(
                      "longitude",
                      localSelecionado.longitude
                    );

                    setMostrarMapa(false);
                  }}
                >
                  Confirmar local
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

    </div>

  );

}

export default RegistrarOcorrencia;