const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
// Importing "helmet" module from Node.js -> securing HTTP headers requests
const helmet = require("helmet");



// "User" & "Sauces" routes
const userRoutes = require("./src/routes/user");
const saucesRoutes = require("./src/routes/sauces");


// Environment Variables used for storing the sensitive datas
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD


// Connecting to MongoDB Database
mongoose
    .connect(`mongodb+srv://${username}:${password}@cluster0.7mqv6tt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log('Connected to database'))
    .catch(() => console.log('Connexion to database failed'));


const app = express();


// Adding the different "helmet" headers : increase the security of the Express app using the middleware 'app.use'
app.use(helmet());


// Enable 'CORS' middleware for all routes
app.use(cors());
// Add 'CORS' to allow access to other websites : i.e. downloading pics
app.use((res, req, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
});


// Middleware
app.use(express.json());


// Registering the "routes"
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('api/sauces', saucesRoutes);


// Starting the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});