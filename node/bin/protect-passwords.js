/*
var mongoose = require( 'mongoose' );
var bcrypt = require( 'bcryptjs');

var configSection = process.env.NODE_ENV || "docker-development";
config = require('../config/config.json')[configSection];

var url =  config.dbURL;
url = "mongodb://mongo:27017/emlo-edit";
console.log("url",url);

mongoose.connect(url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var userSchema = new mongoose.Schema({
	username: {type: String, unique: true},
	name    : {type: String},
	password: {type: String},
	email   : {type: String},
	lastLogin : {type: Date },
	modifiedOn : {type : Date },
	roles : [{type : String}]
});

var User = mongoose.model('User', userSchema);

console.log("Fixing user's unhashed passwords...");

db.once('open', function () {
	console.log("Connected!");
	User.find( {
			username: 'cofkrenhart',
			password: { $exists: true }
		})
		.forEach( function( user ) {
			var hash = bcrypt.hashSync(user.password, 3);

			user.hash = hash;
			User.save(user);//user.save();
			//User.update( {_id:user._id}, {hashee:"hashy",email:"knoby"}, function(err) {
			//	if(err) console.log(err);
			//	console.log("Updated?");
			//});
		})
});
*/
const MongoClient = require('mongodb').MongoClient;
var bcrypt = require( 'bcryptjs');

MongoClient.connect("mongodb://mongo:27017/emlo-edit", function (error, db) {
	if (error) {
		console.error( "Failed to connect");
		return complete(error)
	}
	else {

		const collection = db.collection("users");

		collection.find({
			password: { $exists: true }
		}).toArray( function(error, users) {
			users.forEach(function (user, i) {
				user.hash = bcrypt.hashSync( user.password, 12 );
				collection.update( {_id: user._id}, user, function (error) {
					// done
					console.log( i, "Updated", user.username );
				})
			});
		})
	}
});