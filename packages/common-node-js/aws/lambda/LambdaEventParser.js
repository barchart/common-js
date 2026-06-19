import * as assert from '@barchart/common-js/lang/assert.js';
import * as attributes from '@barchart/common-js/lang/attributes.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as promise from '@barchart/common-js/lang/promise.js';

import Enum from '@barchart/common-js/lang/Enum.js';
import Schema from '@barchart/common-js/serialization/json/Schema.js';
import FailureReason from '@barchart/common-js/api/failures/FailureReason.js';
import FailureType from '@barchart/common-js/api/failures/FailureType.js';

import LambdaTriggerType from './LambdaTriggerType.js';

/**
 * A utility for working with the data passed to a Lambda Function.
 *
 * @public
 */
export default class LambdaEventParser {
	#event;

	/**
	 * @param {object} event - The actual "event" object passed to the Lambda Function by the AWS framework.
	 */
	constructor(event) {
		assert.argumentIsRequired(event, 'event', Object);

		this.#event = event;
	}

	/**
	 * Reads the Lambda's event object directly.
	 *
	 * @public
	 * @param {string} key
	 * @returns {*}
	 */
	read(key) {
		assert.argumentIsRequired(key, 'key', String);

		return read(this.#event, key);
	}

	/**
	 * Indicates if the consumer wants a plain text response, as evidenced
	 * by a "mode=text" query string value.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get plainText() {
		return this.getQueryString('mode') === 'text';
	}

	/**
	 * Reads the context data (from custom authorizer).
	 *
	 * @public
	 * @param {string} key
	 * @returns {*|undefined}
	 */
	getContext(key) {
		assert.argumentIsRequired(key, 'key', String);

		if (this.#event.version && this.#event.version === '2.0') {
			return read(this.#event, `requestContext.authorizer.lambda.${key}`);
		} else {
			return read(this.#event, `requestContext.authorizer.${key}`);
		}
	}

	/**
	 * Reads a request header.
	 *
	 * @public
	 * @param {string} key
	 * @returns {*|undefined}
	 */
	getHeader(key) {
		assert.argumentIsRequired(key, 'key', String);

		return read(this.#event, `headers.${key}`);
	}

	/**
	 * If "proxy" mode is being used, all path parameters are returned
	 * as an array.
	 *
	 * @public
	 * @returns {string[]}
	 */
	getPaths() {
		const proxy = this.getPath('proxy', null, true);

		if (is.string(proxy)) {
			return proxy.split('/').filter(p => p).map(p => decodeURIComponent(p));
		} else {
			return [ ];
		}
	}

	/**
	 * Retrieves a value from path parameters.
	 *
	 * @public
	 * @param {string} key
	 * @param {Function=} parser
	 * @param {boolean=} raw
	 * @returns {string|null|undefined}
	 */
	getPath(key, parser, raw) {
		assert.argumentIsRequired(key, 'key', String);
		assert.argumentIsOptional(parser, 'parser', Function);
		assert.argumentIsOptional(raw, 'raw', Boolean);

		const value = read(this.#event, `pathParameters.${key}`);

		if (is.undef(value) || is.nil(value)) {
			return value;
		}

		let parsed;

		if (raw) {
			parsed = value;
		} else {
			parsed = decodeURIComponent(value);
		}

		if (parser) {
			try {
				parsed = parser(value);
			} catch (e) {
				parsed = null;
			}
		}

		return parsed;
	}

	/**
	 * Retrieves a value from querystring parameters.
	 *
	 * @public
	 * @deprecated
	 * @param {string} key
	 * @returns {string|undefined}
	 */
	getQuerystring(key) {
		return this.getQueryString(key);
	}

	/**
	 * Retrieves a value from querystring parameters.
	 *
	 * @public
	 * @param {string} key
	 * @param {Function=} parser
	 * @returns {*}
	 */
	getQueryString(key, parser) {
		assert.argumentIsRequired(key, 'key', String);
		assert.argumentIsOptional(parser, 'parser', Function);

		const value = read(this.#event.queryStringParameters, key);

		let parsed;

		if (parser && value !== null) {
			try {
				parsed = parser(value);
			} catch (e) {
				parsed = null;
			}
		} else {
			parsed = value;
		}

		return parsed;
	}

	/**
	 * Retrieves the body (or a property from the body).
	 *
	 * @public
	 * @param {string=} key
	 * @returns {*}
	 */
	getBody(key) {
		let body = this.#event.body;

		if (is.string(key)) {
			let source;

			if (is.string(body)) {
				try {
					source = JSON.parse(body);
				} catch (e) {
					source = null;
				}
			} else {
				source = body;
			}

			return read(source, key);
		} else {
			return body;
		}
	}

	/**
	 * Attempts to determine the correct schema based on the querystring.
	 *
	 * @public
	 * @param {Function} type
	 * @returns {Schema|null}
	 */
	getSchema(type) {
		assert.argumentIsValid(type, 'type', t => is.extension(Enum, t), 'is an enumeration');

		const code = this.getQueryString('schema');

		let schema;

		if (code) {
			schema = Enum.fromCode(type, code);
		} else {
			schema = type.CLIENT;
		}

		return schema || null;
	}

	/**
	 * Attempts to deserialize JSON string into the given schema
	 *
	 * @public
	 * @async
	 * @param {string} jsonString
	 * @param {object} schema
	 * @param {string} description
	 * @returns {Promise<object>}
	 */
	async parseSchema(jsonString, schema, description) {
		return Promise.resolve()
			.then(() => {
				assert.argumentIsRequired(jsonString, 'jsonString', String);
				assert.argumentIsRequired(schema, schema, Object);
				assert.argumentIsRequired(schema.schema, 'schema.schema', Schema, 'Schema');
				assert.argumentIsOptional(description, 'description', String);

				return promise.build((resolveCallback, rejectCallback) => {
					try {
						const reviver = schema.schema.getReviver();

						resolveCallback(JSON.parse(jsonString, reviver));
					} catch (e) {
						let reason;

						reason = FailureReason.forRequest({ endpoint: { description: (description || 'deserialize JSON string') } });
						reason = reason.addItem(FailureType.SCHEMA_VALIDATION_FAILURE, { key: e.key, name: e.name, schema: schema.schema.name });

						rejectCallback(reason);
					}
				});
			});
	}

	/**
	 * Returns an array of all messages included within the event.
	 *
	 * @public
	 * @param {boolean=} text
	 * @return {Array<object>}
	 */
	getMessages(text) {
		let messages;

		if (is.array(this.#event.Records)) {
			messages = this.#event.Records;
		} else {
			messages = [ this.#event ];
		}

		return messages.map((message) => {
			const type = LambdaTriggerType.fromMessage(message);

			let content;

			if (type !== null) {
				content = type.getContent(message);
			} else {
				content = null;
			}

			if (content && (!is.boolean(text) || !text)) {
				content = JSON.parse(content);
			}

			return content;
		});
	}
}

/**
 * @private
 * @param {object} object
 * @param {string} key
 * @returns {string|null|undefined}
 */
function read(object, key) {
	if (is.object(object)) {
		return attributes.read(object, key);
	} else {
		return null;
	}
}
