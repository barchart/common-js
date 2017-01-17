var collections = require('./collections/index');
var commands = require('./commands/index');
var lang = require('./lang/index');
var messaging = require('./messaging/index');
var models = require('./models/index');
var network = require('./network/index');
var specifications = require('./specifications/index');
var timing = require('./timing/index');

var object = require('./lang/object');

module.exports = (() => {
	'use strict';

	const namespaces = {
		Collections: collections,
		Commands: commands,
		Messaging: messaging,
		Models: models,
		Network: network,
		Timing: timing,
		Specifications: specifications
	};

	object.keys(lang).forEach((key) => {
		namespaces[key] = lang[key];
	});

	return namespaces;
})();