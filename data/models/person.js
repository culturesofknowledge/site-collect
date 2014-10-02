var mongoose = require('mongoose');

var personSchema = require('../schemas/person');

module.exports = mongoose.model('Person', personSchema);