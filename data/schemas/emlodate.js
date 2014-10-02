var mongoose = require('mongoose')

var emlodateSchema = new mongoose.Schema({
  std_year:     { type: String },
  std_month:    { type: String, min: 1, max: 12, required: false },
  std_day:      { type: String, min: 1, max: 31, required: false },
  inferred:     { type: Boolean },
  uncertain:    { type: Boolean },
  approx:       { type: Boolean },
  end_year:     { type: String },
  end_month:    { type: String, min: 1, max: 12, required: false },
  end_day:      { type: String, min: 1, max: 31, required: false },
  end_inferred: { type: Boolean },
  end_uncertain:{ type: Boolean },
  end_approx:   { type: Boolean },
});
  
module.exports = emlodateSchema;