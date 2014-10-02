var mongoose = require('mongoose');

var locationSchema = require('../schemas/location');

module.exports = mongoose.model('Location', locationSchema);