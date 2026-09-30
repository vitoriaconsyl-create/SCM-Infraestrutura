const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRepository = require("./authRepository");

const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                erro: "Email e senha são obrigatórios"
            });
        }

        const usuario = await authRepository.buscarUsuarioPorEmail(email);

        if (!usuario) {
            return res.status(401).json({
                erro: "Email ou senha inválidos"
            });
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha
        );

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
                expiresIn: "1h"
            }
        );

        res.status(200).json({
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

        res.status(500).json({
            erro: "Erro ao realizar login"
        });
    }
};

module.exports = {
    login
};