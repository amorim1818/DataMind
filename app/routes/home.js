const { analisarArquivo } = require("../services/analiseService");

module.exports = (app) => {

    app.get("/teste-analise", async (req, res) => {

        try {

            const resultado = await analisarArquivo(
                "uploads/teste.xlsx"
            );

            res.json(resultado);

        } catch (erro) {

            console.error(erro);

            res.status(500).json({
                sucesso: false,
                erro: "Erro ao analisar arquivo"
            });
        }

    });

};