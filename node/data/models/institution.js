var mongoose = require('mongoose');

var institutionSchema = require('../schemas/institution');

module.exports = mongoose.model('Institution', institutionSchema);
