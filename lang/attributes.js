const assert = require('./assert'),
	is = require('./is');

module.exports = (() => {
	'use strict';

	const attributes = {
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

		erase(target, propertyNames, separator) {
			if (!attributes.has(target, propertyNames)) {
				return;
			}

			const propertyNameArray = getPropertyNameArray(propertyNames, separator);
			const propertyTarget = getPropertyTarget(target, propertyNameArray, true);

			const propertyName = last(propertyNameArray);

			delete propertyTarget[propertyName];
		}
	};

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

	return attributes;
})();