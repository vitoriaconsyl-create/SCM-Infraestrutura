import { useState } from "react";
import {
  Building2,
  Lock,
  Mail,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

import "../styles/login.css";

function Login({ onLogin, onSolicitarCadastro }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !password || !role) {
      setShowAlert(true);
      return;
    }

    setShowAlert(false);

    console.log("Login realizado:", {
      email,
      password,
      role,
    });

    if (onLogin) {
      onLogin(role);
    }
  };

  return (
    <main className="login-page">
      {/* Imagem de fundo */}
      <div className="login-background" />

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

            {/* Perfil */}
            <div className="form-field">

              <label htmlFor="role">
                Perfil de Acesso
              </label>

              <div className="select-wrapper">

                <select
                  id="role"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value)
                  }
                >
                  <option value="">
                    Selecione seu perfil
                  </option>

                  <option value="cidadao">
                    Cidadão
                  </option>

                  <option value="admin">
                    Administrador
                  </option>
                </select>

                <ChevronDown
                  className="select-icon"
                  size={18}
                />

              </div>

            </div>

            {/* E-mail */}
            <div className="form-field">

              <label htmlFor="email">
                E-mail ou Matrícula
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

              <label htmlFor="password">
                Senha
              </label>

              <div className="input-wrapper">

                <Lock
                  className="input-icon"
                  size={17}
                />

                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                />

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
            >
              Entrar no Sistema
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