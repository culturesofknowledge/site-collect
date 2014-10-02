var mongoose = require('mongoose')

var emlolangSchema = new mongoose.Schema({
  language_code: { type: String, trim: true },
  language_name: { type: String, trim: true },
  language_note: { type: String, trim: true }
});
  
module.exports = emlolangSchema;