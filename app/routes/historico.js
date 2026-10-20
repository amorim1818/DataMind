const auth =
    require("../middlewares/auth");

const UploadModel =
    require("../models/UploadModel");

const AnaliseModel =
    require("../models/AnaliseModel");


module.exports = (app) => {


    /*
        ================================
        HISTÓRICO
        ================================
    */

    app.get(
        "/historico",
        auth,
        async (req, res) => {

            try {

                const usuarioId =
                    req.session.usuario.id;


                const uploads =
                    await UploadModel.listarPorUsuario(
                        usuarioId
                    );


                /*
                    Para cada upload,
                    buscamos sua análise.
                */

                const historico =
                    await Promise.all(

                        uploads.map(
                            async upload => {

                                const analise =
                                    await AnaliseModel
                                        .buscarPorUpload(
                                            upload.id
                                        );


                                /*
                                    Só retornamos uploads
                                    que possuem análise.
                                */

                                if (!analise) {

                                    return null;

                                }


                                let resumo = null;


                                try {

                                    resumo =
                                        JSON.parse(
                                            analise.resumo
                                        );

                                } catch (erro) {

                                    console.error(
                                        "Erro ao interpretar análise:",
                                        erro
                                    );

                                }


                                return {

                                    upload:
                                        upload,

                                    analise:
                                        analise,

                                    resumo:
                                        resumo

                                };

                            }
                        )

                    );


                /*
                    Remove resultados nulos.
                */

                const historicoValido =
                    historico.filter(
                        item => item !== null
                    );


                res.render(
                    "historico",
                    {

                        usuario:
                            req.session.usuario,

                        historico:
                            historicoValido

                    }
                );


            } catch (erro) {

                console.error(
                    "Erro ao carregar histórico:",
                    erro
                );


                res.status(500).send(
                    "Erro ao carregar histórico."
                );

            }

        }
    );



    /*
        ================================
        VISUALIZAR ANÁLISE ANTIGA
        ================================
    */

    app.get(
        "/analise/:uploadId",
        auth,
        async (req, res) => {

            try {

                const usuarioId =
                    req.session.usuario.id;


                const uploadId =
                    req.params.uploadId;


                /*
                    Verifica se o upload
                    pertence ao usuário.
                */

                const upload =
                    await UploadModel
                        .buscarPorIdEUsuario(
                            uploadId,
                            usuarioId
                        );


                if (!upload) {

                    return res
                        .status(404)
                        .send(
                            "Análise não encontrada."
                        );

                }


                /*
                    Busca análise.
                */

                const analiseBanco =
                    await AnaliseModel
                        .buscarPorUpload(
                            upload.id
                        );


                if (!analiseBanco) {

                    return res
                        .status(404)
                        .send(
                            "Análise não encontrada."
                        );

                }


                /*
                    Converte JSON salvo
                    no banco.
                */

                const dadosAnalise =
                    JSON.parse(
                        analiseBanco.resumo
                    );


                /*
                    Reutilizamos o mesmo
                    dashboard.ejs.
                */

                res.render(
                    "dashboard",
                    {

                        usuario:
                            req.session.usuario,

                        uploads:
                            [upload],

                        analise:
                            dadosAnalise,

                        respostaIa:
                            analiseBanco.resposta_ia,

                        setor:
                            dadosAnalise.setor ||
                            "Personalizado"

                    }
                );


            } catch (erro) {

                console.error(
                    "Erro ao abrir análise:",
                    erro
                );


                res.status(500).send(
                    "Erro ao abrir análise."
                );

            }

        }
    );

};