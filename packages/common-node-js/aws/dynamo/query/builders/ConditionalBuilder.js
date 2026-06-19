import * as assert from '@barchart/common-js/lang/assert.js';

import Conditional from './../definitions/Conditional.js';
import Table from './../../schema/definitions/Table.js';
import ActionBuilder from './ActionBuilder.js';
import FilterBuilder from './FilterBuilder.js';

/**
 * @typedef {import('../definitions/Action.js').default} Action
 */

/**
 * Fluent interface for building a {@link Conditional}.
 *
 * @public
 * @extends {ActionBuilder}
 */
export default class ConditionalBuilder extends ActionBuilder {
	#conditional;

	/**
	 * @param {Table} table - The table targeted.
	 */
	constructor(table) {
		super();

		this.#conditional = new Conditional(table);
	}

	/**
	 * The {@link Action}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Action}
	 */
	get action() {
		return this.#conditional;
	}

	/**
	 * The {@link Conditional}, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Conditional}
	 */
	get conditional() {
		return this.#conditional;
	}

	/**
	 * Adds a {@link Filter} to the scan, using a callback that
	 * provides the consumer with a {@link FilterBuilder} then
	 * returns the current instance.
	 *
	 * @public
	 * @param {Function} callback - Synchronously called, providing a {@link FilterBuilder} tied to the current instance.
	 * @returns {ConditionalBuilder}
	 */
	withFilterBuilder(callback) {
		assert.argumentIsRequired(callback, 'callback', Function);

		const filterBuilder = new FilterBuilder(this);

		callback(filterBuilder);

		this.#conditional = new Conditional(this.#conditional.table, filterBuilder.filter, this.#conditional.description);

		return this;
	}

	/**
	 * Adds a description to the scan and returns the current instance.
	 *
	 * @public
	 * @param {string} description
	 * @returns {ConditionalBuilder}
	 */
	withDescription(description) {
		assert.argumentIsRequired(description, 'description', String);

		this.#conditional = new Conditional(this.#conditional.table, this.#conditional.filter, description);

		return this;
	}

	/**
	 * Creates a new {@link ConditionalBuilder}.
	 *
	 * @public
	 * @static
	 * @param {Table} table - Name of the table.
	 * @returns {ConditionalBuilder}
	 */
	static targeting(table) {
		assert.argumentIsRequired(table, 'table', Table, 'Table');

		return new ConditionalBuilder(table);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ConditionalBuilder]';
	}
}
