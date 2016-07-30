var assert = require('./assert');
var attributes = require('./attributes');
var converters = require('./converters');
var Disposable = require('./Disposable');
var is = require('./is');

module.exports = (() => {
	'use strict';

	return {
		assert: assert,
		attributes: attributes,
		converters: converters,
		Disposable: Disposable,
		is: is
	};
})();