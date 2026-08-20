import { useState } from "react";

import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import TelaInicial from "./pages/TelaInicial.jsx";
import RegistrarOcorrencia from "./pages/RegistrarOcorrencia.jsx";
import MapaOcorrencias from "./pages/MapaOcorrencias.jsx";
import MinhasOcorrencias from "./pages/MinhasOcorrencias.jsx";
import AcompanharOcorrencias from "./pages/AcompanharOcorrencias.jsx";
import TelaInicialAdmin from "./pages/TelaInicialAdmin.jsx";

function App() {

  const [screen, setScreen] = useState("login");

  const handleCadastroSucesso = () => {
    setScreen("login");
  };

  /* =====================================================
     CADASTRO
  ===================================================== */

  if (screen === "cadastro") {

    return (
      <Cadastro
        onVoltar={() => setScreen("login")}
        onCadastroSucesso={handleCadastroSucesso}
      />
    );

  }

  /* =====================================================
     REGISTRAR OCORRÊNCIA
  ===================================================== */

  if (screen === "registrarOcorrencia") {

    return (
      <RegistrarOcorrencia
        onVoltar={() => setScreen("telaInicial")}
      />
    );

  }

  /* =====================================================
     MAPA DE OCORRÊNCIAS DO CIDADÃO
  ===================================================== */

  if (screen === "mapaOcorrencias") {

    return (
      <MapaOcorrencias
        userName="João Silva"
        onVoltar={() => setScreen("telaInicial")}
        onLogout={() => setScreen("login")}
      />
    );

  }

  /* =====================================================
     MINHAS OCORRÊNCIAS
  ===================================================== */

  if (screen === "minhasOcorrencias") {

    return (
      <MinhasOcorrencias
        onVoltar={() => setScreen("telaInicial")}
        onLogout={() => setScreen("login")}
        userName="João Silva"
      />
    );

  }

  /* =====================================================
     ACOMPANHAR OCORRÊNCIAS
  ===================================================== */

  if (screen === "acompanharOcorrencias") {

    return (
      <AcompanharOcorrencias
        onVoltar={() => setScreen("telaInicial")}
        onLogout={() => setScreen("login")}
      />
    );

  }

  /* =====================================================
     TELA INICIAL DO CIDADÃO
  ===================================================== */

  if (screen === "telaInicial") {

    return (
      <TelaInicial

        onLogout={() =>
          setScreen("login")
        }

        onRegistrarOcorrencia={() =>
          setScreen("registrarOcorrencia")
        }

        onVisualizarMapa={() =>
          setScreen("mapaOcorrencias")
        }

        onMinhasOcorrencias={() =>
          setScreen("minhasOcorrencias")
        }

        onAcompanharOcorrencias={() =>
          setScreen("acompanharOcorrencias")
        }

      />
    );

  }

  /* =====================================================
     TELA INICIAL DO ADMINISTRADOR
  ===================================================== */

  if (screen === "telaInicialAdmin") {

    return (
      <TelaInicialAdmin

        onLogout={() =>
          setScreen("login")
        }

        onGerenciarOcorrencias={() =>
          setScreen("gerenciarOcorrencias")
        }

        onVisualizarMapa={() =>
          setScreen("mapaOcorrenciasAdmin")
        }

        onRelatorios={() =>
          setScreen("relatorios")
        }

      />
    );

  }

  /* =====================================================
     LOGIN
  ===================================================== */

  return (
    <Login

      onLogin={(role) => {

        console.log(
          "Perfil selecionado:",
          role
        );

        if (role === "admin") {
          setScreen("telaInicialAdmin");
        } else {
          setScreen("telaInicial");
        }

      }}

      onSolicitarCadastro={() =>
        setScreen("cadastro")
      }

    />
  );

}

export default App;