const assert = require('@barchart/common-js/lang/assert');

const DataType = require('./DataType');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Component} aggregates several fields, this instance describes
	 * a single field used within a {@link Component}
	 *
	 * @public
	 * @param {DataType} - The field's {@link DataType}.
	 * @param {String} - The suffix to use when generating a field name.
	 */
	class ComponentTypeDefinition {
		constructor(description, dataType, suffix) {
			assert.argumentIsRequired(description, 'description', String);
			assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');
			assert.argumentIsRequired(suffix, 'suffix', String);

			this._description = description;
			this._dataType = dataType;
			this._suffix = suffix;
		}

		/**
		 * The field's description.
		 *
		 * @returns {String}
		 */
		get description() {
			return this._description;
		}

		/**
		 * The field's data type.
		 *
		 * @returns {DataType}
		 */
		get dataType() {
			return this._dataType;
		}

		/**
		 * The field's suffix.
		 *
		 * @returns {String}
		 */
		get suffix() {
			return this._suffix;
		}

		/**
		 * Generates a field name.
		 *
		 * @public
		 * @param {String} componentName - The name of the {@link Component}. See {@link Component#name}.
		 * @returns {String}
		 */
		getFieldName(componentName) {
			return `${componentName}-${this._suffix}`;
		}

		toString() {
			return `[ComponentTypeDefinition]`;
		}
	}

	return ComponentTypeDefinition;
})();