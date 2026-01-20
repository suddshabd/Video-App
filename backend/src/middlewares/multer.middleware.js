
// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./public/temp")
//     },
//     filename: function (req, file, cb) {

//         cb(null, file.originalname)
//     }
// })

// export const upload = multer({
//     storage,
// })



import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("video/") ||
        file.mimetype.startsWith("image/")
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only video and image files are allowed"), false);
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 200, // 200MB
    },
});
