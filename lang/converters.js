var _ = require('lodash');

var assert = require('./assert');

module.exports = function() {
    'use strict';

    var converters = {
        toDate: function(object) {
            return new Date(object);
        },

        empty: function(object) {
            return object;
        }
    };

    return converters;
}();