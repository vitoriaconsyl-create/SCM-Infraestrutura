import {
  Building2,
  LogOut,
} from "lucide-react";

import "../styles/header.css";

function Header({
  userName,
  userRole,
  onLogout,
}) {

  const perfil = userRole || "Administrador";

  return (
    <header className="header">

      <div className="header-container">

        <div className="header-brand">

          <div className="header-logo">
            <Building2
              size={24}
              strokeWidth={2}
            />
          </div>

          <div className="header-brand-text">

            <h1>
              Sistema de Infraestrutura
            </h1>

            <p>
              Prefeitura Municipal
            </p>

          </div>

        </div>

        <div className="header-user">

          <div className="header-user-info">

            <p className="header-user-name">
              {userName}
            </p>

            <p className="header-user-role">
              {perfil}
            </p>

          </div>

          <button
            type="button"
            className="header-logout"
            onClick={onLogout}
          >

            <LogOut size={16} />

            <span>
              Sair
            </span>

          </button>

        </div>

      </div>

    </header>
  );
}

export default Header;