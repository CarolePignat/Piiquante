require('dotenv').config();
const express = require('express');
// Importation du module "helmet" de Node.js pour sécuriser des en-têtes HTTP
const helmet = require('helmet');  
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');


// Routes des "user" et "sauces"
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');


// Utilisation de variables d'environnement pour stocker les données sensibles de la BDD
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;


// Connexion à la base de données MongoDB avec "mongoose"
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.7mqv6tt.mongodb.net/?retryWrites=true&w=majority`,
{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

// Ajout des différentes en-têtes "helmet" : augmenter la sécurité de l'app Express avec le middleware 'app.use'
app.use(helmet());

// Ajout des requêtes "CORS" avec le middleware 'app.use'
app.use(cors());
// Ajout d'un CORS pour permettre l'accès à d'autres sites pour le téléchargmement des images   
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
});

// Affichage du corps de la requête
app.use(express.json());


// Enregistrement des "routeurs"
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);


// Exportation du module "app.js"
module.exports = app;