var mongoose = require('mongoose')
, Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var institutionSchema = Schema({
  id                          : Number,
  upload_id                   : Number,
  institution_id              :  { type: Number },
  union_institution_id        :  { type: Number },
  institution_name            :   { type: String },
  institution_city            :   { type: String },
  institution_country         :   { type: String },
  institution_synonyms        :   { type: String },
  institution_city_synonyms   :   { type: String },
  institution_country_synonyms:   { type: String },
  upload_uuid:              { type: Schema.ObjectId, ref: 'Upload', required: true }
}, { collection: 'collect_institution' });

/* need to create the id manually as it is part of a compound key RG 
institutionSchema.plugin(autoIncrement.plugin, { 
  model: 'Institution', 
  field: 'institution_id',
  startAt: 1000011,
  incrementBy: 1
});
*/

institutionSchema.statics.findByUploadUuid = function (uploadUuid, callback) {
  this.find(
    { upload_uuid: uploadUuid },
    {},
    //  'upload_name upload_username upload_status total_works works_accepted works_rejected uploader_email upload_description upload_timestamp',
    {sort: 'institution_id'},
    callback);
};

institutionSchema.index({ upload_uuid: 1, institution_id: 1 }, { unique: true })

module.exports = institutionSchema;