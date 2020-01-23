const Schema = require('mongoose').Schema;

module.exports = new Schema({
    start: {
        type: Number,
        required: true
    },
    end: {
        type: Number,
        required: true
    }
});