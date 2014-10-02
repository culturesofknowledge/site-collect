var mongoose = require('mongoose')
, Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var locationSchema = Schema({
  //_id       : Number,
  //name                   : String,
  upload_id              : Number,
  location_id            :  { type: Number },
  union_location_id      :  { type: Number },
  location_name          :  { type: String },
  location_synonyms      :  { type: String },
  latitude               :  { type: String },
  longitude              :  { type: String },
  room                   :  { type: String },
  building               :  { type: String },
  parish                 :  { type: String },
  city                   :  { type: String },
  county                 :  { type: String },
  country                :  { type: String },
  empire                 :  { type: String },
  notes_on_place         :  { type: String },
  editors_notes          :  { type: String },
  upload_uuid:              { type: Schema.ObjectId, ref: 'Upload', required: true }
}, { collection: 'collect_location' });

locationSchema.plugin(autoIncrement.plugin, { 
  model: 'Location', 
  field: 'location_id',
  startAt: 1000011,
  incrementBy: 1
});

locationSchema.statics.findByUploadUuid = function (uploadUuid, callback) {
  this.find(
    { upload_uuid: uploadUuid },
    {},
    //  'upload_name upload_username upload_status total_works works_accepted works_rejected uploader_email upload_description upload_timestamp',
    {sort: 'location_name'},
    callback);
};

//var Place = mongoose.model('Location', locationSchema);
module.exports = locationSchema;