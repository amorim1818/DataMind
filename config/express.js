require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

module.exports = () => {

    const app = express();

    // Configuração do EJS
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "../views"));

    // Arquivos estáticos
    app.use(
        "/static",
        express.static(path.join(__dirname, "../static"))
    );

    // Leitura de dados enviados pelos formulários
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // Sessão
    app.use(
        session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24
            }
        })
    );

    // Rotas
    require("../app/routes")(app);

    return app;
};