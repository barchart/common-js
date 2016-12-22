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
				c = Object.keys(target).reduce((accumulator, key) => {
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
				const properties = array.unique(Object.keys(a).concat(Object.keys(b)));

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
		}
	};

	return object;
})();