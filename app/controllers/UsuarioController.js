const UsuarioService = require("../services/UsuarioService");

class UsuarioController {

    static mostrarCadastro(req, res) {

        res.render("cadastro");

    }

    static async cadastrar(req, res) {

        try {

            const { nome, email, senha } = req.body;

            if (!nome || !email || !senha) {

                return res.status(400).send(
                    "Todos os campos são obrigatórios."
                );

            }

            await UsuarioService.cadastrar(
                nome,
                email,
                senha
            );

            res.redirect("/login");

        } catch (erro) {

            console.error(erro);

            res.status(400).send(erro.message);
        }
    }

    static mostrarLogin(req, res) {

        res.render("login");

    }

    static async login(req, res) {

        try {

            const { email, senha } = req.body;

            if (!email || !senha) {

                return res.status(400).send(
                    "Email e senha são obrigatórios."
                );

            }

            const usuario =
                await UsuarioService.login(email, senha);

            req.session.usuario = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            };

            res.redirect("/dashboard");

        } catch (erro) {

            console.error(erro);

            res.status(401).send(erro.message);
        }
    }

    static logout(req, res) {

        req.session.destroy((erro) => {

            if (erro) {
                console.error(erro);
            }

            res.redirect("/login");

        });

    }
}

module.exports = UsuarioController;