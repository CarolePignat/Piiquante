const express = require('express');
const router = express.Router();


// Importation des middleware "auth" et "multer"
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


// Association du contrôleur aux différentes routes
const saucesCtrl = require('../controllers/sauces');


// Création des routes "Sauces"
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);


// Exportation du "router"
module.exports = router;