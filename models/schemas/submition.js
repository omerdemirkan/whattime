const Schema = require('mongoose').Schema;

module.exports = new Schema({
    available: {
        type: Array,
        minlength: 1,
        maxlength: 10
    }
});