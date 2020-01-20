const Schema = require('mongoose').Schema;

module.exports = new Schema({
    isGuest: {
        type: Boolean,
        required: true
    },
    username: {
        type: String,
        minlength: 4,
        maxlength: 20
    },
    hash: {
        type: String
    }
});