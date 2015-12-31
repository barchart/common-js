var ComparatorBuilder = require('./sorting/ComparatorBuilder');
var comparators = require('./sorting/comparators');

module.exports = function() {
    'use strict';

    return {
        Sorting: {
            ComparatorBuilder: ComparatorBuilder,
            comparators: comparators
        }
    };
}();