var assert = require('./assert');
var attributes = require('./attributes');
var Disposable = require('./Disposable');

module.exports = function() {
    'use strict';

    return {
        assert: assert,
		attributes: attributes,
		Disposable: Disposable
    };
}();