var mongoose = require('mongoose');
// var UserSchema = require('../schemas/user');
var userSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  name    : {type: String},
  password: {type: String}, // TODO: REMOVE!
    hash: {type: String}, // TODO: ENGAGE!
  email   : {type: String},
  lastLogin : {type: Date },
  modifiedOn : {type : Date },
  roles : [{type : String}]
});

module.exports = mongoose.model('User', userSchema);
