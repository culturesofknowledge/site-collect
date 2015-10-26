var mongoose = require('mongoose');
// var UserSchema = require('../schemas/user');
var userSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  name    : {type: String},
  password: {type: String},
  email   : {type: String},
  lastLogin : {type: Date },
  modifiedOn : {type : Date }
});

module.exports = mongoose.model('User', userSchema);
