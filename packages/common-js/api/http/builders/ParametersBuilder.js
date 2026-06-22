import * as assert from './../../../lang/assert.js';
import * as attributes from './../../../lang/attributes.js';
import * as is from './../../../lang/is.js';

import Parameter from './../definitions/Parameter.js';
import Parameters from './../definitions/Parameters.js';

/**
 * Fluent interface for building a {@link Parameters} collection.
 *
 * @public
 */
export default class ParametersBuilder {
	#parameters;
	#required;

	/**
	 * @param {boolean=} required - If true, all parameters will be marked as required.
	 */
	constructor(required) {
		this.#parameters = new Parameters();

		this.#required = is.boolean(required) && required;
	}

	/**
	 * The {@link Parameters} collection, given all the information provided thus far.
	 *
	 * @public
	 * @returns {Parameters}
	 */
	get parameters() {
		return this.#parameters;
	}

	/**
	 * Adds a new parameter that extracts its value from a delegate.
	 *
	 * @param {string} description
	 * @param {string} key
	 * @param {Function} delegate
	 * @param {boolean=} optional
	 * @param {Function=} serializer
	 * @returns {ParametersBuilder}
	 */
	withDelegateParameter(description, key, delegate, optional, serializer) {
		this.#addParameter(new Parameter(description, key, buildDelegateExtractor(delegate, buildSerializer(serializer)), optional || this.#required));

		return this;
	}

	/**
	 * Adds a new parameter with a literal value.
	 *
	 * @param {string} description
	 * @param {string} key
	 * @param {*=} value
	 * @param {boolean=} optional
	 * @returns {ParametersBuilder}
	 */
	withLiteralParameter(description, key, value, optional) {
		this.#addParameter(new Parameter(description, key, buildLiteralExtractor(value || key), optional || this.#required));

		return this;
	}

	/**
	 * Adds a new parameter that reads its value from the variable
	 * on the request payload.
	 *
	 * @param {string} description
	 * @param {string} key
	 * @param {string} variable
	 * @param {boolean=} optional
	 * @param {Function=} serializer
	 * @returns {ParametersBuilder}
	 */
	withVariableParameter(description, key, variable, optional, serializer) {
		this.#addParameter(new Parameter(description, key, buildVariableExtractor(variable, buildSerializer(serializer)), optional || this.#required));

		return this;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[ParametersBuilder]';
	}

	#addParameter(parameter) {
		const items = this.#parameters.parameters.slice(0);

		items.push(parameter);

		this.#parameters = new Parameters(items);
	}
}

function buildSerializer(serializer) {
	let returnRef;

	if (is.fn(serializer)) {
		returnRef = serializer;
	} else {
		returnRef = x => x;
	}

	return returnRef;
}

function buildDelegateExtractor(fn, serializer) {
	assert.argumentIsRequired(fn, 'fn', Function);

	return async (payload) => {
		return serializer(fn(payload));
	};
}

function buildLiteralExtractor(value) {
	assert.argumentIsRequired(value, 'value', String);

	return async () => value;
}

function buildVariableExtractor(variable, serializer) {
	assert.argumentIsRequired(variable, 'variable', String);

	return buildDelegateExtractor((payload) => {
		if (is.object(payload) && attributes.has(payload, variable)) {
			return attributes.read(payload, variable);
		} else {
			return null;
		}
	}, serializer);
}
