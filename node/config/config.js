var configBase = require("./config.base");
var configLocal = require("./config.local");

var config = {};

Object.assign(config, configBase, configLocal);

module.exports = config;