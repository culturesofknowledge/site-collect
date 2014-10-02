var mongoose = require('mongoose');

var LanguageSchema = require('../schemas/language');

module.exports = mongoose.model('Language', LanguageSchema);