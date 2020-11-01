const Config = require("configstore");

const pkg = require("../package.json");

module.exports.config = new Config(pkg.name);
