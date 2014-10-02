var mongoose = require('mongoose')

var LanguageSchema = new mongoose.Schema({
  language_code: { type: String, trim: true },
  language_name: { type: String, trim: true }
}, {
  collection: 'language-fav' 
});
  
module.exports = LanguageSchema;