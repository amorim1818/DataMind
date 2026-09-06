const db = require("../../config/database");

class UploadModel {

    static async criar(
        usuarioId,
        nomeArquivo,
        caminhoArquivo,
        tipoArquivo,
        tamanho
    ) {

        const sql = `
            INSERT INTO uploads
            (
                usuario_id,
                nome_arquivo,
                caminho_arquivo,
                tipo_arquivo,
                tamanho
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const [resultado] = await db.execute(sql, [
            usuarioId,
            nomeArquivo,
            caminhoArquivo,
            tipoArquivo,
            tamanho
        ]);

       return resultado.insertId;
    }

    static async listarPorUsuario(usuarioId) {

        const sql = `
            SELECT *
            FROM uploads
            WHERE usuario_id = ?
            ORDER BY criado_em DESC
        `;

        const [uploads] = await db.execute(sql, [usuarioId]);

        return uploads;
    }
}

module.exports = UploadModel;