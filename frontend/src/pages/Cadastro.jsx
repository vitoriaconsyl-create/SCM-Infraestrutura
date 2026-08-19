import { useState } from "react";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

import "../styles/cadastro.css";

function formatCPF(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatTelefone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 10) {
    return digits.replace(
      /(\d{2})(\d{4})(\d{0,4})/,
      "($1) $2-$3"
    );
  }

  return digits.replace(
    /(\d{2})(\d{5})(\d{0,4})/,
    "($1) $2-$3"
  );
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateCPF(cpf) {
  return cpf.replace(/\D/g, "").length === 11;
}

function Cadastro({ onVoltar, onCadastroSucesso }) {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    bairro: "",
    senha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState({});

  const [showSenha, setShowSenha] = useState(false);

  const [showConfirmar, setShowConfirmar] = useState(false);

  const [sucesso, setSucesso] = useState(false);

  const [submitError, setSubmitError] = useState(false);

  const handleChange = (field, value) => {
    let formatted = value;

    if (field === "cpf") {
      formatted = formatCPF(value);
    }

    if (field === "telefone") {
      formatted = formatTelefone(value);
    }

    setForm((prev) => ({
      ...prev,
      [field]: formatted,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (
      !form.nome.trim() ||
      form.nome.trim().split(/\s+/).length < 2
    ) {
      newErrors.nome = "Informe nome e sobrenome.";
    }

    if (!validateCPF(form.cpf)) {
      newErrors.cpf =
        "CPF inválido. Digite os 11 dígitos.";
    }

    if (!validateEmail(form.email)) {
      newErrors.email = "E-mail inválido.";
    }

    if (
      form.telefone.replace(/\D/g, "").length < 10
    ) {
      newErrors.telefone = "Telefone inválido.";
    }

    if (!form.bairro.trim()) {
      newErrors.bairro =
        "Informe seu bairro ou endereço.";
    }

    if (form.senha.length < 8) {
      newErrors.senha =
        "A senha deve ter ao menos 8 caracteres.";
    }

    if (form.senha !== form.confirmarSenha) {
      newErrors.confirmarSenha =
        "As senhas não coincidem.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitError(false);

    if (validate()) {
      setSucesso(true);

      setTimeout(() => {
        if (onCadastroSucesso) {
          onCadastroSucesso();
        }
      }, 2500);
    } else {
      setSubmitError(true);
    }
  };

  return (
    <main className="cadastro-page">

      {/* Imagem de fundo */}

      <div className="cadastro-background" />

      {/* Overlay */}

      <div className="cadastro-overlay" />

      {/* Conteúdo */}

      <div className="cadastro-content">

        {/* Cabeçalho */}

        <header className="cadastro-header">

          <div className="cadastro-logo">
            <Building2
              size={32}
              strokeWidth={2}
            />
          </div>

          <h1>
            Sistema de Infraestrutura
          </h1>

          <p>
            Prefeitura Municipal de Santa Cruz dos Milagres
          </p>

        </header>

        {/* Card */}

        <section className="cadastro-card">

          <div className="cadastro-card-header">

            <div className="cadastro-title-row">

              <button
                type="button"
                className="back-button"
                onClick={onVoltar}
                aria-label="Voltar ao login"
              >
                <ArrowLeft size={20} />
              </button>

              <h2>
                Solicitar Cadastro
              </h2>

            </div>

            <p>
              Preencha os dados abaixo para solicitar
              acesso à plataforma
            </p>

          </div>

          {/* Sucesso */}

          {sucesso ? (

            <div className="cadastro-success">

              <div className="success-icon">

                <CheckCircle2 size={36} />

              </div>

              <div className="success-content">

                <p className="success-title">
                  Solicitação enviada!
                </p>

                <p className="success-description">
                  Seu cadastro será analisado pela
                  equipe da prefeitura. Você receberá
                  um e-mail de confirmação em breve.
                </p>

              </div>

              <p className="success-redirect">
                Redirecionando para o login...
              </p>

            </div>

          ) : (

            <form
              className="cadastro-form"
              onSubmit={handleSubmit}
            >

              {/* Erro geral */}

              {submitError && (

                <div className="cadastro-alert">

                  <AlertCircle size={16} />

                  <span>
                    Corrija os campos destacados
                    antes de continuar.
                  </span>

                </div>

              )}

              {/* Nome */}

              <div className="cadastro-field">

                <label htmlFor="nome">
                  Nome Completo
                </label>

                <div className="cadastro-input-wrapper">

                  <User
                    className="cadastro-input-icon"
                    size={16}
                  />

                  <input
                    id="nome"
                    type="text"
                    placeholder="João da Silva"
                    value={form.nome}
                    onChange={(event) =>
                      handleChange(
                        "nome",
                        event.target.value
                      )
                    }
                    className={
                      errors.nome
                        ? "input-error"
                        : ""
                    }
                  />

                </div>

                {errors.nome && (
                  <p className="field-error">
                    {errors.nome}
                  </p>
                )}

              </div>

              {/* CPF */}

              <div className="cadastro-field">

                <label htmlFor="cpf">
                  CPF
                </label>

                <div className="cadastro-input-wrapper">

                  <span className="cpf-icon">
                    ID
                  </span>

                  <input
                    id="cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={(event) =>
                      handleChange(
                        "cpf",
                        event.target.value
                      )
                    }
                    className={
                      errors.cpf
                        ? "input-error"
                        : ""
                    }
                  />

                </div>

                {errors.cpf && (
                  <p className="field-error">
                    {errors.cpf}
                  </p>
                )}

              </div>

              {/* E-mail */}

              <div className="cadastro-field">

                <label htmlFor="email">
                  E-mail
                </label>

                <div className="cadastro-input-wrapper">

                  <Mail
                    className="cadastro-input-icon"
                    size={16}
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="seuemail@gmail.com"
                    value={form.email}
                    onChange={(event) =>
                      handleChange(
                        "email",
                        event.target.value
                      )
                    }
                    className={
                      errors.email
                        ? "input-error"
                        : ""
                    }
                  />

                </div>

                {errors.email && (
                  <p className="field-error">
                    {errors.email}
                  </p>
                )}

              </div>

              {/* Telefone */}

              <div className="cadastro-field">

                <label htmlFor="telefone">
                  Telefone / WhatsApp
                </label>

                <div className="cadastro-input-wrapper">

                  <Phone
                    className="cadastro-input-icon"
                    size={16}
                  />

                  <input
                    id="telefone"
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={form.telefone}
                    onChange={(event) =>
                      handleChange(
                        "telefone",
                        event.target.value
                      )
                    }
                    className={
                      errors.telefone
                        ? "input-error"
                        : ""
                    }
                  />

                </div>

                {errors.telefone && (
                  <p className="field-error">
                    {errors.telefone}
                  </p>
                )}

              </div>

              {/* Bairro */}

              <div className="cadastro-field">

                <label htmlFor="bairro">
                  Bairro / Localidade
                </label>

                <div className="cadastro-input-wrapper">

                  <MapPin
                    className="cadastro-input-icon"
                    size={16}
                  />

                  <input
                    id="bairro"
                    type="text"
                    placeholder="Ex.: Centro"
                    value={form.bairro}
                    onChange={(event) =>
                      handleChange(
                        "bairro",
                        event.target.value
                      )
                    }
                    className={
                      errors.bairro
                        ? "input-error"
                        : ""
                    }
                  />

                </div>

                {errors.bairro && (
                  <p className="field-error">
                    {errors.bairro}
                  </p>
                )}

              </div>

              {/* Senha */}

              <div className="cadastro-field">

                <label htmlFor="senha">
                  Senha
                </label>

                <div className="cadastro-input-wrapper">

                  <Lock
                    className="cadastro-input-icon"
                    size={16}
                  />

                  <input
                    id="senha"
                    type={
                      showSenha
                        ? "text"
                        : "password"
                    }
                    placeholder="Mínimo 8 caracteres"
                    value={form.senha}
                    onChange={(event) =>
                      handleChange(
                        "senha",
                        event.target.value
                      )
                    }
                    className={
                      errors.senha
                        ? "input-error password-input"
                        : "password-input"
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowSenha((value) => !value)
                    }
                    tabIndex={-1}
                    aria-label={
                      showSenha
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {showSenha ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

                {errors.senha && (
                  <p className="field-error">
                    {errors.senha}
                  </p>
                )}

              </div>

              {/* Confirmar senha */}

              <div className="cadastro-field">

                <label htmlFor="confirmarSenha">
                  Confirmar Senha
                </label>

                <div className="cadastro-input-wrapper">

                  <Lock
                    className="cadastro-input-icon"
                    size={16}
                  />

                  <input
                    id="confirmarSenha"
                    type={
                      showConfirmar
                        ? "text"
                        : "password"
                    }
                    placeholder="Repita a senha"
                    value={form.confirmarSenha}
                    onChange={(event) =>
                      handleChange(
                        "confirmarSenha",
                        event.target.value
                      )
                    }
                    className={
                      errors.confirmarSenha
                        ? "input-error password-input"
                        : "password-input"
                    }
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowConfirmar(
                        (value) => !value
                      )
                    }
                    tabIndex={-1}
                    aria-label={
                      showConfirmar
                        ? "Ocultar senha"
                        : "Mostrar senha"
                    }
                  >
                    {showConfirmar ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

                {errors.confirmarSenha && (
                  <p className="field-error">
                    {errors.confirmarSenha}
                  </p>
                )}

              </div>

              {/* Botão */}

              <button
                type="submit"
                className="cadastro-submit"
              >
                Enviar Solicitação
              </button>

              {/* Login */}

              <p className="cadastro-login-link">

                Já tem cadastro?{" "}

                <button
                  type="button"
                  onClick={onVoltar}
                >
                  Fazer login
                </button>

              </p>

            </form>

          )}

        </section>

        {/* Rodapé */}

        <footer className="cadastro-footer">

          <p>
            © 2026 Prefeitura Municipal de
            Santa Cruz dos Milagres
          </p>

          <p>
            Sistema de Gestão de Infraestrutura Urbana
          </p>

        </footer>

      </div>

    </main>
  );
}

export default Cadastro;