import * as assert from '@barchart/common-js/lang/assert.js';

import DynamoProvider from './../../DynamoProvider.js';
import Query from './../query/definitions/Query.js';
import Transformation from './../../../stream/transformations/Transformation.js';

/**
 * A {@link Transformation} that accepts a query and runs it.
 *
 * @public
 * @extends {Transformation}
 * @param {DynamoProvider} dynamoProvider - The table definition.
 * @param {String=} description - A description of the transformation.
 */
export default class DynamoQueryTransformation extends Transformation {
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
