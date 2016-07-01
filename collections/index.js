var Queue = require('./Queue');
var Stack = require('./Stack');
var Tree = require('./Tree');
var DisposableStack = require('./specialized/DisposableStack');
var EvictingList = require('./specialized/EvictingList');

var ComparatorBuilder = require('./sorting/ComparatorBuilder');
var comparators = require('./sorting/comparators');

module.exports = function() {
	'use strict';

	return {
		Queue: Queue,
		Sorting: {
			ComparatorBuilder: ComparatorBuilder,
			comparators: comparators
		},
		Specialized: {
			DisposableStack: DisposableStack,
			EvictingList: EvictingList
		},
		Stack: Stack,
		Tree: Tree
	};
}();