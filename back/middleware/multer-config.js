const multer = require('multer');


// Dico de type MIME
const MIME_TYPES = {
    'images/jpg': 'jpg',
    'images/jpeg': 'jpg',
    'images/png': 'png'
};

// Indication à "Multer" où il doit enregistrer les fichiers entrants
const storage = multer.diskStorage({

    // Enregistrement fichiers dans dossier "images" avec la fonction 'destination' de "Multer"
    destination: (req, file, callback) => {
        callback(null, 'images');
    },

    // Fonction 'filename' : Utilisation nom origine, Remplacement espaces par "_", Ajout 'timestamp'
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});


// Exportation de "Multer" avec la constante 'storage' et Gestion téléchargements fichiers image
module.exports = multer({ storage }).single('image');