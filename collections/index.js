var Stack = require('./Stack');
var DisposableStack = require('./specialized/DisposableStack');

var ComparatorBuilder = require('./sorting/ComparatorBuilder');
var comparators = require('./sorting/comparators');

module.exports = function() {
    'use strict';

    return {
		Stack: Stack,
		Specialized: {
			DisposableStack: DisposableStack
		},
        Sorting: {
            ComparatorBuilder: ComparatorBuilder,
            comparators: comparators
        }
    };
}();