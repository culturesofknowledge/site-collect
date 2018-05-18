// Base config, require and edit in config.js
var configBase = {
	dbURL: /\?/, // i.e. "mongodb://domain:port/database"
	conString: /\?/, // i.e. "postgres://username:password@domain:port/database"

	port: "3000",

	api_keys:  []
};

module.exports = configBase;