const Schema = require('mongoose').Schema;

module.exports = new Schema({
    available: [Number],
    name: {
        type: String,
        minlength: 3,
        maxlength: 30
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});