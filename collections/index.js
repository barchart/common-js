const Queue = require('./Queue'),
	Stack = require('./Stack'),
	Tree = require('./Tree'),
	DisposableStack = require('./specialized/DisposableStack'),
	EvictingList = require('./specialized/EvictingList'),
	EvictingMap = require('./specialized/EvictingMap');

const ComparatorBuilder = require('./sorting/ComparatorBuilder'),
	comparators = require('./sorting/comparators');

module.exports = (() => {
	'use strict';

	return {
		Queue: Queue,
		Sorting: {
			ComparatorBuilder: ComparatorBuilder,
			comparators: comparators
		},
		Specialized: {
			DisposableStack: DisposableStack,
			EvictingList: EvictingList,
			EvictingMap: EvictingMap
		},
		Stack: Stack,
		Tree: Tree
	};
})();