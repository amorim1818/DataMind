module.exports = (app) => {

    require("./home")(app);
    require("./usuario")(app);
    require("./setor")(app);
    require("./dashboard")(app);
    require("./upload")(app);
    require("./historico")(app);
    
};