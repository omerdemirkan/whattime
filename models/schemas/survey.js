const mongoose = require('mongoose');
const submitionSchema = require('./submition');

module.exports = new mongoose.Schema({
    format: String,
    submitions: [submitionSchema]
});