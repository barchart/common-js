var _ = require('lodash');

var assert = require('./../../lang/assert');

module.exports = function() {
    'use strict';

    var comparators = {
        compareDates: function(a, b) {
            assert.argumentIsRequired(a, 'a', Date);
            assert.argumentIsRequired(b, 'b', Date);

            return a - b;
        },

        compareNumbers: function(a, b) {
            assert.argumentIsRequired(a, 'a', Number);
            assert.argumentIsRequired(b, 'b', Number);

            return a - b;
        },

        compareStrings: function(a, b) {
            assert.argumentIsRequired(a, 'a', String);
            assert.argumentIsRequired(b, 'b', String);

            return a.localeCompare(b);
        },

        empty: function(a, b) {
            return 0;
        }
    };

    return comparators;
}();