const multer = require("multer");


// Type MIME Dictionary
const MIME_TYPES = {
    'images/jpg': 'jpg',
    'images/jpeg': 'jpg',
    'images/png': 'png',
};


// Path indicating to 'multer' where to store the incoming files
const storage = multer.diskStorage({

    // Registering files in the 'images' directory with the 'destination' function of "multer"
    destination: (req, file, callback) => {
        callback(null, 'images');
    },

    // 'filename' function: Use of 'originalname', Replacement of the spaces with "_", Adding 'timestamp'
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    },
});


// Export "multer" with the 'storage' constant & Manage the uploads for the 'images' directory
module.exports = multer({ storage }).single('image');