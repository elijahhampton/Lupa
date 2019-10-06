/**
 * @author Elijah Hampton
 * @date August 19, 2019
 * 
 * Lupa User MongoDB model
 */

//Import Mongoose
const mongoose = require('mongoose');

//Retrieve Schema module
const Schema = mongoose.Schema;

//Create User schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    firstName: {
        type: String,
        required: true,
        minlength: 3
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
    },
    gender: {
        type: String,
        required: false,
        trim: true,
    },
    avatar: {
        type: String,
        required: false,
    },
    packs: {
        type: Array, 
    }
}, {
    timestamps: true,
});

//Create User model
const User = mongoose.model('User', userSchema);

//Add User to exports
module.exports = User;