const mongoose = require('mongoose');
const surveySchema = require('./schemas/survey');

module.exports = mongoose.model('Survey', surveySchema);