
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
import RecuperarSenha from "./pages/RecuperarSenha.jsx";
import RedefinirSenha from "./pages/RedefinirSenha.jsx";

import Header from "./components/Header.jsx";

function App() {
    const tokenRecuperacao = new URLSearchParams(
        window.location.search
    ).get("token");

    // Recuperar dados salvos no navegador
    const tokenArmazenado =
        localStorage.getItem("scm_token") ||
        sessionStorage.getItem("scm_token");

    let usuarioArmazenado = null;

    try {
        const dadosSalvos =
            localStorage.getItem("scm_usuario") ||
            sessionStorage.getItem("scm_usuario");

        usuarioArmazenado = dadosSalvos
            ? JSON.parse(dadosSalvos)
            : null;

    } catch {
        localStorage.removeItem("scm_usuario");
        sessionStorage.removeItem("scm_usuario");
    }

    const [token, setToken] = useState(tokenArmazenado);
    const [usuario, setUsuario] = useState(usuarioArmazenado);

    const [screen, setScreen] = useState(() => {
        if (
            window.location.pathname === "/redefinir-senha" &&
            tokenRecuperacao
        ) {
            return "redefinirSenha";
        }

        if (tokenArmazenado && usuarioArmazenado) {
            if (
                usuarioArmazenado.tipo === "admin" ||
                usuarioArmazenado.tipo === "administrador"
            ) {
                return "telaInicialAdmin";
            }

            return "telaInicial";
        }

        return "login";
    });

    function sair() {
        setToken(null);
        setUsuario(null);

        localStorage.removeItem("scm_token");
        localStorage.removeItem("scm_usuario");

        sessionStorage.removeItem("scm_token");
        sessionStorage.removeItem("scm_usuario");

        setScreen("login");
    }

    const handleCadastroSucesso = () => {
        setScreen("login");
    };

    let conteudo;
    let exibirHeaderCidadao = false;

    if (screen === "recuperarSenha") {
        conteudo = (
            <RecuperarSenha
                onVoltar={() => setScreen("login")}
            />
        );

    } else if (screen === "redefinirSenha") {
        conteudo = (
            <RedefinirSenha
                token={tokenRecuperacao}
                onVoltar={() => {
                    window.history.replaceState({}, "", "/");
                    setScreen("login");
                }}
            />
        );

    } else if (screen === "cadastro") {
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
                token={token}
                onLogout={sair}
                onGerenciarOcorrencias={() =>
                    setScreen("gerenciarOcorrencias")
                }
                onVisualizarMapa={() =>
                    setScreen("mapaAdmin")
                }
                onRelatorios={() =>
                    setScreen("relatorios")
                }
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
                onLogin={(dadosUsuario, tokenRecebido, lembrarMe) => {
                    setUsuario(dadosUsuario);
                    setToken(tokenRecebido);

                    if (lembrarMe) {
                        localStorage.setItem(
                            "scm_token",
                            tokenRecebido
                        );

                        localStorage.setItem(
                            "scm_usuario",
                            JSON.stringify(dadosUsuario)
                        );

                        sessionStorage.removeItem("scm_token");
                        sessionStorage.removeItem("scm_usuario");

                    } else {
                        sessionStorage.setItem(
                            "scm_token",
                            tokenRecebido
                        );

                        sessionStorage.setItem(
                            "scm_usuario",
                            JSON.stringify(dadosUsuario)
                        );

                        localStorage.removeItem("scm_token");
                        localStorage.removeItem("scm_usuario");
                    }

                    if (
                        dadosUsuario.tipo === "admin" ||
                        dadosUsuario.tipo === "administrador"
                    ) {
                        setScreen("telaInicialAdmin");
                    } else {
                        setScreen("telaInicial");
                    }
                }}

                onSolicitarCadastro={() =>
                    setScreen("cadastro")
                }

                onEsqueciSenha={() =>
                    setScreen("recuperarSenha")
                }
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
