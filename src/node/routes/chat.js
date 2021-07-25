const router = require('express').Router();
const multer = require('multer');
const uuid = require('uuid');
const path = require("path");
const exec = require('child_process').exec;


const upload_path = path.join(__dirname, '..', '..', '..', 'data', 'input');

let upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, upload_path),
        filename: (req, file, cb) => cb(null, uuid.v4())
    })
})

router.post("/", upload.single('file'), (req, res) => {
    exec(`python3 /home/app/src/python/script.py /home/app/data/input/${req.file.filename} /home/app/data/output/${req.file.filename}`)
    res.send(req.file.filename);
});

router.get("/:id", (req, res) => {
    res.sendFile(`/home/app/data/output/${req.params.id}`)
});

module.exports = router;