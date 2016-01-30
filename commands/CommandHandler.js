var Class = require('class.extend');

var assert = require('./../lang/assert');

module.exports = function() {
	'use strict';

	var CommandHandler = Class.extend({
		init: function() {
		},

		process: function(data) {
			return this._process(data);
		},

		_process: function(data) {
			return true;
		},

		toString: function() {
			return '[CommandHandler]';
		}
	});

	var DelegateCommandHandler = CommandHandler.extend({
		init: function(handler) {
			this._super();

			this._handler = handler;
		},

		_process: function(data) {
			return this._handler(data);
		}
	});

	CommandHandler.toFunction = function(commandHandler) {
		assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');

		return function(data) {
			return commandHandler.process(data);
		};
	};

	CommandHandler.fromFunction = function(handler) {
		assert.argumentIsRequired(handler, 'handler', Function);

		return new DelegateCommandHandler(handler);
	};

	return CommandHandler;
}();