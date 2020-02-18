const mongoose = require('mongoose');
const submissionSchema = require('./submission');

module.exports = new mongoose.Schema({
    event: {
        type: String,
        minlength: 4,
        maxLength: 30,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    creatorID: {
        type: String,
        required: true
    },
    nameType: {
        type: String,
        required: true
    },
    submissions: {
        type: [submissionSchema],
        default: [],
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});