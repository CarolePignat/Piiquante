const express = require('express');
const router = express.Router();

// Association du contrôleur aux différentes routes
const userCtrl = require('../controllers/user');


// Création des 2 routes "POST" : envoi d'infos par le front-end (adresse email, mdp)
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


// Exportation du router
module.exports = router;