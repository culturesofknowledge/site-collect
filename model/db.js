// Bring Mongoose into the work
var mongoose = require( 'mongoose-paginate' );
console.log('config.', config);

// Build the connection string
// var dbURI = 'mongodb://localhost/MongoosePM';
var dbURI = config.dbURL;

// Create the database connection
mongoose.connect(dbURI);

// Define connection events
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});
//console.log('mongoose-connect',mongoose.connection);

//This is a one-time operation I think but is that per start-up as in singleton
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var DataTable = require('mongoose-datatable');

DataTable.configure({ verbose: true, debug : true });
mongoose.plugin(DataTable.init);
