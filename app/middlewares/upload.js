const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },

    filename: (req, file, cb) => {

        const nomeOriginal = path
            .parse(file.originalname)
            .name;

        const extensao = path.extname(file.originalname);

        const nomeArquivo =
            `${Date.now()}-${nomeOriginal}${extensao}`;

        cb(null, nomeArquivo);

    }

});

const fileFilter = (req, file, cb) => {

    const extensoesPermitidas = [
        ".xlsx",
        ".xls",
        ".csv"
    ];

    const extensao =
        path.extname(file.originalname).toLowerCase();

    if (extensoesPermitidas.includes(extensao)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Formato de arquivo não permitido."
            )
        );

    }

};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

module.exports = upload;