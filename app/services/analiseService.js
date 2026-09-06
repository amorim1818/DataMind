const { execFile } = require("child_process");
const path = require("path");

function analisarArquivo(caminhoArquivo) {

    return new Promise((resolve, reject) => {

        const python = path.join(
            __dirname,
            "../../.venv/Scripts/python.exe"
        );

        const script = path.join(
            __dirname,
            "../../python/analise.py"
        );

        console.log("=== INICIANDO ANÁLISE PYTHON ===");
        console.log("Python:", python);
        console.log("Script:", script);
        console.log("Arquivo:", caminhoArquivo);

        execFile(
            python,
            [script, caminhoArquivo],
            (erro, stdout, stderr) => {

                console.log("=== PYTHON STDOUT ===");
                console.log(stdout);

                console.log("=== PYTHON STDERR ===");
                console.log(stderr);

                if (erro) {

                    console.error("=== ERRO AO EXECUTAR PYTHON ===");
                    console.error(erro);

                    return reject(erro);
                }

                try {

                    const resultado = JSON.parse(stdout);

                    console.log("=== JSON RECEBIDO DO PYTHON ===");
                    console.log(resultado);

                    resolve(resultado);

                } catch (erro) {

                    console.error(
                        "=== ERRO AO INTERPRETAR JSON ==="
                    );

                    console.error(erro);
                    console.error("STDOUT RECEBIDO:");
                    console.error(stdout);

                    reject(erro);
                }
            }
        );
    });
}

module.exports = {
    analisarArquivo
};