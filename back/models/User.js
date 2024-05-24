const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


// Création du schéma "User" avec la fonction 'Schema' de "mongoose"
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});


// Ajout du plugin de "mongoose" pour garantir l'unicité des adresses email
userSchema.plugin(uniqueValidator);


// Exportation du modèle "User"
module.exports = mongoose.model('User', userSchema);