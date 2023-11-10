const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.path);
        cb(null, req.path == '/blog' ? './images/' : './profile_images/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ".png")
    }
})

const upload = multer({ storage: storage });
module.exports = upload;