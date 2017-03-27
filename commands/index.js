const CommandHandler = require('./CommandHandler'),
	CompositeCommandHandler = require('./CompositeCommandHandler'),
	MappedCommandHandler = require('./MappedCommandHandler');

module.exports = (() => {
	'use strict';

	return {
		CommandHandler: CommandHandler,
		CompositeCommandHandler: CompositeCommandHandler,
		MappedCommandHandler: MappedCommandHandler
	};
})();