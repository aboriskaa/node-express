const multer = require('multer');
const bcrypt = require('bcryptjs');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}





const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, 'images');
    },
    filename(req, file, cb) {
        randFileName = Math.floor(Date.now() / 1000) + "-" + file.originalname;
        cb(null, randFileName);
    }
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];


const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter,
})