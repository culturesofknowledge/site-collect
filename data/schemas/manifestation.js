var Schema = require('mongoose').Schema,
    autoIncrement = require('mongoose-auto-increment');

var manifestationSchema = new Schema({
  upload_id               :   { type: Number },
  iwork_id                :   { type: Number },
  union_manifestation_id  :   { type: String },
  manifestation_id        :   { type: Number },
  manifestation_type      :   { type: String },
  repository_id           :   { type: Number, ref: 'Institution' },
  id_number_or_shelfmark  :   { type: String },
  printed_edition_details :   { type: String },
  manifestation_notes     :   { type: String },
  image_filenames         :   [{ type: String }],
  upload_uuid:              { type: Schema.ObjectId, ref: 'Upload', required: true }
});

manifestationSchema.statics.search = function(str, callback) {
  var regexp = new RegExp(str, 'i');
  return this.find({
    '$or': [
      {id_number_or_shelfmark: regexp}, 
      {manifestation_notes: regexp}]
  }, callback);
};

manifestationSchema.plugin(autoIncrement.plugin, { model: 'Manifestation', field: 'manifestation_id' });

manifestationSchema.statics.findByUploadWorkID = function (uploadUuid, workID ,callback) {
  this.find(
    { upload_uuid: uploadUuid , iwork_id: workID },
    {},
    {sort: 'manifestation_id'},
    callback);
};

manifestationSchema.index({ upload_uuid: 1, iwork_id: 1 }, { unique: true })

module.exports = manifestationSchema;