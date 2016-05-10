var assert = require('./../lang/assert');
var CommandHandler = require('./CommandHandler');

module.exports = function() {
	'use strict';

	var CompositeCommandHandler = CommandHandler.extend({
		init: function(commandHandlerA, commandHandlerB) {
			assert.argumentIsRequired(commandHandlerA, 'commandHandlerA', CommandHandler, 'CommandHandler');
			assert.argumentIsRequired(commandHandlerB, 'commandHandlerB', CommandHandler, 'CommandHandler');
			assert.areNotEqual(commandHandlerA, commandHandlerB, 'commandHandlerA', 'commandHandlerB');

			this._super();

			this._commandHandlerA = commandHandlerA;
			this._commandHandlerB = commandHandlerB;
		},

		_process: function(data) {
			return this._commandHandlerA.process(data) && this._commandHandlerB.process(data);
		},

		toString: function() {
			return '[CompositeCommandHandler]';
		}
	});

	return CompositeCommandHandler;
}();