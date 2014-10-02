var mongoose = require('mongoose');

var uploadSchema = new mongoose.Schema({
  upload_name       : String,
  upload_username   : String,
  upload_status     : Number,
  total_works       : Number,
  works_accepted    : Number,
  works_rejected    : Number,
  uploader_email    : String,
  upload_description: String,
  upload_timestamp  : Date,
  upload_id         : Number
}, { collection: 'upload' });

uploadSchema.statics.findByUsername = function (userid, callback) {
  this.find(
    { upload_username: userid },
    'upload_name upload_username upload_status total_works works_accepted works_rejected uploader_email upload_description upload_timestamp',
    {sort: 'upload_timestamp'},
    callback);
};

module.exports = uploadSchema;