const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const UploadModel = require("../models/UploadModel");
const AnaliseModel = require("../models/AnaliseModel");
const { analisarArquivo } = require("../services/analiseService");

module.exports = (app) => {

    // ==========================================
    // PÁGINA DE ENVIO DE ARQUIVOS
    // ==========================================

    app.get(
        "/upload",
        auth,
        (req, res) => {

            res.render("upload", {
                usuario: req.session.usuario
            });

        }
    );


    // ==========================================
    // ENVIO E ANÁLISE DO ARQUIVO
    // ==========================================

    app.post(
        "/upload",
        auth,
        upload.single("arquivo"),

        async (req, res) => {

            try {

                if (!req.file) {

                    return res.status(400).send(
                        "Nenhum arquivo foi enviado."
                    );

                }

                const usuarioId =
                    req.session.usuario.id;

                // Salva o arquivo no banco
                const uploadId =
                    await UploadModel.criar(
                        usuarioId,
                        req.file.originalname,
                        req.file.path,
                        req.file.mimetype,
                        req.file.size
                    );

                // Analisa o arquivo com Python + Pandas
                const resultado =
                    await analisarArquivo(
                        req.file.path
                    );

                // Verifica se a análise funcionou
                if (!resultado.sucesso) {

                    return res.status(400).json({
                        sucesso: false,
                        erro: resultado.erro
                    });

                }

                // Transforma o resultado em texto
                const resumo =
                    JSON.stringify(resultado);

                // Salva a análise no banco
                await AnaliseModel.criar(
                    uploadId,
                    resumo
                );

                // Retorna o resultado
                res.json({

                    sucesso: true,

                    mensagem:
                        "Arquivo enviado e analisado com sucesso!",

                    arquivo:
                        req.file.originalname,

                    analise:
                        resultado

                });

            } catch (erro) {

                console.error(erro);

                res.status(500).json({

                    sucesso: false,

                    erro:
                        "Erro ao enviar ou analisar o arquivo."

                });

            }

        }
    );

};