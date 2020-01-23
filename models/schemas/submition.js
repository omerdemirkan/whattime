const Schema = require('mongoose').Schema;
const timespanSchema = require('./timespan');

module.exports = new Schema({
    available: {
        type: [timespanSchema],
        minlength: 1,
        maxlength: 10
    }
});