import * as comparators from '@barchart/common-js/collections/sorting/comparators.js';

import ComparatorBuilder from '@barchart/common-js/collections/sorting/ComparatorBuilder.js';

/**
 * Comparators which can be used to sort {@link DataOperationContainer} instances.
 *
 * @public
 */
export default class DataOperationComparators {
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

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DataOperationComparators]';
	}
}

const instance = ComparatorBuilder
	.startWith((a, b) => comparators.compareNumbers(a.stage.priority, b.stage.priority))
	.thenBy((a, b) => comparators.compareNumbers(a.adjustment.priority, b.adjustment.priority))
	.thenBy((a, b) => comparators.compareNumbers(a.order, b.order))
	.toComparator();
