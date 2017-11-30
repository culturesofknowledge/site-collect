var Schema = require('mongoose').Schema,
    autoIncrement = require('mongoose-auto-increment');

//var institutionSchema = require('./institution');
var uploadSchema = require('./upload');
var manifestationSchema = require('./manifestation');
var personSchema = require('./person');
var locationSchema = require('./location');
var emlodateSchema = require('./emlodate');
var languageSchema = require('./emlolang');
var resourceSchema = require('./resource');

var workSchema = new Schema({
  iwork_id:                 { type: Number },
  date_of_work_as_marked:   { type: String, default : "" },
  original_calendar:        { type: String, default : "" },
//  date_of_work:             {
  date_of_work_std_year:     { type: String, trim: true },
  date_of_work_std_month:    { type: String, trim: true, min: 1, max: 12, required: false },
  date_of_work_std_day:      { type: String, trim: true, min: 1, max: 31, required: false },
  date_of_work_inferred: { type: Boolean, default : ""  },
  date_of_work_uncertain:{ type: Boolean, default : ""  },
  date_of_work_approx:   { type: Boolean, default : ""  },
  date_of_work2_std_year:     { type: String, trim: true },
  date_of_work2_std_month:    { type: String, trim: true, min: 1, max: 12, required: false },
  date_of_work2_std_day:      { type: String, trim: true, min: 1, max: 31, required: false },
  date_of_work2_inferred: { type: Boolean, default : ""  },
  date_of_work2_uncertain:{ type: Boolean, default : ""  },
  date_of_work2_approx:   { type: Boolean, default : ""  },
//  },
  notes_on_date_of_work:    { type: String, default : "" },
  authors:                  [{type: Schema.Types.ObjectId, ref: 'Person'}],
  authors_as_marked:        { type: String, default : "" },
  authors_inferred:         { type: Boolean, default : "" },
  authors_uncertain:        { type: Boolean, default : "" },
  notes_on_authors:         { type: String, default : "" },
  addressees:               [{type: Schema.Types.ObjectId, ref: 'Person' }],
  addressees_as_marked:     { type: String, default : "" },
  addressees_inferred:      { type: Boolean, default : "" },
  addressees_uncertain:     { type: Boolean, default : "" },
  notes_on_addressees:      { type: String, default : "" },
  origin_id:                [{type: Schema.Types.ObjectId, ref: 'Location' }],
  origin_as_marked:         { type: String, default : "" },
  origin_inferred:          { type: Boolean, default : "" },
  origin_uncertain:         { type: Boolean, default : "" },
  notes_on_origin:          { type: String, default : "" },
  destination_id:           [{type: Schema.Types.ObjectId, ref: 'Location' }],
  destination_as_marked:    { type: String, default : "" },
  destination_inferred:     { type: Boolean, default : "" },
  destination_uncertain:    { type: Boolean, default : "" },
  notes_on_destination:     { type: String, default : "" },
  place_mentioned:          [{type: Schema.Types.ObjectId, ref: 'Location' }],
  place_mentioned_as_marked:{ type: String, default : "" },
  place_mentioned_inferred: { type: Boolean, default : "" },
  place_mentioned_uncertain:{ type: Boolean, default : "" },
  notes_on_place_mentioned: { type: String, default : "" },
  abstract:                 { type: String, default : "" },
  keywords:                 { type: String, default : "" },
  languages:                [ languageSchema ],
  incipit:                  { type: String, default : "" },
  explicit:                 { type: String, default : "" },
  notes_on_letter:          { type: String, default : "" },
  people_mentioned:         [{type: Schema.Types.ObjectId, ref: 'Person' }],
  mentioned_as_marked:      { type: String, default : "" },
  mentioned_inferred:       { type: Boolean, default : "" },
  mentioned_uncertain:      { type: Boolean, default : "" },
  notes_on_people_mentioned:{ type: String, default : "" },
  editors_notes:            { type: String, default : "" },
  upload_uuid:              { type: Schema.ObjectId, ref: 'Upload', required: true },
  editor:                   { type: Schema.ObjectId, ref: 'User', required: false },
  contributors:             [{type: Schema.Types.ObjectId, ref: 'User'}],
  manifestations:           [{type: Schema.Types.ObjectId, ref: 'Manifestation'}],
  resources:                [ resourceSchema ],
  updated:                  { type: Date }
}, {
  collection: 'collect_work' 
});

workSchema.plugin(autoIncrement.plugin, { model: 'Work', field: 'iwork_id' });

workSchema.statics.findByUploadUuidWithNames = function (uploadUuid, callback) {
  this
        .find(
                { upload_uuid: uploadUuid },
                {},
                {sort: 'iwork_id'},
                callback)
        .populate("authors addressees", "primary_name _id")     ;
};

workSchema.statics.findByUploadUuidWithAllPopulated = function (uploadUuid, callback) {
  this
      .find(
      { upload_uuid: uploadUuid },
      {},
      {sort: 'iwork_id'},
      callback)
      .populate("authors addressees people_mentioned" )
      .populate("destination_id origin_id place_mentioned" )
  ;
};

workSchema.statics.findByUploadUuid = function (uploadUuid, callback) {
  this
	.find(
    		{ upload_uuid: uploadUuid },
    		{},
    		{sort: 'iwork_id'},
    		callback)
};

workSchema.index({ upload_uuid: 1, iwork_id: 1 }, { unique: true })

module.exports = workSchema;
