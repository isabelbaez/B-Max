const express = require("express");
const expressFileUpload = require("express-fileupload");
const path = require('path');
const fs = require("fs");

const router = express.Router();

router.use(expressFileUpload());

const acceptedExtensions = [".stl", ".obj"];

router.post("/", (req, res) => {
    const { file } = req.files;
    const ext = path.extname(file.name);
    if (acceptedExtensions.includes(ext)) {
        file.mv(path.join("/home/ubuntu/frontend_ohio 2/src/media/models", file.name));
        res.status(200).json({message: "ok"});
    } else {
        res.status(500).json({message: `Extension ${ext} not a valid extension.`});
    }
})

module.exports = router;