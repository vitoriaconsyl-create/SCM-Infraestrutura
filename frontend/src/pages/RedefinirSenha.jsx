
import { useEffect, useState } from "react";

import {
    Building2,
    Lock,
    AlertCircle,
    CheckCircle,
    ArrowLeft,
} from "lucide-react";

import { apiRequest } from "../services/api";

import "../styles/login.css";

import fundo from "../assets/scm.jpg";

function RedefinirSenha({ token, onVoltar }) {
    const [tokenValido, setTokenValido] = useState(false);
    const [verificando, setVerificando] = useState(true);

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(false);

    const requisitosSenha = {
        tamanho: novaSenha.length >= 8,
        maiuscula: /[A-Z]/.test(novaSenha),
        minuscula: /[a-z]/.test(novaSenha),
        numero: /[0-9]/.test(novaSenha),
        especial: /[!@#$%&*]/.test(novaSenha),
    };

    const senhaValida = Object.values(requisitosSenha).every(Boolean);

    useEffect(() => {
        const verificarToken = async () => {
            if (!token) {
                setErro("Link de recuperação inválido.");
                setVerificando(false);
                return;
            }

            try {
                await apiRequest(
                    `/auth/verificar-token?token=${encodeURIComponent(token)}`
                );

                setTokenValido(true);

            } catch (erro) {
                setErro(
                    erro.message || "Link inválido ou expirado."
                );
            } finally {
                setVerificando(false);
            }
        };

        verificarToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErro("");

        if (!senhaValida) {
            setErro("A senha não atende a todos os requisitos.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas informadas não são iguais.");
            return;
        }

        try {
            setLoading(true);

            await apiRequest(
                "/auth/redefinir-senha",
                {
                    method: "POST",
                    body: JSON.stringify({
                        token,
                        novaSenha
                    })
                }
            );

            setSucesso(true);
            setTokenValido(false);

            setNovaSenha("");
            setConfirmarSenha("");

        } catch (erro) {
            setErro(
                erro.message || "Não foi possível redefinir sua senha."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div
                className="login-background"
                style={{ backgroundImage: `url(${fundo})` }}
            />

            <div className="login-overlay" />

            <div className="login-content">

                <div className="login-header">
                    <div className="login-logo">
                        <Building2 size={32} />
                    </div>

                    <h1>SCM-Infraestrutura</h1>
                    <p>Gestão de ocorrências urbanas</p>
                </div>

                <div className="login-card">

                    <div className="login-card-header">
                        <h2>Redefinir senha</h2>
                        <p>
                            Cadastre uma nova senha para acessar
                            sua conta.
                        </p>
                    </div>

                    {verificando ? (
                        <div className="login-form">
                            <p>Verificando link de recuperação...</p>
                        </div>
                    ) : sucesso ? (
                        <div className="login-form">

                            <div className="login-success">
                                <CheckCircle size={18} />
                                <span>
                                    Senha redefinida com sucesso!
                                </span>
                            </div>

                            <button
                                type="button"
                                className="login-submit"
                                onClick={onVoltar}
                            >
                                Voltar para o login
                            </button>

                        </div>
                    ) : !tokenValido ? (
                        <div className="login-form">

                            <div className="login-alert">
                                <AlertCircle size={18} />
                                <span>{erro}</span>
                            </div>

                            <button
                                type="button"
                                className="login-submit"
                                onClick={onVoltar}
                            >
                                Solicitar novo link
                            </button>

                        </div>
                    ) : (
                        <form
                            className="login-form"
                            onSubmit={handleSubmit}
                        >

                            {erro && (
                                <div className="login-alert">
                                    <AlertCircle size={18} />
                                    <span>{erro}</span>
                                </div>
                            )}

                            <div className="form-field">
                                <label htmlFor="novaSenha">
                                    Nova senha
                                </label>

                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={18} />

                                    <input
                                        id="novaSenha"
                                        type="password"
                                        placeholder="Digite sua nova senha"
                                        value={novaSenha}
                                        onChange={(e) =>
                                            setNovaSenha(e.target.value)
                                        }
                                        required
                                        minLength={8}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="senha-requisitos">
                                    <p>A senha deve conter:</p>

                                    {[
                                        ["tamanho", "Pelo menos 8 caracteres"],
                                        ["maiuscula", "Uma letra maiúscula"],
                                        ["minuscula", "Uma letra minúscula"],
                                        ["numero", "Um número"],
                                        ["especial", "Um caractere especial (! @ # $ % & *)"],
                                    ].map(([chave, texto]) => (
                                        <p
                                            key={chave}
                                            className={
                                                requisitosSenha[chave]
                                                    ? "senha-requisito atendido"
                                                    : "senha-requisito"
                                            }
                                        >
                                            {requisitosSenha[chave] ? "✓" : "○"} {texto}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="confirmarSenha">
                                    Confirmar nova senha
                                </label>

                                <div className="input-wrapper">
                                    <Lock className="input-icon" size={18} />

                                    <input
                                        id="confirmarSenha"
                                        type="password"
                                        placeholder="Confirme sua nova senha"
                                        value={confirmarSenha}
                                        onChange={(e) =>
                                            setConfirmarSenha(e.target.value)
                                        }
                                        required
                                        minLength={8}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="login-submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Salvando..."
                                    : "Redefinir senha"}
                            </button>

                            <button
                                type="button"
                                className="forgot-password"
                                onClick={onVoltar}
                            >
                                <ArrowLeft size={15} />
                                Voltar para o login
                            </button>

                        </form>
                    )}

                </div>

            </div>
        </div>
    );
}

export default RedefinirSenha;
