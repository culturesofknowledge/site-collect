var mongoose = require('mongoose');
var WorkSchema = require('../schemas/work');

module.exports = mongoose.model('Work', WorkSchema);
