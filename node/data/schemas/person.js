var Schema = require('mongoose').Schema;
var autoIncrement = require('mongoose-auto-increment');
//var uploadSchema = require('./upload');

var personSchema = new Schema({
//  _id                     : Number,
  upload_uuid:              { type: Schema.ObjectId, ref: 'Upload', required: true },
  name                    : String,
  iperson_id              : Number,
  union_iperson_id        : Number,
  primary_name            : String,
  alternative_names       : String,
  roles_or_titles         : String,
  gender                  : String,
  is_organisation         : String,
  organisation_type       : Number,
  date_of_birth_year      : Number,
  date_of_birth_month     : Number,
  date_of_birth_day       : Number,
  date_of_birth_is_range  : Number,
  date_of_birth2_year     : Number,
  date_of_birth2_month    : Number,
  date_of_birth2_day      : Number,
  date_of_birth_inferred  : Number,
  date_of_birth_uncertain : Number,
  date_of_birth_approx    : Number,
  date_of_death_year      : Number,
  date_of_death_month     : Number,
  date_of_death_day       : Number,
  date_of_death_is_range  : Number,
  date_of_death2_year     : Number,
  date_of_death2_month    : Number,
  date_of_death2_day      : Number,
  date_of_death_inferred  : Number,
  date_of_death_uncertain : Number,
  date_of_death_approx    : Number,
  flourished_year         : Number,
  flourished_month        : Number,
  flourished_day          : Number,
  flourished_is_range     : Number,
  flourished2_year        : Number,
  flourished2_month       : Number,
  flourished2_day         : Number,
  notes_on_person         : String,
  editors_notes           : String
}, { collection: 'collect_person' });


personSchema.plugin(autoIncrement.plugin, { 
  model: 'Person', 
  field: 'iperson_id',
  startAt: 1000011,
  incrementBy: 1
});

/**/
personSchema.statics.findByUploadUuid = function (uploadUuid, callback) {
  this.find(
    { upload_uuid: uploadUuid },
    {},
    //  'upload_name upload_username upload_status total_works works_accepted works_rejected uploader_email upload_description upload_timestamp',
    {sort: 'institution_id'},
    callback);
};

//var Person = mongoose.model('Person', personSchema);
module.exports = personSchema;