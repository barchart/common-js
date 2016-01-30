var _ = require('lodash');

module.exports = function() {
	'use strict';

	var assert = {
		argumentIsRequired: function(variable, variableName, type, typeDescription) {
			checkArgumentType(variable, variableName, type, typeDescription);
		},

		argumentIsOptional: function(variable, variableName, type, typeDescription) {
			if (_.isNull(variable) || _.isUndefined(variable)) {
				return;
			}

			checkArgumentType(variable, variableName, type, typeDescription);
		},

		argumentIsArray: function(variable, variableName, itemType, itemTypeDescription) {
			assert.argumentIsRequired(variable, variableName, Array);

			for (var i = 0; i < variable.length; i++) {
				checkArgumentType(variable[i], variableName, itemType, itemTypeDescription, i);
			}
		},

		areEqual: function(a, b, descriptionA, descriptionB) {
			if (a !== b) {
				throw new Error('The objects must be equal ([' + (descriptionA || a.toString()) + ' and ' + (descriptionB || n.toString()));
			}
		},

		areNotEqual: function(a, b, descriptionA, descriptionB) {
			if (a === b) {
				throw new Error('The objects cannot be equal ([' + (descriptionA || a.toString()) + ' and ' + (descriptionB || n.toString()));
			}
		}
	};

	function checkArgumentType(variable, variableName, type, typeDescription, index) {
		if (type === String) {
			if (!_.isString(variable)) {
				throwInvalidTypeError(variableName, 'string', index);
			}
		} else if (type === Number) {
			if (!_.isNumber(variable)) {
				throwInvalidTypeError(variableName, 'number', index);
			}
		} else if (type === Function) {
			if (!_.isFunction(variable)) {
				throwInvalidTypeError(variableName, 'function', index);
			}
		} else if (type === Boolean) {
			if (!_.isBoolean(variable)) {
				throwInvalidTypeError(variableName, 'boolean', index);
			}
		} else if (type === Date) {
			if (!_.isDate(variable)) {
				throwInvalidTypeError(variableName, 'date', index);
			}
		} else if (type === Array) {
			if (!_.isArray(variable)) {
				throwInvalidTypeError(variableName, 'array', index);
			}
		} else if (!(variable instanceof (type || Object))) {
			throwInvalidTypeError(variableName, typeDescription, index);
		}
	}

	function throwInvalidTypeError(variableName, typeDescription, index) {
		var message;

		if (_.isNumber(index)) {
			message = 'The argument [' + (variableName || 'unspecified') + '], at index [' + index.toString() + '] must be a ' + (typeDescription || 'unknown');
		} else {
			message = 'The argument [' + (variableName || 'unspecified') + '] must be a ' + (typeDescription || 'Object');
		}

		throw new Error(message);
	}

	return assert;
}();