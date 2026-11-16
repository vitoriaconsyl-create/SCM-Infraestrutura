
import { useState } from "react";

import {
    Building2,
    Mail,
    AlertCircle,
    CheckCircle,
    ArrowLeft,
} from "lucide-react";

import { apiRequest } from "../services/api";

import "../styles/login.css";

import fundo from "../assets/scm.jpg";

function RecuperarSenha({ onVoltar }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErro("");
        setSucesso("");

        if (!email.trim()) {
            setErro("Informe seu e-mail.");
            return;
        }

        try {
            setLoading(true);

            const dados = await apiRequest(
                "/auth/solicitar-recuperacao",
                {
                    method: "POST",
                    body: JSON.stringify({
                        email: email.trim()
                    })
                }
            );

            setSucesso(dados.mensagem);

            setEmail("");

        } catch (erro) {
            setErro(erro.message || "Não foi possível solicitar a recuperação da senha.");
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
                        <h2>Recuperar senha</h2>
                        <p>
                            Informe o e-mail cadastrado para receber
                            as instruções de recuperação da sua senha.
                        </p>
                    </div>

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

                        {sucesso && (
                            <div className="login-success">
                                <CheckCircle size={18} />
                                <span>{sucesso}</span>
                            </div>
                        )}

                        <div className="form-field">
                            <label htmlFor="email">
                                E-mail
                            </label>

                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Digite seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
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
                                ? "Enviando..."
                                : "Enviar instruções"}
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
                </div>

            </div>
        </div>
    );
}

export default RecuperarSenha;
