var mongoose = require('mongoose');
var ManifestationSchema = require('../schemas/manifestation');

var Manifestation = mongoose.model('Manifestation', ManifestationSchema,'collect_manifestation');

module.exports = Manifestation;