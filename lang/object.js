var array = require('./array');
var is = require('./is');

module.exports = (() => {
	'use strict';

	const object = {
		clone(target) {
			let c;

			if (is.array(target)) {
				c = target.map((targetItem) => {
					return object.clone(targetItem);
				});
			} else if (is.object(target)) {
				c = object.keys(target).reduce((accumulator, key) => {
					accumulator[key] = object.clone(target[key]);

					return accumulator;
				}, { });
			} else {
				c = target;
			}

			return c;
		},

		merge(a, b) {
			let m;

			const mergeTarget = is.object(a) && !is.array(a);
			const mergeSource = is.object(b) && !is.array(b);

			if (mergeTarget && mergeSource) {
				const properties = array.unique(object.keys(a).concat(object.keys(b)));

				m = properties.reduce((accumulator, property) => {
					accumulator[property] = object.merge(a[property], b[property]);

					return accumulator;
				}, { });
			} else if (is.undefined(b)) {
				m = object.clone(a);
			} else {
				m = object.clone(b);
			}

			return m;
		},

		keys(target) {
			const keys = [];

			for (var k in target) {
				if (target.hasOwnProperty(k)) {
					keys.push(k);
				}
			}

			return keys;
		}
	};

	return object;
})();