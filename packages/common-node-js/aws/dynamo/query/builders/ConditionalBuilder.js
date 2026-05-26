const assert = require('@barchart/common-js/lang/assert');

const Conditional = require('./../definitions/Conditional'),
	Table = require('./../../schema/definitions/Table');

const ActionBuilder = require('./ActionBuilder'),
	FilterBuilder = require('./FilterBuilder');

module.exports = (() => {
	'use strict';

	/**
	 * Fluent interface for building a {@link Conditional}.
	 *
	 * @public
	 * @extends {ActionBuilder}
	 * @param {Table} table - The table targeted.
	 */
	class ConditionalBuilder extends ActionBuilder {
		constructor(table) {
			super();

			this._conditional = new Conditional(table);
		}

		/**
		 * The {@link Action}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Action}
		 */
		get action() {
			return this._conditional;
		}

		/**
		 * The {@link Conditional}, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Conditional}
		 */
		get conditional() {
			return this._conditional;
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

			this._conditional = new Conditional(this._conditional.table, filterBuilder.filter, this._conditional.description);

			return this;
		}

		/**
		 * Adds a description to the scan and returns the current instance.
		 *
		 * @public
		 * @param {String} description
		 * @returns {ConditionalBuilder}
		 */
		withDescription(description) {
			assert.argumentIsRequired(description, 'description', String);

			this._conditional = new Conditional(this._conditional.table, this._conditional.filter, description);

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

		toString() {
			return '[ConditionalBuilder]';
		}
	}

	return ConditionalBuilder;
})();