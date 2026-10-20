const db =
    require("../../config/database");


class AnaliseModel {


    /*
        ================================
        CRIAR ANÁLISE
        ================================
    */

    static async criar(
        uploadId,
        resumo,
        respostaIa = null
    ) {

        const sql = `
            INSERT INTO analises
            (
                upload_id,
                resumo,
                resposta_ia
            )
            VALUES (?, ?, ?)
        `;


        const [resultado] =
            await db.execute(
                sql,
                [
                    uploadId,
                    resumo,
                    respostaIa
                ]
            );


        return resultado.insertId;

    }



    /*
        ================================
        BUSCAR ANÁLISE PELO UPLOAD
        ================================
    */

    static async buscarPorUpload(
        uploadId
    ) {

        const sql = `
            SELECT *
            FROM analises

            WHERE upload_id = ?

            ORDER BY criado_em DESC

            LIMIT 1
        `;


        const [analises] =
            await db.execute(
                sql,
                [uploadId]
            );


        return analises[0] || null;

    }

}


module.exports =
    AnaliseModel;