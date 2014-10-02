var mongoose = require('mongoose');

var UploadSchema = require('../schemas/upload');

module.exports = mongoose.model('Upload', UploadSchema);