const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importation du modèle "User"
const User = require('../models/User');

// Enregistrement des "users" dans la BDD

exports.signup = (req, res, next) => {
  // Fonction async pour le hashage
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        // 201: Création d'une ressource
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Vérification identifiant et mot de passe du "user"

exports.login = (req, res, next) => {
  // Recherche du "user" avec la méthode 'findOne'
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Identifiant/Mot de passe incorrect !' });
      } else {
        // Comparaison du mot de passe entré par le user et celui de la BDD
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ message: 'Identifiant/Mot de passe incorrect !' });
            } else {
              res.status(200).json({
                userId: user._id,
                // Chiffrage du token avec la fonction 'sign' de "jsonwebtoken"
                token: jwt.sign(
                  { userId: user._id },
                  // Chaîne secrète pour crypter le token
                  process.env.SECRET_TOKEN,
                  { expiresIn: '1h' }
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
