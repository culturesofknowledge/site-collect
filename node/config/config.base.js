// Base config, copy to config.local.js to add new values where needed
// NO PASSWORDS HERE!
var config = {
	dbURL: null, // i.e. "mongodb://domain:port/database"
	conString: null, // i.e. "postgres://username:password@domain:port/database"

	port: "3000",

	api_keys:  []
};

module.exports = config;