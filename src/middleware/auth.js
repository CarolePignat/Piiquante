const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {

    try {

        // Extracting the "authorization" header from the incoming request
        // Retrieving what is after the space in the header after the "split" function
        const token = req.headers.authorization.split(' ')[1];

        // Decoding the token with the "verify" function
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