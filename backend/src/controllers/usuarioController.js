const bcrypt = require("bcrypt");

const usuarioRepository = require("../repositories/usuarioRepository");

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioRepository.listarUsuarios();

        res.status(200).json(usuarios);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar usuários"
        });
    }
};

const buscarUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await usuarioRepository.buscarUsuarioPorId(id);

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado"
            });
        }

        res.status(200).json(usuario);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar usuário"
        });
    }
};

const listarOcorrenciasDoUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const ocorrencias =
            await usuarioRepository.listarOcorrenciasDoUsuario(id);

        res.status(200).json(ocorrencias);
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar ocorrências do usuário"
        });
    }
};

const criarUsuario = async (req, res) => {
    try {
        const {
            nome,
            email,
            senha,
            tipo
        } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Nome, email e senha são obrigatórios"
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const dados = {
            nome,
            email,
            senha: senhaHash,
            tipo: "cidadao"
        };

        const usuario = await usuarioRepository.criarUsuario(dados);

        res.status(201).json(usuario);
    } catch (erro) {
        console.error(erro);

        if (erro.code === "23505") {
            return res.status(409).json({
                erro: "Já existe um usuário cadastrado com este email"
            });
        }

        res.status(500).json({
            erro: "Erro ao cadastrar usuário"
        });
    }
};

module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    criarUsuario,
    listarOcorrenciasDoUsuario
};