const assert = require('./assert'),
	array = require('./array'),
	attributes = require('./attributes'),
	connection = require('./connection'),
	converters = require('./converters'),
	date = require('./date'),
	Disposable = require('./Disposable'),
	is = require('./is'),
	mask = require('./mask'),
	math = require('./math'),
	object = require('./object'),
	promise = require('./promise'),
	random = require('./random'),
	string = require('./string'),
	timezone = require('./timezone');

module.exports = (() => {
	'use strict';

	return {
		assert: assert,
		array: array,
		attributes: attributes,
		connection: connection,
		converters: converters,
		date: date,
		Disposable: Disposable,
		is: is,
		mask: mask,
		math: math,
		object: object,
		promise: promise,
		random: random,
		string: string,
		timezone: timezone
	};
})();