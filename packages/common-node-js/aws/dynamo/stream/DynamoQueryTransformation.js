import * as assert from '@barchart/common-js/lang/assert.js';

import DynamoProvider from './../../DynamoProvider.js';
import Query from './../query/definitions/Query.js';
import Transformation from './../../../stream/transformations/Transformation.js';

/**
 * A {@link Transformation} that accepts a query and runs it.
 *
 * @public
 * @extends {Transformation}
 */
export default class DynamoQueryTransformation extends Transformation {
	#dynamoProvider;

	/**
	 * @param {DynamoProvider} dynamoProvider - The table definition.
	 * @param {string=} description - A description of the transformation.
	 */
	constructor(dynamoProvider, description) {
		super((description || 'Dynamo Query Transformation'));

		assert.argumentIsRequired(dynamoProvider, 'dynamoProvider', DynamoProvider, 'DynamoProvider');

		this.#dynamoProvider = dynamoProvider;
	}

	/**
	 * Returns the synchronous.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get synchronous() {
		return false;
	}

	_canTransform(input) {
		return input instanceof Query;
	}

	_transform(input) {
		return this.#dynamoProvider.query(input);
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[DynamoQueryTransformation]';
	}
}
