
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const authRepository = require("./authRepository");
const { enviarEmailRecuperacao } = require("../services/emailService");

// LOGIN
const login = async (req, res) => {
    try {
        const { email, senha, lembrarMe } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: "Email e senha são obrigatórios"
            });
        }

        const usuario = await authRepository.buscarUsuarioPorEmail(
            email.trim().toLowerCase()
        );

        if (!usuario) {
            return res.status(401).json({
                erro: "Email ou senha inválidos"
            });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({
                erro: "Email ou senha inválidos"
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                tipo: usuario.tipo
            },
            process.env.JWT_SECRET,
            {
                expiresIn: lembrarMe === true ? "30d" : "1h"
            }
        );

        return res.status(200).json({
            mensagem: "Login realizado com sucesso",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            }
        });

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            erro: "Erro ao realizar login"
        });
    }
};

// SOLICITAR RECUPERAÇÃO DE SENHA
const solicitarRecuperacao = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({
                erro: "Informe seu e-mail"
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        const usuario = await authRepository.buscarUsuarioPorEmail(
            emailNormalizado
        );

        // A resposta é a mesma para e-mails cadastrados e não cadastrados.
        if (usuario) {
            await authRepository.invalidarTokensAnteriores(usuario.id);

            const token = crypto.randomBytes(32).toString("hex");

            const tokenHash = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");

            const expiraEm = new Date(Date.now() + 30 * 60 * 1000);

            await authRepository.criarTokenRecuperacao(
                usuario.id,
                tokenHash,
                expiraEm
            );

            const link = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;

            await enviarEmailRecuperacao(usuario.email, link);
        }

        return res.status(200).json({
            mensagem: "Se o e-mail estiver cadastrado, você receberá as instruções para recuperar sua senha."
        });

    } catch (erro) {
        console.error("Erro ao solicitar recuperação:", erro);

        return res.status(500).json({
            erro: "Não foi possível processar sua solicitação. Tente novamente mais tarde."
        });
    }
};

// VERIFICAR SE O LINK DE RECUPERAÇÃO É VÁLIDO
const verificarTokenRecuperacao = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                erro: "Token não informado"
            });
        }

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const registro = await authRepository.buscarTokenValido(tokenHash);

        if (!registro) {
            return res.status(400).json({
                erro: "Link inválido ou expirado"
            });
        }

        return res.status(200).json({
            mensagem: "Link válido"
        });

    } catch (erro) {
        console.error("Erro ao verificar token:", erro);

        return res.status(500).json({
            erro: "Erro ao verificar o link de recuperação"
        });
    }
};

// REDEFINIR SENHA
const redefinirSenha = async (req, res) => {
    try {
        const { token, novaSenha } = req.body;

        if (!token || !novaSenha) {
            return res.status(400).json({
                erro: "Token e nova senha são obrigatórios"
            });
        }

        if (novaSenha.length < 8) {
            return res.status(400).json({
                erro: "A senha deve possuir pelo menos 8 caracteres"
            });
        }

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const registro = await authRepository.buscarTokenValido(tokenHash);

        if (!registro) {
            return res.status(400).json({
                erro: "Link inválido ou expirado. Solicite uma nova recuperação."
            });
        }

        const senhaHash = await bcrypt.hash(novaSenha, 10);

        const atualizado = await authRepository.atualizarSenhaEConsumirToken(
            registro.id,
            registro.usuario_id,
            senhaHash
        );

        if (!atualizado) {
            return res.status(400).json({
                erro: "Este link já foi utilizado ou expirou"
            });
        }

        return res.status(200).json({
            mensagem: "Senha redefinida com sucesso!"
        });

    } catch (erro) {
        console.error("Erro ao redefinir senha:", erro);

        return res.status(500).json({
            erro: "Erro ao redefinir senha"
        });
    }
};

module.exports = {
    login,
    solicitarRecuperacao,
    verificarTokenRecuperacao,
    redefinirSenha
};
