const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const trainerSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5
    },
    speciality: {
        type: String,
        required: false,
    },
    certification: {
        type: Array,
        required: true,
    }
}, {
    timestamps: true,
});

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;