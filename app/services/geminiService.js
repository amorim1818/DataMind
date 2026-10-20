const {
    GoogleGenAI
} = require("@google/genai");


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


/*
    Função para esperar antes
    de tentar novamente.
*/
function esperar(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );

}


/*
    Verifica se é um erro temporário
    que vale a pena tentar novamente.
*/
function erroTemporario(erro) {

    const status =
        erro.status ||
        erro.code ||
        erro?.error?.code;

    return (
        status === 429 ||
        status === 500 ||
        status === 502 ||
        status === 503 ||
        status === 504
    );

}


async function gerarInsight(
    analise,
    setor
) {

    /*
        Enviamos somente as informações
        necessárias para a IA.
    */

    const dadosParaIA = {

        setor:
            setor,

        linhas:
            analise.linhas,

        colunas:
            analise.colunas,

        nome_colunas:
            analise.nome_colunas,

        valores_vazios:
            analise.valores_vazios,

        duplicados:
            analise.duplicados,

        estatisticas:
            analise.estatisticas,

        analise_setor:
            analise.analise_setor || null

    };


    const prompt = `
Você é o assistente de análise de dados
da plataforma DataMind.

Sua função é interpretar os resultados
de uma planilha analisada pela plataforma.

SETOR:
${setor}

DADOS:

${JSON.stringify(
    dadosParaIA,
    null,
    2
)}

REGRAS:

- Responda em português do Brasil.
- Utilize somente os dados fornecidos.
- Não invente informações.
- Destaque os resultados mais relevantes.
- Informe problemas de qualidade dos dados.
- Considere valores vazios e duplicados.
- Adapte a análise ao setor selecionado.
- Gere no máximo 5 insights.
- Seja objetivo e profissional.
- Não utilize tabelas.

Utilize exatamente esta estrutura:

Resumo:
Breve resumo da análise.

Insights:
- Insight 1
- Insight 2
- Insight 3

Recomendações:
- Recomendação 1
- Recomendação 2
`;


    /*
        Quantidade máxima de tentativas.
    */

    const maxTentativas = 3;


    for (
        let tentativa = 1;
        tentativa <= maxTentativas;
        tentativa++
    ) {

        try {

            console.log(
                `Gemini - tentativa ${tentativa}/${maxTentativas}`
            );


            const resposta =
                await ai.models.generateContent({

                    model:
                        "gemini-3.8-flash",

                    contents:
                        prompt

                });


            /*
                Se chegou aqui,
                a chamada funcionou.
            */

            console.log(
                "Gemini respondeu com sucesso."
            );


            return resposta.text;


        } catch (erro) {


            console.error(
                `Erro Gemini na tentativa ${tentativa}:`,
                erro.message
            );


            /*
                Se NÃO for erro temporário,
                não adianta continuar tentando.
            */

            if (!erroTemporario(erro)) {

                console.error(
                    "Erro não temporário. Cancelando novas tentativas."
                );

                return null;

            }


            /*
                Se já foi a última tentativa,
                encerra.
            */

            if (
                tentativa === maxTentativas
            ) {

                console.error(
                    "Gemini indisponível após 3 tentativas."
                );

                return null;

            }


            /*
                Espera exponencial:

                tentativa 1 -> 2 segundos
                tentativa 2 -> 4 segundos
            */

            const tempoEspera =
                Math.pow(
                    2,
                    tentativa
                ) * 1000;


            console.log(
                `Aguardando ${tempoEspera / 1000} segundos...`
            );


            await esperar(
                tempoEspera
            );

        }

    }


    return null;

}


module.exports = {
    gerarInsight
};