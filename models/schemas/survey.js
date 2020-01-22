const mongoose = require('mongoose');
const submitionSchema = require('./submition');

module.exports = new mongoose.Schema({
    event: String,
    date: String,
    creatorID: String,
    submitions: [submitionSchema]
}, {timestamps: true});