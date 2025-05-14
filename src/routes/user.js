const express = require("express");
const router = express.Router();


// Associating of the Controller to the different routes
const userCtrl = require("../controllers/user");


// 2 routes "POST": infos sent by the front-end -> email & password
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


// Exporting the router
module.exports = router;