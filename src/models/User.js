const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


// Creating "User" Schema using 'Schema' function of mongoose
const userSchema = new mongoose.Schema({

    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

});

// 'mongoose-unique-validator' plugin assures the unicity of the email address
userSchema.plugin(uniqueValidator);


// Exporting the 'User' model
module.exports = mongoose.model("User", userSchema);