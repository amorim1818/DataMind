const createApp = require("./config/express");

const app = createApp();

app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000");
});