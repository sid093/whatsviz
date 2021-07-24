const router = require('express').Router();
const multer = require('multer');
const uuid = require('uuid');
const path = require("path");


const upload_path = path.join(__dirname, '..', '..', '..', 'data', 'input');

let upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, upload_path)
        },
        filename: (req, file, cb) => {
            cb(null, uuid.v4());
        }
    })
})

router.post("/", upload.single('file'), (req, res) => {
    res.send(req.file.filename);
});

module.exports = router;