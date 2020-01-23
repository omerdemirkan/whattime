const Schema = require('mongoose').Schema;
const surveySchema = require('./survey');

module.exports = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        minlength: 4,
        maxlength: 20
    },
    hash: {
        type: String,
        required: true
    }
}, {timestamps: true});