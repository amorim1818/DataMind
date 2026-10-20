const db = require("../../config/database");

class UploadModel {

    // SALVAR NOVO UPLOAD
    static async criar(
        usuarioId,
        nomeArquivo,
        caminhoArquivo,
        tipoArquivo,
        tamanho
    ) {
        const sql = `
            INSERT INTO uploads (
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

    // LISTAR UPLOADS DO USUÁRIO
    static async listarPorUsuario(usuarioId) {
        const sql = `
            SELECT *
            FROM uploads
            WHERE usuario_id = ?
            ORDER BY criado_em DESC, id DESC
        `;

        const [uploads] = await db.execute(
            sql,
            [usuarioId]
        );

        return uploads;
    }

    // BUSCAR UPLOAD PELO ID E USUÁRIO
    static async buscarPorIdEUsuario(
        uploadId,
        usuarioId
    ) {
        const sql = `
            SELECT *
            FROM uploads
            WHERE id = ?
              AND usuario_id = ?
            LIMIT 1
        `;

        const [uploads] = await db.execute(sql, [
            uploadId,
            usuarioId
        ]);

        return uploads[0] || null;
    }
}

module.exports = UploadModel;
