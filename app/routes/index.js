module.exports = (app) => {

    require("./home")(app);
    require("./usuario")(app);
    require("./dashboard")(app);
    require("./upload")(app);
    
};

 