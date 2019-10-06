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

const packSchema = new Schema({
    packName: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        trim: true,
    },
    packLeader: {
        type: User,
    },
    packMembers: {
        type: Array,
        required: true,
    },
    packRating: {
        type: Number
    },
    sessionsCompleted: {
        type: Number,
    },
    numMembers: {
        type: Number,
    },
    isDefault: {
        type: Boolean,
        required: true,
    },
    isGlobal: {
        type: Boolean,
        required: true,
    },
    isPremium: {
        type: Boolean,
        required: true,
    },
    packMembers: {
        type: Array,
        required: true,
    }
});

//Create User model
const Pack = mongoose.model('Pack', packSchema);

//Add User to exports
module.exports = Pack;