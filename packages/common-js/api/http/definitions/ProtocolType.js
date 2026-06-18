import * as assert from './../../../lang/assert.js';
import * as is from './../../../lang/is.js';

import Enum from './../../../lang/Enum.js';

/**
 * Defines the protocol for a web request.
 *
 * @public
 * @extends {Enum}
 */
export default class ProtocolType extends Enum {
	#defaultPort;
	#prefix;

	/**
	 * @param {string} code
	 * @param {number} defaultPort
	 * @param {string} prefix
	 */
	constructor(code, defaultPort, prefix) {
		super(code, code);

		assert.argumentIsRequired(prefix, 'prefix', String);
		assert.argumentIsValid(defaultPort, 'defaultPort', p => is.integer(p) && !(p < 0 || p > 65535));

		this.#defaultPort = defaultPort;
		this.#prefix = prefix;
	}

	/**
	 * Returns the default TCP port used by the protocol.
	 *
	 * @public
	 * @returns {number}
	 */
	get defaultPort() {
		return this.#defaultPort;
	}

	/**
	 * Returns the prefix used to compose a URL.
	 *
	 * @public
	 * @returns {string}
	 */
	get prefix() {
		return this.#prefix;
	}

	/**
	 * Returns the {@link ProtocolType} associated with a specific code.
	 *
	 * @public
	 * @static
	 * @param {string} code
	 * @returns {ProtocolType|null}
	 */
	static parse(code) {
		const value = Enum.fromCode(ProtocolType, code);

		return value instanceof ProtocolType ? value : null;
	}

	/**
	 * HTTP.
	 *
	 * @static
	 * @returns {ProtocolType}
	 */
	static get HTTP() {
		return protocolTypeHttp;
	}

	/**
	 * HTTPS.
	 *
	 * @static
	 * @returns {ProtocolType}
	 */
	static get HTTPS() {
		return protocolTypeHttps;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[ProtocolType (description=${this.description})]`;
	}
}

const protocolTypeHttp = new ProtocolType('HTTP', 80, 'http://');
const protocolTypeHttps = new ProtocolType('HTTPS', 443, 'https://');
