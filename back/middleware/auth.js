const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Extraction du header "authorization" de la requête entrante
    // Récupération de ce qu'il y a après l'espace dans le header avec fonction "split"
    const token = req.headers.authorization.split(' ')[1];

    // Décodage du token avec la fonction "verify"
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error });
  }
};
