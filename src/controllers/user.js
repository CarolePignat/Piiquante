const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Importing "User" model
const User = require("../models/User");


// Registering "users" in the database
exports.signup = (req, res) => {

    // Async function for storing hash in the password database
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user
                .save()
                // 201: creating a resource
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};


// Verifying user's identifier and password

exports.login = (req, res) => {

    // Search of the "user" with the 'findOne' method
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ message: 'Identifiant/Mot de passe incorrect !' });
            } else {

                // Comparing the password given by the user with the one of the database
                bcrypt
                    .compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            return res
                                .status(401)
                                .json({ message: 'Identifiant/Mot de passe incorrect !' })
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                // Token encryption with the "jsonwebtoken" sign function
                                token: jwt.sign(
                                    { userId: user._id },
                                    // Private key to encrypt the token
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