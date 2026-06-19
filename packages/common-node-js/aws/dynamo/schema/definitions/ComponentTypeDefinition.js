import * as assert from '@barchart/common-js/lang/assert.js';

import DataType from './DataType.js';

/**
 * A {@link Component} aggregates several fields, this instance describes
 * a single field used within a {@link Component}
 *
 * @public
 */
export default class ComponentTypeDefinition {
	#dataType;
	#description;
	#suffix;

	/**
	 * @param {string} description - The description
	 * @param {DataType} dataType - The field's {@link DataType}.
	 * @param {string} suffix - The suffix to use when generating a field name.
	 */
	constructor(description, dataType, suffix) {
		assert.argumentIsRequired(description, 'description', String);
		assert.argumentIsRequired(dataType, 'dataType', DataType, 'DataType');
		assert.argumentIsRequired(suffix, 'suffix', String);

		this.#description = description;
		this.#dataType = dataType;
		this.#suffix = suffix;
	}

	/**
	 * The field's description.
	 *
	 * @returns {string}
	 */
	get description() {
		return this.#description;
	}

	/**
	 * The field's data type.
	 *
	 * @returns {DataType}
	 */
	get dataType() {
		return this.#dataType;
	}

	/**
	 * The field's suffix.
	 *
	 * @returns {string}
	 */
	get suffix() {
		return this.#suffix;
	}

	/**
	 * Generates a field name.
	 *
	 * @public
	 * @param {string} componentName - The name of the {@link Component}. See {@link Component#name}.
	 * @returns {string}
	 */
	getFieldName(componentName) {
		return `${componentName}-${this.#suffix}`;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[ComponentTypeDefinition]`;
	}
}
