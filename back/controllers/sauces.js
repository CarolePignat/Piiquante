// Imporation du modèle "Sauces"
const Sauces = require('../models/Sauces');
// Module permettant accès et interaction avec le système de fichiers
const fs = require('fs');

// CREATION D'UNE NOUVELLE SAUCE : "POST"

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  // Suppression de l'id de la sauce, car "id" généré automatiquement par la BDD
  delete sauceObject._id;
  // Suppression champ "userId": ne pas faire confiance au client & remplacer par le userId du token
  delete sauceObject._userId;

  const sauces = new Sauces({
    ...sauceObject, // Fonction "spread = ..." : récupération de toutes les propriétés de la sauce
    userId: req.auth.userId,
    // Url complète: "http", hôte du serveur (localhost:3000), dossier, nom de fichier
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });

  // Enregistrement dans la BDD
  sauces
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch((error) => res.status(500).json({ error }));
};

// MODIFICATION D'UNE SAUCE : "UDPATE"

exports.modifySauce = (req, res, next) => {
  // Vérification si existence d'un champ "file" (image)
  const sauceObject = req.file
    ? {
        // Si image existante
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  // Si image non existante
  delete sauceObject._userId;
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé !' });
      } else {
        Sauces.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// SUPPRESSION D'UNE SAUCE : "DELETE"
exports.deleteSauce = (req, res, next) => {
  // Renvoi de la sauce ayant le même "id" que celui de la requête
  Sauces.findOne({ _id: req.params.id })
    .then((sauces) => {
      // Vérification si le user qui veut supprimer la sauce = celui qui l'a créée
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé !' });
      } else {
        // Récupération du nom du fichier
        const filename = sauces.imageUrl.split('/images')[1];

        // Utilisation fonction 'unlink' du package "fs" pour supprimer Sauce & Image
        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
            .catch((error) => res.status(500).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

// RENVOI D'UNE SAUCE GRÂCE A SON "ID"

exports.getOneSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(500).json({ error }));
};

// RENVOI D'UN TABLEAU DE TOUTES LES SAUCES

exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(500).json({ error }));
};

// GESTION DES "LIKE" ET "DISLIKE"
exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  //const userId = req.body.id;

  if (like === 1) {
    Sauces.findOne({ _id: req.params.id })
      .then((sauces) => {
        if (sauces.usersLiked.includes(req.body.userId)) {
          res.status(401).json({ message: 'Action non autorisée !' });
        } else {
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $push: { usersLiked: req.body.userId },
              $inc: { likes: +1 },
            }
          )
            .then(() => res.status(200).json({ message: 'Sauce likée !' }))
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(500).json({ error }));
  }

  if (like === -1) {
    Sauces.findOne({ _id: req.params.id })
      .then((sauces) => {
        if (sauces.usersDisliked.includes(req.body.userId)) {
          res.status(401).json({ message: 'Action non autorisée !' });
        } else {
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $push: { usersDisliked: req.body.userId },
              $inc: { dislikes: +1 },
            }
          )
            .then(() => res.status(200).json({ message: 'Sauce dislikée !' }))
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(500).json({ error }));
  }

  if (like === 0) {
    Sauces.findOne({ _id: req.params.id })
      .then((sauces) => {
        if (sauces.usersLiked.includes(req.body.userId)) {
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersLiked: req.body.userId },
              $inc: { likes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: 'Like supprimé !' }))
            .catch((error) => res.status(500).json({ error }));
        }

        if (sauces.usersDisliked.includes(req.body.userId)) {
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then(() => res.status(200).json({ message: 'Dislike supprimé !' }))
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(500).json({ error }));
  }
};
