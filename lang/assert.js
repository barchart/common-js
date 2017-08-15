const is = require('./is');

module.exports = (() => {
	'use strict';

	function checkArgumentType(variable, variableName, type, typeDescription, index) {
		if (type === String) {
			if (!is.string(variable)) {
				throwInvalidTypeError(variableName, 'string', index);
			}
		} else if (type === Number) {
			if (!is.number(variable)) {
				throwInvalidTypeError(variableName, 'number', index);
			}
		} else if (type === Function) {
			if (!is.fn(variable)) {
				throwInvalidTypeError(variableName, 'function', index);
			}
		} else if (type === Boolean) {
			if (!is.boolean(variable)) {
				throwInvalidTypeError(variableName, 'boolean', index);
			}
		} else if (type === Date) {
			if (!is.date(variable)) {
				throwInvalidTypeError(variableName, 'date', index);
			}
		} else if (type === Array) {
			if (!is.array(variable)) {
				throwInvalidTypeError(variableName, 'array', index);
			}
		} else if (!(variable instanceof (type || Object))) {
			throwInvalidTypeError(variableName, typeDescription, index);
		}
	}

	function throwInvalidTypeError(variableName, typeDescription, index) {
		let message;

		if (typeof(index) === 'number') {
			message = `The argument [ ${(variableName || 'unspecified')} ], at index [ ${index.toString()} ] must be a [ ${(typeDescription || 'unknown')} ]`;
		} else {
			message = `The argument [ ${(variableName || 'unspecified')} ] must be a [ ${(typeDescription || 'Object')} ]`;
		}

		throw new Error(message);
	}

	function throwCustomValidationError(variableName, predicateDescription) {
		throw new Error(`The argument [ ${(variableName || 'unspecified')} ] failed a validation check [ ${(predicateDescription || 'No description available')} ]`);
	}

	/**
	 * Utilities checking arguments.
	 *
	 * @public
	 * @module lang/assert
	 */
	return {
		/**
		 * Throws an error if an argument doesn't conform to the desired specification (as
		 * determined by a type check).
		 *
		 * @static
		 * @param {*} variable - The value to check.
		 * @param {String} variableName - The name of the value (used for formatting an error message).
		 * @param {*} type - The expected type of the argument.
		 * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
		 */
		argumentIsRequired(variable, variableName, type, typeDescription) {
			checkArgumentType(variable, variableName, type, typeDescription);
		},

		/**
		 * A relaxed version of the "argumentIsRequired" function that will not throw if
		 * the value is undefined or null.
		 *
		 * @static
		 * @param {*} variable - The value to check.
		 * @param {String} variableName - The name of the value (used for formatting an error message).
		 * @param {*} type - The expected type of the argument.
		 * @param {String=} typeDescription - The description of the expected type (used for formatting an error message).
		 */
		argumentIsOptional(variable, variableName, type, typeDescription, predicate, predicateDescription) {
			if (variable === null || variable === undefined) {
				return;
			}

			checkArgumentType(variable, variableName, type, typeDescription);

			if (is.fn(predicate) && !predicate(variable)) {
				throwCustomValidationError(variableName, predicateDescription);
			}
		},

		argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
			this.argumentIsRequired(variable, variableName, Array);

			if (itemConstraint) {
				let itemValidator;

				if (typeof(itemConstraint) === 'function' && itemConstraint !== Function) {
					itemValidator = (value, index) => value instanceof itemConstraint || itemConstraint(value, `${variableName}[${index}]`);
				} else {
					itemValidator = (value, index) => checkArgumentType(value, variableName, itemConstraint, itemConstraintDescription, index);
				}

				variable.forEach((v, i) => {
					itemValidator(v, i);
				});
			}
		},

		/**
		 * Throws an error if an argument doesn't conform to the desired specification
		 * (as determined by a predicate).
		 *
		 * @static
		 * @param {*} variable - The value to check.
		 * @param {String} variableName - The name of the value (used for formatting an error message).
		 * @param {Function=} predicate - A function used to validate the item (beyond type checking).
		 * @param {Function=} predicateDescription - A description of the assertion made by the predicate (e.g. "is an integer") that is used for formatting an error message.
		 */
		argumentIsValid(variable, variableName, predicate, predicateDescription) {
			if (!predicate(variable)) {
				throwCustomValidationError(variableName, predicateDescription);
			}
		},

		areEqual(a, b, descriptionA, descriptionB) {
			if (a !== b) {
				throw new Error(`The objects must be equal [${(descriptionA || a.toString())}] and [${(descriptionB || b.toString())}]`);
			}
		},

		areNotEqual(a, b, descriptionA, descriptionB) {
			if (a === b) {
				throw new Error(`The objects cannot be equal [${(descriptionA || a.toString())}] and [${(descriptionB || b.toString())}]`);
			}
		}
	};
})();