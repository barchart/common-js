var CommandHandler = require('./CommandHandler');
var CompositeCommandHandler = require('./CompositeCommandHandler');
var MappedCommandHandler = require('./MappedCommandHandler');

module.exports = function() {
	'use strict';

	return {
		CommandHandler: CommandHandler,
		CompositeCommandHandler: CompositeCommandHandler,
		MappedCommandHandler: MappedCommandHandler
	};
}();