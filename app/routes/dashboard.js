const auth =
    require("../middlewares/auth");

const UploadModel =
    require("../models/UploadModel");

const AnaliseModel =
    require("../models/AnaliseModel");


module.exports = (app) => {

    app.get(
        "/dashboard",
        auth,
        async (req, res) => {

            try {

                const usuarioId =
                    req.session.usuario.id;


                /*
                    Busca os uploads
                    do usuário.
                */

                const uploads =
                    await UploadModel.listarPorUsuario(
                        usuarioId
                    );


                let analiseBanco = null;
                let dadosAnalise = null;
                let respostaIa = null;


                /*
                    Busca a análise referente
                    ao último upload.
                */

                if (uploads.length > 0) {

                    analiseBanco =
                        await AnaliseModel.buscarPorUpload(
                            uploads[0].id
                        );

                }


                /*
                    Converte o resumo salvo
                    no banco novamente para objeto.
                */

                if (analiseBanco) {

                    dadosAnalise =
                        JSON.parse(
                            analiseBanco.resumo
                        );


                    respostaIa =
                        analiseBanco.resposta_ia;

                }


                /*
                    Renderiza o Dashboard.
                */

                res.render(
                    "dashboard",
                    {

                        usuario:
                            req.session.usuario,

                        uploads:
                            uploads,

                        analise:
                            dadosAnalise,

                        respostaIa:
                            respostaIa,

                        setor:
                            req.session.setor ||
                            (
                                dadosAnalise
                                &&
                                dadosAnalise.setor
                            ) ||
                            "Personalizado"

                    }
                );


            } catch (erro) {

                console.error(
                    "Erro Dashboard:",
                    erro
                );


                res.status(500).send(
                    "Erro ao carregar o dashboard."
                );

            }

        }
    );

};