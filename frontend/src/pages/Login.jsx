import { useState } from "react";
import {
  Building2,
  Lock,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

import "../styles/login.css";
import fundo from "../assets/scm.jpg";
import { apiRequest } from "../services/api";

function Login({ onLogin, onSolicitarCadastro }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    setShowAlert(false);
    setErrorMessage("");

    if (!email.trim() || !password) {
      setShowAlert(true);
      return;
    }

    try {
      setLoading(true);

      const dados = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          senha: password,
        }),
      });
      const tipoUsuario = String(
        dados.usuario.tipo
      ).trim().toLowerCase();

      if (
        tipoUsuario !== "admin" &&
        tipoUsuario !== "administrador" &&
        tipoUsuario !== "cidadao"
      ) {
        throw new Error(
          "O perfil deste usuário não é reconhecido pelo sistema."
        );
      }

      onLogin(dados.usuario, dados.token);
      const perfilReal =
        tipoUsuario === "admin" ||
          tipoUsuario === "administrador"
          ? "admin"
          : tipoUsuario === "cidadao"
            ? "cidadao"
            : null;

      if (!perfilReal) {
        throw new Error(
          "O perfil deste usuário não é reconhecido pelo sistema."
        );
      }

      onLogin(dados.usuario, dados.token);
    } catch (erro) {
      setErrorMessage(
        erro.message || "Não foi possível realizar o login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      {/* Imagem de fundo */}
      <div
        className="login-background"
        style={{
          backgroundImage: `url(${fundo})`,
        }}
      />

      {/* Overlay escuro */}
      <div className="login-overlay" />

      {/* Conteúdo principal */}
      <div className="login-content">

        {/* Cabeçalho */}
        <header className="login-header">

          <div className="login-logo">
            <Building2 size={32} strokeWidth={2} />
          </div>

          <h1>Sistema de Infraestrutura</h1>

          <p>
            Prefeitura Municipal de Santa Cruz dos Milagres
          </p>

        </header>

        {/* Card */}
        <section className="login-card">

          <div className="login-card-header">
            <h2>Acesso ao Sistema</h2>

            <p>
              Digite suas credenciais para acessar a plataforma
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* Alerta */}
            {showAlert && (
              <div className="login-alert">
                <AlertCircle size={16} />

                <span>
                  Por favor, preencha todos os campos.
                </span>
              </div>
            )}

            {errorMessage && (
              <div className="login-alert" role="alert">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* E-mail */}
            <div className="form-field">

              <label htmlFor="email">
                E-mail
              </label>

              <div className="input-wrapper">

                <Mail
                  className="input-icon"
                  size={17}
                />

                <input
                  id="email"
                  type="text"
                  placeholder="seuemail@gmail.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />

              </div>

            </div>

            {/* Senha */}
            <div className="form-field">
              <label htmlFor="password">Senha</label>

              <div className="input-wrapper password-input-wrapper">
                <Lock className="input-icon" size={17} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((atual) => !atual)
                  }
                  aria-label={
                    showPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
            {/* Opções */}
            <div className="login-options">

              <label className="remember-option">

                <input
                  type="checkbox"
                />

                <span>
                  Lembrar-me
                </span>

              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Esqueci minha senha
              </button>

            </div>

            {/* Botão */}
            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Verificando acesso..." : "Entrar no Sistema"}
            </button>

          </form>

          {/* Cadastro */}
          <div className="login-register">

            <p>
              Primeiro acesso?{" "}

              <button
                type="button"
                className="forgot-password"
                onClick={onSolicitarCadastro}
              >
                Solicitar cadastro
              </button>
            </p>

          </div>

        </section>

        {/* Rodapé */}
        <footer className="login-footer">

          <p>
            © 2026 Prefeitura Municipal de Santa Cruz dos Milagres
          </p>

          <p>
            Sistema de Gestão de Infraestrutura Urbana
          </p>

        </footer>

      </div>
    </main>
  );
}

export default Login;