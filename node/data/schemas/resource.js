var mongoose = require('mongoose')

var resourceSchema = new mongoose.Schema({
  resource_name   : { type: String, trim: true },
  resource_details: { type: String, trim: true },
  resource_url    : { type: String, trim: true }
});
  
module.exports = resourceSchema;