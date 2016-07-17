var assert = require('./assert');

module.exports = (() => {
	'use strict';

	const attributes = {
		has: (target, propertyNames) => {
			assert.argumentIsRequired(target, 'target', Object);
			assert.argumentIsRequired(propertyNames, 'propertyNames', String);

			const propertyNameArray = getPropertyNameArray(propertyNames);
			const propertyTarget = getPropertyTarget(target, propertyNameArray, false);

			return propertyTarget !== null && propertyTarget.hasOwnProperty(last(propertyNameArray));
		},

		read: (target, propertyNames) => {
			assert.argumentIsRequired(target, 'target', Object);
			assert.argumentIsRequired(propertyNames, 'propertyNames', String);

			const propertyNameArray = getPropertyNameArray(propertyNames);
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

		write: (target, propertyNames, value) => {
			assert.argumentIsRequired(target, 'target', Object);
			assert.argumentIsRequired(propertyNames, 'propertyNames', String);

			const propertyNameArray = getPropertyNameArray(propertyNames);
			const propertyTarget = getPropertyTarget(target, propertyNameArray, true);

			const propertyName = last(propertyNameArray);

			propertyTarget[propertyName] = value;
		}
	};

	function getPropertyNameArray(propertyNames) {
		return propertyNames.split('.');
	}

	function getPropertyTarget(target, propertyNameArray, create) {
		let returnRef;

		let propertyTarget = target;

		for (let i = 0; i < (propertyNameArray.length - 1); i++) {
			let propertyName = propertyNameArray[i];

			if (propertyTarget.hasOwnProperty(propertyName)) {
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

	const last = (array) => {
		if (array.length !== 0) {
			return array[array.length - 1];
		} else {
			return null;
		}
	};

	return attributes;
})();