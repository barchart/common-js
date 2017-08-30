const assert = require('./../../lang/assert');

const RestEndpoint = require('./RestEndpoint'),
	RestParser = require('./RestParser');

const Schema = require('./../../serialization/json/Schema');

module.exports = (() => {
	'use strict';

	/**
	 * Parses the response received by a {@link RestProivderBase}, the
	 * default implementation simply returns the response string.
	 *
	 * @public
	 */
	class RestParser {
		constructor() {

		}

		/**
		 * Parses a response.
		 *
		 * @public
		 * @param {String=} response.
		 * @returns {*}
		 */
		parse(response) {
			assert.argumentIsOptional(response, 'response', String);

			return this._parse(response);
		}

		/**
		 * @protected
		 * @abstract
		 * @ignore
		 */
		_parse(response) {
			return response;
		}

		/**
		 * Returns a {@link RestParser} that does nothing -- it just returns
		 * the response string that it is given.
		 *
		 * @public
		 * @returns {RestParser}
		 */
		static get DEFAULT() {
			return restParserDefault;
		}

		/**
		 * Returns a {@link RestParser} parses the response string as JSON.
		 *
		 * @public
		 * @returns {RestParser}
		 */
		static get JSON() {
			return restParserJson;
		}

		/**
		 * Returns a {@link RestParser} parses the does customized JSON parsing
		 * using a "reviver" function.
		 *
		 * @public
		 * @param {Function} reviverFactory - A function that returns a JSON.parse reviver function
		 * @returns {RestParser}
		 */
		static getJsonParser(reviverFactory) {
			return new DelegatedRestParser(x => JSON.parse(x, reviverFactory()));
		}

		/**
		 * Returns a {@link RestParser} parses the does customized JSON parsing
		 * based on a JSON {@link Schema}.
		 *
		 * @public
		 * @param {Schema} schema
		 * @returns {RestParser}
		 */
		static getJsonParserForSchema(schema) {
			assert.argumentIsRequired(schema, 'schema', Schema, 'Schema');

			return RestParser.getJsonParser(schema.getReviverFactory());
		}

		toString() {
			return '[RestParser]';
		}
	}

	class DelegatedRestParser extends RestParser {
		constructor(delegate) {
			super();

			assert.argumentIsRequired(delegate, 'delegate', Function);

			this._delegate = delegate;
		}

		_parse(response) {
			return this._delegate(response);
		}

		toString() {
			return '[DelegatedRestParser]';
		}
	}

	const restParserDefault = new RestParser();
	const restParserJson = new DelegatedRestParser(x => JSON.parse(x));

	return RestParser;
})();