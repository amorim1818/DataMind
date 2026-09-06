const auth = require("../middlewares/auth");
const UploadModel = require("../models/UploadModel");
const AnaliseModel = require("../models/AnaliseModel");

module.exports = (app) => {

    app.get(
        "/dashboard",
        auth,
        async (req, res) => {

            try {

                const usuarioId =
                    req.session.usuario.id;

                const uploads =
                    await UploadModel.listarPorUsuario(
                        usuarioId
                    );

                let analise = null;

                if (uploads.length > 0) {

                    analise =
                        await AnaliseModel.buscarPorUpload(
                            uploads[0].id
                        );

                }

                let dadosAnalise = null;

                if (analise) {

                    dadosAnalise =
                        JSON.parse(analise.resumo);

                }

                res.render("dashboard", {

                    usuario:
                        req.session.usuario,

                    uploads,

                    analise:
                        dadosAnalise

                });

            } catch (erro) {

                console.error(erro);

                res.status(500).send(
                    "Erro ao carregar o dashboard."
                );

            }

        }
    );

};