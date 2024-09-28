const express = require('express');
const multer = require('multer');
const path = require('path');
const multerController = require('../controllers/multerController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const multerRouter = express.Router();

multerRouter.post('/multer', upload.single('image'), multerController.uploadImage);

module.exports = multerRouter;
