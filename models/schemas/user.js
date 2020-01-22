const Schema = require('mongoose').Schema;
const surveySchema = require('./survey');

module.exports = new Schema({
    username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 20
    },
    hash: {
        type: String,
        required: true
    },
    surveys: {
        type: [surveySchema],
        default: []
    }
});