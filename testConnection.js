const db = require("./config/database");

async function testar() {
    try {
        const conn = await db.getConnection();

        console.log("✅ Banco conectado com sucesso!");

        conn.release();
    } catch (erro) {
        console.error("Erro:", erro);
    }
}

testar();