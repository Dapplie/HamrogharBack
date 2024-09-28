const path = require('path');

function uploadImage(req, res, next) {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiii");
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    const link = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
    console.log('Image uploaded:', link);
    res.json({ link });
}

module.exports = {
    uploadImage
};
