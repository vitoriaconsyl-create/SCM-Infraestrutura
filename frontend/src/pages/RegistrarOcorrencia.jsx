import { useState, useRef } from "react";
import Header from "../components/Header.jsx";

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

import "../styles/registrarOcorrencia.css";

function RegistrarOcorrencia({
  onVoltar,
  onLogout,
  userName
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
    complemento: "",
    descricao: "",
    urgencia: "",
  });

  const [errors, setErrors] = useState({});

  const [image, setImage] = useState(null);

  const [imageName, setImageName] = useState("");

  const [gpsLoading, setGpsLoading] = useState(false);

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
    setGpsLoading(true);

    if (!navigator.geolocation) {
      atualizarCampo(
        "endereco",
        "Rua das Flores, 142 - Centro"
      );
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        atualizarCampo(
          "endereco",
          "Rua das Flores, 142 - Centro (GPS)"
        );
        setGpsLoading(false);
      },
      () => {
        atualizarCampo(
          "endereco",
          "Rua das Flores, 142 - Centro"
        );
        setGpsLoading(false);
      }
    );
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

    if (form.descricao.length < 20)
      novo.descricao =
        "Descrição deve ter pelo menos 20 caracteres.";

    if (!form.urgencia)
      novo.urgencia = "Selecione a urgência.";

    setErrors(novo);

    return Object.keys(novo).length === 0;
  }

  function enviar(e) {
    e.preventDefault();

    if (!validar()) return;

    const numero =
      Math.floor(Math.random() * 90000) + 10000;

    setProtocol(`SCM-${numero}`);

    setSubmitted(true);
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
      complemento: "",
      descricao: "",
      urgencia: "",
    });
  }

  return (
    <div className="registrar-page">

      <Header
        userName={userName}
        onLogout={onLogout}
      />

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
                      className={`tipo-card ${
                        form.tipo === tipo.value ? "selected" : ""
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

                    GPS

                  </button>

                </div>

                {errors.endereco && (

                  <p className="error">

                    <AlertCircle size={16} />

                    {errors.endereco}

                  </p>

                )}

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
                        className={`urgencia-card ${
                          form.urgencia === item.value
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

    </div>

  );

}

export default RegistrarOcorrencia;