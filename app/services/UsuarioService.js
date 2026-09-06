const bcrypt = require("bcrypt");
const UsuarioModel = require("../models/UsuarioModel");

class UsuarioService {

    static async cadastrar(nome, email, senha) {

        const usuarioExistente =
            await UsuarioModel.buscarPorEmail(email);

        if (usuarioExistente) {
            throw new Error("Este email já está cadastrado.");
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        return await UsuarioModel.criar(
            nome,
            email,
            senhaHash
        );
    }

    static async login(email, senha) {

        const usuario =
            await UsuarioModel.buscarPorEmail(email);

        if (!usuario) {
            throw new Error("Email ou senha incorretos.");
        }

        const senhaCorreta =
            await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            throw new Error("Email ou senha incorretos.");
        }

        return usuario;
    }
}

module.exports = UsuarioService;