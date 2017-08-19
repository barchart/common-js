const Queue = require('./Queue'),
	Stack = require('./Stack'),
	Tree = require('./Tree'),
	DisposableStack = require('./specialized/DisposableStack'),
	CompoundMap = require('./specialized/CompoundMap'),
	EvictingList = require('./specialized/EvictingList'),
	EvictingMap = require('./specialized/EvictingMap'),
	PriorityQueue = require('./specialized/PriorityQueue');

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
			CompoundMap: CompoundMap,
			DisposableStack: DisposableStack,
			EvictingList: EvictingList,
			EvictingMap: EvictingMap,
			PriorityQueue: PriorityQueue
		},
		Stack: Stack,
		Tree: Tree
	};
})();