const array = require('@barchart/common-js/lang/array'),
	assert = require('@barchart/common-js/lang/assert');

const Filter = require('./Filter'),
	Serializers = require('./../../schema/serialization/Serializers'),
	Table = require('./../../schema/definitions/Table');

module.exports = (() => {
	'use strict';

	/**
	 * The base class for an object which defines some sort of conditional
	 * operation that targets a {@link Table}.
	 *
	 * @public
	 * @interface
	 * @param {Table} table
	 * @param {Index=} index
	 * @param {String=} description
	 */
	class Action {
		constructor(table, index, description) {
			this._table = table;
			this._index = index || null;
			this._description = description;
		}

		/**
		 * A {@link Table} to target.
		 *
		 * @public
		 * @returns {Table}
		 */
		get table() {
			return this._table;
		}

		/**
		 * An {@Index} of the table to target (optional).
		 *
		 * @public
		 * @returns {Index|null}
		 */
		get index() {
			return this._index;
		}

		/**
		 * A description of the action (for logging purposes).
		 *
		 * @public
		 * @returns {String}
		 */
		get description() {
			return this._description;
		}

		/**
		 * Returns a string suitable to pass to an "ExpressionAttributeNames" property
		 * on an AWS query or scan object.
		 *
		 * @protected
		 * @static
		 * @param {Table} table
		 * @param {Array<Attribute>} attributes
		 * @returns {String}
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
		 * @protected
		 * @static
		 * @param {Table} table
		 * @param {Array<Attribute>} projectedAttributes - Attributes to project (i.e. select).
		 * @returns {String}
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
		 * @protected
		 * @static
		 * @param {Table} table
		 * @param {Filter} filter
		 * @param {Number=} offset - Used to "offset" the alias counter (when calling this function many times -- e.g. query key condition and result filter)
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

	return Action;
})();
