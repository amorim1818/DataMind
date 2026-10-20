const auth = require("../middlewares/auth");

module.exports = (app) => {

    /*
     * Página de seleção de setor
     */

    app.get(
        "/setor",
        auth,
        (req, res) => {

            res.render(
                "setor",
                {
                    usuario:
                        req.session.usuario,

                    setorSelecionado:
                        req.session.setor || null
                }
            );

        }
    );


    /*
     * Recebe o setor selecionado
     */

    app.post(
        "/setor",
        auth,
        (req, res) => {

            const setor =
                req.body.setor;


            /*
             * Verifica se o setor é válido
             */

            const setoresPermitidos = [
                "rh",
                "financeiro",
                "comercial",
                "personalizado"
            ];


            if (
                !setoresPermitidos.includes(
                    setor
                )
            ) {

                return res.status(400).send(
                    "Setor inválido."
                );

            }


            /*
             * Salva o setor na sessão
             */

            req.session.setor =
                setor;


            /*
             * Continua para o upload
             */

            res.redirect(
                "/upload"
            );

        }
    );

};