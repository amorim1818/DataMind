const {
    execFile
} = require("child_process");

const path =
    require("path");


function analisarArquivo(
    caminhoArquivo,
    setor
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {


            /*
             * Python da máquina virtual
             */

            const python =
                path.join(

                    __dirname,

                    "../../.venv/Scripts/python.exe"

                );


            /*
             * Script Python
             */

            const script =
                path.join(

                    __dirname,

                    "../../python/analise.py"

                );


            /*
             * Executa Python
             */

            execFile(

                python,

                [
                    script,
                    caminhoArquivo,
                    setor
                ],

                (
                    erro,
                    stdout,
                    stderr
                ) => {


                    /*
                     * Erro na execução
                     */

                    if (erro) {

                        console.error(
                            "Erro ao executar Python:"
                        );

                        console.error(
                            stderr
                        );

                        return reject(
                            erro
                        );

                    }


                    /*
                     * Converte JSON
                     */

                    try {

                        const resultado =
                            JSON.parse(
                                stdout
                            );


                        resolve(
                            resultado
                        );


                    } catch (erro) {

                        console.error(
                            "Erro ao interpretar resposta do Python:"
                        );

                        console.error(
                            stdout
                        );


                        reject(
                            erro
                        );

                    }

                }

            );

        }
    );

}


module.exports = {

    analisarArquivo

};