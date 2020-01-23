const mongoose = require('mongoose');
const submitionSchema = require('./submition');

module.exports = new mongoose.Schema({
    event: {
        type: String,
        minlength: 4,
        maxLength: 30
    },
    date: Date,
    creator: String,
    creatorID: String,
    submitions: [submitionSchema]
}, {timestamps: true});