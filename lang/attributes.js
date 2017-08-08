const assert = require('./assert'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	function getPropertyNameArray(propertyNames, separator = '.') {
		let returnRef;

		if (is.array(propertyNames)) {
			returnRef = propertyNames;
		} else {
			returnRef = propertyNames.split(separator);
		}

		return returnRef;
	}

	function getPropertyTarget(target, propertyNameArray, create) {
		let returnRef;

		let propertyTarget = target;

		for (let i = 0; i < (propertyNameArray.length - 1); i++) {
			let propertyName = propertyNameArray[i];

			if (propertyTarget.hasOwnProperty(propertyName) && !is.null(propertyTarget[propertyName]) && !is.undefined(propertyTarget[propertyName])) {
				propertyTarget = propertyTarget[propertyName];
			} else if (create) {
				propertyTarget = propertyTarget[propertyName] = {};
			} else {
				propertyTarget = null;

				break;
			}
		}

		return propertyTarget;
	}

	function last(array) {
		if (array.length !== 0) {
			return array[array.length - 1];
		} else {
			return null;
		}
	}

	/**
	 * Utilities for reading and writing "complex" properties to
	 * objects. For example, the property "name.first" reads the
	 * "first" property on the "name" object of the target.
	 *
	 * @public
	 * @module lang/attributes
	 */
	return {
		/**
		 * Checks to see if an attribute exists on the target object.
		 *
		 * @static
		 * @param {Object} target - The object to check for existence of the property.
		 * @param {String|Array<String>} propertyNames - The property to check -- either a string with separators, or an array of strings (already split by separator).
		 * @param {String=} separator - The separator (defaults to a period character).
		 * @returns {boolean}
		 */
		has(target, propertyNames, separator) {
			assert.argumentIsRequired(target, 'target', Object);

			if (is.array(propertyNames)) {
				assert.argumentIsArray(propertyNames, 'propertyNames', String);
			} else {
				assert.argumentIsRequired(propertyNames, 'propertyNames', String);
			}

			const propertyNameArray = getPropertyNameArray(propertyNames, separator);
			const propertyTarget = getPropertyTarget(target, propertyNameArray, false);

			return propertyTarget !== null && propertyTarget.hasOwnProperty(last(propertyNameArray));
		},

		/**
		 * Returns a value from the target object. If the property doesn't exist; undefined
		 * is returned.
		 *
		 * @static
		 * @param {Object} target - The object to read from.
		 * @param {String|Array<String>} propertyNames - The property to read -- either a string with separators, or an array of strings (already split by separator).
		 * @param {String=} separator - The separator (defaults to a period character).
		 * @returns {*}
		 */
		read(target, propertyNames, separator) {
			assert.argumentIsRequired(target, 'target', Object);

			if (is.array(propertyNames)) {
				assert.argumentIsArray(propertyNames, 'propertyNames', String);
			} else {
				assert.argumentIsRequired(propertyNames, 'propertyNames', String);
			}

			const propertyNameArray = getPropertyNameArray(propertyNames, separator);
			const propertyTarget = getPropertyTarget(target, propertyNameArray, false);

			let returnRef;

			if (propertyTarget) {
				const propertyName = last(propertyNameArray);

				returnRef = propertyTarget[propertyName];
			} else {
				returnRef = undefined;
			}

			return returnRef;
		},

		/**
		 * Writes a value to the target object.
		 *
		 * @static
		 * @param {Object} target - The object to write to.
		 * @param {String|Array<String>} propertyNames - The property to write -- either a string with separators, or an array of strings (already split by separator).
		 * @param {String=} separator - The separator (defaults to a period character).
		 */
		write(target, propertyNames, value, separator) {
			assert.argumentIsRequired(target, 'target', Object);

			if (is.array(propertyNames)) {
				assert.argumentIsArray(propertyNames, 'propertyNames', String);
			} else {
				assert.argumentIsRequired(propertyNames, 'propertyNames', String);
			}

			const propertyNameArray = getPropertyNameArray(propertyNames, separator);
			const propertyTarget = getPropertyTarget(target, propertyNameArray, true);

			const propertyName = last(propertyNameArray);

			propertyTarget[propertyName] = value;
		},

		/**
		 * Erases a property from the target object.
		 *
		 * @static
		 * @param {Object} target - The object to erase a property from.
		 * @param {String|Array<String>} propertyNames - The property to write -- either a string with separators, or an array of strings (already split by separator).
		 * @param {String=} separator - The separator (defaults to a period character).
		 */
		erase(target, propertyNames, separator) {
			if (!this.has(target, propertyNames)) {
				return;
			}

			const propertyNameArray = getPropertyNameArray(propertyNames, separator);
			const propertyTarget = getPropertyTarget(target, propertyNameArray, true);

			const propertyName = last(propertyNameArray);

			delete propertyTarget[propertyName];
		}
	};
})();