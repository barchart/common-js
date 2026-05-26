const assert = require('@barchart/common-js/lang/assert');

const DynamoProvider = require('./../../DynamoProvider'),
	Query = require('./../query/definitions/Query'),
	Transformation = require('./../../../stream/transformations/Transformation');

module.exports = (() => {
	'use strict';

	/**
	 * A {@link Transformation} that accepts a query and runs it.
	 *
	 * @public
	 * @extends {Transformation}
	 * @param {DynamoProvider} dynamoProvider - The table definition.
	 * @param {String=} description - A description of the transformation.
	 */
	class DynamoQueryTransformation extends Transformation {
		constructor(dynamoProvider, description) {
			super((description || 'Dynamo Query Transformation'));

			assert.argumentIsRequired(dynamoProvider, 'dynamoProvider', DynamoProvider, 'DynamoProvider');

			this._dynamoProvider = dynamoProvider;
		}

		get synchronous() {
			return false;
		}

		_canTransform(input) {
			return input instanceof Query;
		}

		_transform(input) {
			return this._dynamoProvider.query(input);
		}

		toString() {
			return '[DynamoQueryTransformation]';
		}
	}

	return DynamoQueryTransformation;
})();
