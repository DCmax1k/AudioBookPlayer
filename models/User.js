const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dateJoined: {
        type: Date,
        default: Date.now,
    },
    lastPlayed: {
        type: Object,
        default: {
            folder: '',
            file: '',
            duration: 0,
        },
    },
    rank: {
        type: String,
        default: "user",
    },
    settings: {
        type: Object,
        default: {

        }
    }

});

module.exports = mongoose.model('User', UserSchema);