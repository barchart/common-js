const comparators = require('@barchart/common-js/collections/sorting/comparators'),
	ComparatorBuilder = require('@barchart/common-js/collections/sorting/ComparatorBuilder');

module.exports = (() => {
	'use strict';

	/**
	 * Comparators which can be used to sort {@link DataOperationContainer} instances.
	 *
	 * @public
	 */
	class DataOperationComparators {
		constructor() {

		}

		/**
		 * The default comparator for {@link DataOperationContainer} instances.
		 *
		 * @public
		 * @static
		 * @returns {Function}
		 */
		static get DEFAULT() {
			return instance;
		}

		toString() {
			return '[DataOperationComparators]';
		}
	}

	const instance = ComparatorBuilder
		.startWith((a, b) => comparators.compareNumbers(a.stage.priority, b.stage.priority))
		.thenBy((a, b) => comparators.compareNumbers(a.adjustment.priority, b.adjustment.priority))
		.thenBy((a, b) => comparators.compareNumbers(a.order, b.order))
		.toComparator();

	return DataOperationComparators;
})();
