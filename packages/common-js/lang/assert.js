import * as is from './is.js';

const nativeTypes = [ String, Number, Function, Boolean, Date, Array, Object, RegExp ];

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
	} else if (type === RegExp) {
		if (!is.regexp(variable)) {
			throwInvalidTypeError(variableName, 'RegExp', index);
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

/**
 * Throws an error if an argument doesn't conform to the desired specification (as
 * determined by a type check).
 *
 * @static
 * @param {*} variable - The value to check.
 * @param {string=} variableName - The name of the value (used for formatting an error message).
 * @param {*=} type - The expected type of the argument.
 * @param {string=} typeDescription - The description of the expected type (used for formatting an error message).
 */
export function argumentIsRequired(variable, variableName, type, typeDescription) {
	checkArgumentType(variable, variableName, type, typeDescription);
}

/**
 * A relaxed version of the "argumentIsRequired" function that will not throw if
 * the value is undefined or null.
 *
 * @static
 * @param {*} variable - The value to check.
 * @param {string=} variableName - The name of the value (used for formatting an error message).
 * @param {*=} type - The expected type of the argument.
 * @param {string=} typeDescription - The description of the expected type (used for formatting an error message).
 * @param {Function=} predicate - A function used to validate the item (beyond type checking).
 * @param {string=} predicateDescription - A description of the assertion made by the predicate (e.g. "is an integer") that is used for formatting an error message.
 */
export function argumentIsOptional(variable, variableName, type, typeDescription, predicate, predicateDescription) {
	if (variable === null || variable === undefined) {
		return;
	}

	checkArgumentType(variable, variableName, type, typeDescription);

	if (is.fn(predicate) && !predicate(variable)) {
		throwCustomValidationError(variableName, predicateDescription);
	}
}

/**
 * Throws an error when a value is not an array or its items do not satisfy the supplied constraint.
 *
 * @public
 * @param {*} variable
 * @param {*} variableName
 * @param {*} itemConstraint
 * @param {*} itemConstraintDescription
 */
export function argumentIsArray(variable, variableName, itemConstraint, itemConstraintDescription) {
	argumentIsRequired(variable, variableName, Array);

	if (itemConstraint) {
		let itemValidator;

		if (nativeTypes.includes(itemConstraint)) {
			itemValidator = (value, index) => checkArgumentType(value, variableName, itemConstraint, itemConstraintDescription, index);
		} else {
			itemValidator = (value, index) => {
				if (itemConstraint.prototype !== undefined && value instanceof itemConstraint) {
					return;
				}

				itemConstraint(value, `${variableName}[${index}]`);
			};
		}

		variable.forEach((v, i) => {
			itemValidator(v, i);
		});
	}
}

/**
 * Throws an error if an argument doesn't conform to the desired specification
 * (as determined by a predicate).
 *
 * @static
 * @param {*} variable - The value to check.
 * @param {string=} variableName - The name of the value (used for formatting an error message).
 * @param {Function=} predicate - A function used to validate the item (beyond type checking).
 * @param {string=} predicateDescription - A description of the assertion made by the predicate (e.g. "is an integer") that is used for formatting an error message.
 */
export function argumentIsValid(variable, variableName, predicate, predicateDescription) {
	if (!predicate(variable)) {
		throwCustomValidationError(variableName, predicateDescription);
	}
}

/**
 * Throws an error when two values are not strictly equal.
 *
 * @public
 * @param {*} a
 * @param {*} b
 * @param {*=} descriptionA
 * @param {*=} descriptionB
 */
export function areEqual(a, b, descriptionA, descriptionB) {
	if (a !== b) {
		throw new Error(`The objects must be equal [${(descriptionA || a.toString())}] and [${(descriptionB || b.toString())}]`);
	}
}

/**
 * Throws an error when two values are strictly equal.
 *
 * @public
 * @param {*} a
 * @param {*} b
 * @param {*} descriptionA
 * @param {*} descriptionB
 */
export function areNotEqual(a, b, descriptionA, descriptionB) {
	if (a === b) {
		throw new Error(`The objects cannot be equal [${(descriptionA || a.toString())}] and [${(descriptionB || b.toString())}]`);
	}
}
