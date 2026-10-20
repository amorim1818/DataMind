const auth =
    require("../middlewares/auth");

const upload =
    require("../middlewares/upload");


const UploadModel =
    require("../models/UploadModel");

const AnaliseModel =
    require("../models/AnaliseModel");


const {
    analisarArquivo
} =
    require("../services/analiseService");


const {
    gerarInsight
} =
    require("../services/geminiService");



module.exports = (app) => {


    /*
        ==============================
        PÁGINA DE UPLOAD
        ==============================
    */


    app.get(
        "/upload",
        auth,
        (req, res) => {


            if (!req.session.setor) {

                return res.redirect(
                    "/setor"
                );

            }


            res.render(
                "upload",
                {

                    usuario:
                        req.session.usuario,

                    setor:
                        req.session.setor

                }
            );

        }
    );



    /*
        ==============================
        RECEBER ARQUIVO
        ==============================
    */


    app.post(
        "/upload",

        auth,

        upload.single(
            "arquivo"
        ),

        async (req, res) => {


            try {


                /*
                    Verifica setor
                */


                if (!req.session.setor) {

                    return res
                        .status(400)
                        .json({

                            sucesso:
                                false,

                            erro:
                                "Nenhum setor foi selecionado."

                        });

                }



                /*
                    Verifica arquivo
                */


                if (!req.file) {

                    return res
                        .status(400)
                        .json({

                            sucesso:
                                false,

                            erro:
                                "Nenhum arquivo foi enviado."

                        });

                }



                const usuarioId =
                    req.session.usuario.id;


                const setor =
                    req.session.setor;



                /*
                    ==============================
                    SALVAR UPLOAD
                    ==============================
                */


                const uploadId =
                    await UploadModel.criar(

                        usuarioId,

                        req.file.originalname,

                        req.file.path,

                        req.file.mimetype,

                        req.file.size

                    );



                /*
                    ==============================
                    PANDAS
                    ==============================
                */


                const resultado =
                    await analisarArquivo(

                        req.file.path,

                        setor

                    );



                if (!resultado.sucesso) {

                    return res
                        .status(400)
                        .json({

                            sucesso:
                                false,

                            erro:
                                resultado.erro

                        });

                }



                resultado.setor =
                    setor;



                /*
                    ==============================
                    GEMINI
                    ==============================
                */


                console.log(
                    "Gerando insights com IA..."
                );


                const respostaIa =
                    await gerarInsight(

                        resultado,

                        setor

                    );



                if (respostaIa) {

                    console.log(
                        "Insights gerados."
                    );

                } else {

                    console.log(
                        "Não foi possível gerar insights."
                    );

                }



                /*
                    ==============================
                    SALVAR ANÁLISE
                    ==============================
                */


                const resumo =
                    JSON.stringify(
                        resultado
                    );


                await AnaliseModel.criar(

                    uploadId,

                    resumo,

                    respostaIa

                );



                /*
                    ==============================
                    RESPOSTA
                    ==============================
                */


                res.json({

                    sucesso:
                        true,

                    mensagem:
                        "Arquivo analisado com sucesso!",

                    arquivo:
                        req.file.originalname,

                    setor:
                        setor,

                    analise:
                        resultado,

                    insight:
                        respostaIa

                });



            } catch (erro) {


                console.error(
                    erro
                );


                res
                    .status(500)
                    .json({

                        sucesso:
                            false,

                        erro:
                            "Erro ao enviar ou analisar o arquivo."

                    });

            }

        }
    );

};