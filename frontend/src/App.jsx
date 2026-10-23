
import { useState } from "react";

import Login from "./pages/Login.jsx";
import Cadastro from "./pages/Cadastro.jsx";
import TelaInicial from "./pages/TelaInicial.jsx";
import RegistrarOcorrencia from "./pages/RegistrarOcorrencia.jsx";
import MapaOcorrencias from "./pages/MapaOcorrencias.jsx";
import AcompanharOcorrencias from "./pages/AcompanharOcorrencias.jsx";
import TelaInicialAdmin from "./pages/TelaInicialAdmin.jsx";
import GerenciarOcorrenciasAdmin from "./pages/GerenciarOcorrenciasAdmin.jsx";
import MapaAdmin from "./pages/MapaAdmin.jsx";
import EmitirRelatorios from "./pages/EmitirRelatorios.jsx";
import MinhasNotificacoes from "./pages/MinhasNotificacoes.jsx";

import Header from "./components/Header.jsx";

function App() {
  const [screen, setScreen] = useState("login");
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);

  function sair() {
    setToken(null);
    setUsuario(null);
    setScreen("login");
  }

  const handleCadastroSucesso = () => {
    setScreen("login");
  };

  let conteudo;
  let exibirHeaderCidadao = false;

  if (screen === "cadastro") {
    conteudo = (
      <Cadastro
        onVoltar={() => setScreen("login")}
        onCadastroSucesso={handleCadastroSucesso}
      />
    );
  } else if (screen === "registrarOcorrencia") {
    exibirHeaderCidadao = true;

    conteudo = (
      <RegistrarOcorrencia
        token={token}
        userName={usuario?.nome}
        onVoltar={() => setScreen("telaInicial")}
        onLogout={sair}
      />
    );
  } else if (screen === "mapaOcorrencias") {
    exibirHeaderCidadao = true;

    conteudo = (
      <MapaOcorrencias
        token={token}
        userName={usuario?.nome || "Cidadão"}
        onVoltar={() => setScreen("telaInicial")}
        onLogout={sair}
      />
    );
  } else if (screen === "acompanharOcorrencias") {
    exibirHeaderCidadao = true;

    conteudo = (
      <AcompanharOcorrencias
        token={token}
        usuario={usuario}
        onVoltar={() => setScreen("telaInicial")}
        onLogout={sair}
      />
    );
  } else if (screen === "minhasNotificacoes") {
    exibirHeaderCidadao = true;

    conteudo = (
      <MinhasNotificacoes
        token={token}
        userName={usuario?.nome || "Cidadão"}
        onVoltar={() => setScreen("telaInicial")}
        onLogout={sair}
      />
    );
  } else if (screen === "telaInicial") {
    exibirHeaderCidadao = true;

    conteudo = (
      <TelaInicial
        token={token}
        usuario={usuario}
        onLogout={sair}
        onRegistrarOcorrencia={() =>
          setScreen("registrarOcorrencia")
        }
        onVisualizarMapa={() =>
          setScreen("mapaOcorrencias")
        }
        onAcompanharOcorrencias={() =>
          setScreen("acompanharOcorrencias")
        }
        onNotificacoes={() =>
          setScreen("minhasNotificacoes")
        }
      />
    );
  } else if (screen === "telaInicialAdmin") {
    conteudo = (
      <TelaInicialAdmin
        usuario={usuario}
        onLogout={sair}
        onGerenciarOcorrencias={() => setScreen("gerenciarOcorrencias")}
        onVisualizarMapa={() => setScreen("mapaAdmin")}
        onRelatorios={() => setScreen("relatorios")}
      />
    );
  } else if (screen === "gerenciarOcorrencias") {
    conteudo = (
      <GerenciarOcorrenciasAdmin
        token={token}
        userName={usuario?.nome || "Administrador"}
        onVoltar={() => setScreen("telaInicialAdmin")}
        onLogout={sair}
      />
    );
  } else if (screen === "mapaAdmin") {
    conteudo = (
      <MapaAdmin
        token={token}
        onVoltar={() => setScreen("telaInicialAdmin")}
        onLogout={sair}
        userName={usuario?.nome || "Administrador"}
      />
    );
  } else if (screen === "relatorios") {
    conteudo = (
      <EmitirRelatorios
        token={token}
        userName={usuario?.nome || "Administrador"}
        onVoltar={() => setScreen("telaInicialAdmin")}
        onLogout={sair}
      />
    );
  } else {
    conteudo = (
      <Login
        onLogin={(dadosUsuario, tokenRecebido) => {
          setUsuario(dadosUsuario);
          setToken(tokenRecebido);

          if (
            dadosUsuario.tipo === "admin" ||
            dadosUsuario.tipo === "administrador"
          ) {
            setScreen("telaInicialAdmin");
          } else {
            setScreen("telaInicial");
          }
        }}
        onSolicitarCadastro={() => setScreen("cadastro")}
      />
    );
  }

  return (
    <>
      {exibirHeaderCidadao && (
        <Header
          userName={usuario?.nome || "Cidadão"}
          userRole="Cidadão"
          onLogout={sair}
        />
      )}

      {conteudo}
    </>
  );
}

export default App;
