const UsuarioController = require("../controllers/UsuarioController");

module.exports = (app) => {

    // Cadastro
    app.get(
        "/cadastro",
        UsuarioController.mostrarCadastro
    );

    app.post(
        "/cadastro",
        UsuarioController.cadastrar
    );

    // Login
    app.get(
        "/login",
        UsuarioController.mostrarLogin
    );

    app.post(
        "/login",
        UsuarioController.login
    );

    // Logout
    app.get(
        "/logout",
        UsuarioController.logout
    );

};