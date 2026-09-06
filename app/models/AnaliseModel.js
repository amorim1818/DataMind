const db = require("../../config/database");

class AnaliseModel {

    static async criar(
        uploadId,
        resumo
    ) {

        const sql = `
            INSERT INTO analises
            (
                upload_id,
                resumo
            )
            VALUES (?, ?)
        `;

        const [resultado] = await db.execute(sql, [
            uploadId,
            resumo
        ]);

        return resultado.insertId;
    }

    static async buscarPorUpload(uploadId) {

        const sql = `
            SELECT *
            FROM analises
            WHERE upload_id = ?
            ORDER BY criado_em DESC
            LIMIT 1
        `;

        const [analises] =
            await db.execute(sql, [uploadId]);

        return analises[0];
    }

}

module.exports = AnaliseModel;