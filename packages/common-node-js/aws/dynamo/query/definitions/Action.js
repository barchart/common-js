import * as array from '@barchart/common-js/lang/array.js';
import * as assert from '@barchart/common-js/lang/assert.js';

import Filter from './Filter.js';
import Serializers from './../../schema/serialization/Serializers.js';
import Table from './../../schema/definitions/Table.js';

/**
 * @typedef {import('../../schema/definitions/Index.js').default} Index
 */

/**
 * @typedef {import('../../schema/definitions/Attribute.js').default} Attribute
 */

/**
 * The base class for an object which defines some sort of conditional
 * operation that targets a {@link Table}.
 *
 * @public
 * @interface
 */
export default class Action {
	#description;
	#index;
	#table;

	/**
	 * @param {Table} table - The table.
	 * @param {Index=} index - The index.
	 * @param {string=} description - The description.
	 */
	constructor(table, index, description) {
		this.#table = table;
		this.#index = index || null;
		this.#description = description;
	}

	/**
	 * A {@link Table} to target.
	 *
	 * @public
	 * @returns {Table}
	 */
	get table() {
		return this.#table;
	}

	/**
	 * An {@Index} of the table to target (optional).
	 *
	 * @public
	 * @returns {Index|null}
	 */
	get index() {
		return this.#index;
	}

	/**
	 * A description of the action (for logging purposes).
	 *
	 * @public
	 * @returns {string}
	 */
	get description() {
		return this.#description;
	}

	/**
	 * Returns a string suitable to pass to an "ExpressionAttributeNames" property
	 * on an AWS query or scan object.
	 *
	 * @public
	 * @static
	 * @param {Table} table
	 * @param {Array<Attribute>} attributes
	 * @returns {string}
	 */
	static getExpressionAttributeNames(table, attributes) {
		const aliases = getAttributeAliasMap(table);

		return array.unique(attributes.map(a => a.name))
			.reduce((accumulator, name) => {
				const alias = aliases[name];

				accumulator[alias] = name;

				return accumulator;
			}, { });
	}

	/**
	 * Returns a string suitable to pass to a "ProjectionExpression" property
	 * on an AWS query or scan object.
	 *
	 * @public
	 * @static
	 * @param {Table} table
	 * @param {Array<Attribute>} projectedAttributes - Attributes to project (i.e. select).
	 * @returns {string}
	 */
	static getProjectionExpression(table, projectedAttributes) {
		const aliases = getAttributeAliasMap(table);

		return projectedAttributes.map(pa => aliases[pa.name]).join(',');
	}

	/**
	 * Gets an object with useful data for building an AWS scan or query. Specifically,
	 * an "expression" which can be used by a "FilterExpression" or "KeyConditionExpression"
	 * field. Also, a "valueAliases" object which conforms to the "ExpressionAttributeValues"
	 * field.
	 *
	 * @public
	 * @static
	 * @param {Table} table
	 * @param {Filter} filter
	 * @param {number=} offset - Used to "offset" the alias counter (when calling this function many times -- e.g. query key condition and result filter)
	 * @returns {*}
	 */
	static getConditionExpressionData(table, filter, offset) {
		assert.argumentIsRequired(table, 'table', Table, 'Table');
		assert.argumentIsRequired(filter, 'filter', Filter, 'Filter');
		assert.argumentIsOptional(offset, 'offset', Number);

		const attributeAliases = getAttributeAliasMap(table);

		const offsetToUse = offset || 0;

		const data = filter.expressions.reduce((accumulator, e, index) => {
			const operatorType = e.operatorType;
			const operand = e.operand;

			const indexToUse = index + offsetToUse;

			const repeatCount = 1 + Math.floor(indexToUse / 26);
			const letterCode = 97 + (indexToUse % 26);

			const addOperandAlias = (operandAlias, operandValue) => {
				accumulator.valueAliases[operandAlias] = operandValue;
			};

			let operandAliases;

			if (operatorType.operandCount > 1) {
				operandAliases = operand.map((o, i) => {
					const operandAlias = `:${String.fromCharCode(letterCode).repeat(repeatCount)}${i}`;
					const operandValue = Serializers.forDataType(e.attribute.dataType).serialize(operand[i]);

					addOperandAlias(operandAlias, operandValue);

					return operandAlias;
				});
			} else if (operatorType.operandCount === 1) {
				const operandAlias = `:${String.fromCharCode(letterCode).repeat(repeatCount)}`;
				const operandValue = Serializers.forDataType(e.attribute.dataType).serialize(operand);

				addOperandAlias(operandAlias, operandValue);

				operandAliases = operandAlias;
			} else {
				operandAliases = [ ];
			}

			accumulator.expressionComponents.push(operatorType.format(attributeAliases[e.attribute.name], operandAliases));

			return accumulator;
		}, { expressionComponents: [ ], valueAliases: { }, offset: offsetToUse + filter.expressions.length });

		data.expression = data.expressionComponents.join(' and ');

		return data;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Action]';
	}
}

const attributeAliasMaps = new Map();

function getAttributeAliasMap(table) {
	if (!attributeAliasMaps.has(table.name)) {
		const aliases = table.attributes.reduce((map, a, index) => {
			const repeatCount = 1 + Math.floor(index / 26);
			const letterCode = 97 + (index % 26);

			map[a.name] = `#${String.fromCharCode(letterCode).repeat(repeatCount)}`;

			return map;
		}, { });

		attributeAliasMaps.set(table.name, aliases);
	}

	return attributeAliasMaps.get(table.name);
}
