const express = require("express");
const router = express.Router();


// Import "auth" & "multer" middlewares
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");


// Associate controller with the different routes
const saucesCtrl = require("../controllers/sauces");


// Create "Sauces" routes
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);


// Export "router
module.exports = router;