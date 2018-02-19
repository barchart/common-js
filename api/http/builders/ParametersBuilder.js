const assert = require('./../../../lang/assert'),
	attributes = require('./../../../lang/attributes'),
	is = require('./../../../lang/is');

const Parameter = require('./../definitions/Parameter'),
	Parameters = require('./../definitions/Parameters');

module.exports = (() => {
	'use strict';

	/**
	 * Fluent interface for building a {@link Parameters} collection.
	 *
	 * @public
	 * @param {Boolean} required - If true, all parameters will be marked as required.
	 */
	class ParametersBuilder {
		constructor(required) {
			this._parameters = new Parameters();

			this._required = is.boolean(required) && required;
		}

		/**
		 * The {@link Parameters} collection, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Parameters}
		 */
		get parameters() {
			return this._parameters;
		}

		/**
		 * Adds a new parameter that extracts its value from a delegate.
		 *
		 * @param {String} description
		 * @param {String} key
		 * @param {Function} delegate
		 * @param (Boolean=} optional
		 * @param {Function=} serializer
		 * @returns {ParametersBuilder}
		 */
		withDelegateParameter(description, key, delegate, optional, serializer) {
			addParameter.call(this, new Parameter(description, key, buildDelegateExtractor(delegate, buildSerializer(serializer)), optional || this._required));

			return this;
		}

		/**
		 * Adds a new parameter with a literal value.
		 *
		 * @param {String} description
		 * @param {String} key
		 * @param {*} value
		 * @param (Boolean=} optional
		 * @returns {ParametersBuilder}
		 */
		withLiteralParameter(description, key, value, optional) {
			addParameter.call(this, new Parameter(description, key, buildLiteralExtractor(value || key), optional || this._required));

			return this;
		}

		/**
		 * Adds a new parameter that reads its value from the a variable
		 * on the request payload.
		 *
		 * @param {String} description
		 * @param {String} key
		 * @param {String} variable
		 * @param (Boolean=} optional
		 * @param {Function=} serializer
		 * @returns {ParametersBuilder}
		 */
		withVariableParameter(description, key, variable, optional, serializer) {
			addParameter.call(this, new Parameter(description, key, buildVariableExtractor(variable, buildSerializer(serializer)), optional || this._required));

			return this;
		}

		toString() {
			return '[ParametersBuilder]';
		}
	}

	function addParameter(parameter) {
		const items = this._parameters.parameters.slice(0);

		items.push(parameter);

		this._parameters = new Parameters(items);
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

		return (payload) => {
			return Promise.resolve()
				.then(() => {
					return serializer(fn(payload));
				});
		};
	}

	function buildLiteralExtractor(value) {
		assert.argumentIsRequired(value, 'value', String);

		return (payload) => Promise.resolve(value);
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

	return ParametersBuilder;
})();