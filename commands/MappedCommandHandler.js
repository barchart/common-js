var _ = require('lodash');

var assert = require('./../lang/assert');
var CommandHandler = require('./CommandHandler');

module.exports = function() {
	'use strict';

	var MappedCommandHandler = CommandHandler.extend({
		init: function(nameExtractor) {
			assert.argumentIsRequired(nameExtractor, 'nameFunction', Function);

			this._super();

			this._handlerMap = {};
			this._defaultHandler = null;

			this._nameExtractor = nameExtractor;
		},

		addCommandHandler: function(name, commandHandler) {
			assert.argumentIsRequired(name, 'name', String);
			assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');

			if (_.has(this._handlerMap, name)) {
				throw new Error('A handler with the same name already exists in the map');
			}

			if (commandHandler === this) {
				throw new Error('Recursive use of mapped command handlers is prohibited');
			}

			this._handlerMap[name] = commandHandler;

			return this;
		},

		setDefaultCommandHandler: function(commandHandler) {
			assert.argumentIsRequired(commandHandler, 'commandHandler', CommandHandler, 'CommandHandler');

			this._defaultHandler = commandHandler;

			return this;
		},

		_process: function(data) {
			var handlerName = this._nameExtractor(data);
			var handler = this._handlerMap[handlerName] || this._defaultHandler;

			var returnRef;

			if (handler) {
				returnRef = handler.process(data);
			} else {
				returnRef = null;
			}

			return returnRef;
		},

		toString: function() {
			return '[MappedCommandHandler]';
		}
	});

	return MappedCommandHandler;
}();