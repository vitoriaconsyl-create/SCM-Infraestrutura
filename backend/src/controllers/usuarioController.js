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


const listarMinhasOcorrencias = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        const ocorrencias =
            await usuarioRepository.listarOcorrenciasDoUsuario(usuarioId);

        return res.status(200).json(ocorrencias);
    } catch (erro) {
        console.error("Erro ao buscar minhas ocorrências:", erro);

        return res.status(500).json({
            erro: "Erro ao buscar suas ocorrências."
        });
    }
};


const criarUsuario = async (req, res) => {
    try {
        const {
            nome,
            email,
            senha,
            cpf,
            telefone,
            bairro
        } = req.body;

        if (!nome?.trim() ||
            !email?.trim() ||
            !senha ||
            !cpf ||
            !telefone ||
            !bairro?.trim()
        ) {
            return res.status(400).json({
                erro: "Preencha os campos obrigatórios."
            });
        }

        const cpfLimpo = cpf.replace(/\D/g, "");
        const telefoneLimpo = telefone.replace(/\D/g, "");

        if (cpfLimpo.length !== 11) {
            return res.status(400).json({
                erro: "O CPF deve conter 11 dígitos."
            });
        }

        if (
            telefoneLimpo.length !== 10 &&
            telefoneLimpo.length !== 11
        ) {
            return res.status(400).json({
                erro: "Informe um telefone válido."
            });
        }

        if (senha.length < 8) {
            return res.status(400).json({
                erro: "A senha deve ter pelo menos 8 caracteres."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const dados = {
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            senha: senhaHash,
            tipo: "cidadao",
            cpf: cpfLimpo,
            telefone: telefoneLimpo,
            bairro: bairro.trim()
        };

        const usuario = await usuarioRepository.criarUsuario(dados);

        return res.status(201).json({
            mensagem: "Cadastro realizado com sucesso.",
            usuario
        });

    } catch (erro) {
        console.error(erro);

        if (erro.code === "23505") {
            if (erro.constraint === "usuarios_cpf_unique_idx") {
                return res.status(409).json({
                    erro: "Já existe um usuário cadastrado com este CPF."
                });
            }

            return res.status(409).json({
                erro: "Já existe um usuário cadastrado com este e-mail."
            });
        }
        
        return res.status(500).json({
            erro: "Erro ao cadastrar usuário"
        });
    }
};

module.exports = {
    listarUsuarios,
    buscarUsuarioPorId,
    criarUsuario,
    listarOcorrenciasDoUsuario,
    listarMinhasOcorrencias
};