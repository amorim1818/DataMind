const db = require("../../config/database");

class UsuarioModel {

    static async criar(nome, email, senha) {

        const sql = `
            INSERT INTO usuarios (nome, email, senha)
            VALUES (?, ?, ?)
        `;

        const [resultado] = await db.execute(sql, [
            nome,
            email,
            senha
        ]);

        return resultado;
    }

    static async buscarPorEmail(email) {

        const sql = `
            SELECT *
            FROM usuarios
            WHERE email = ?
        `;

        const [usuarios] = await db.execute(sql, [email]);

        return usuarios[0];
    }
}

module.exports = UsuarioModel;