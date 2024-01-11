const assert = require('./../../../lang/assert'),
	Enum = require('./../../../lang/Enum'),
	is = require('./../../../lang/is');

module.exports = (() => {
	'use strict';

	/**
	 * Defines the protocol for a web request.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {Number} defaultPort
	 * @param {String} prefix
	 */
	class ProtocolType extends Enum {
		constructor(code, defaultPort, prefix) {
			super(code, code);

			assert.argumentIsRequired(prefix, 'prefix', String);
			assert.argumentIsValid(defaultPort, 'defaultPort', p => is.integer(p) && !(p < 0 || p > 65535));

			this._defaultPort = defaultPort;
			this._prefix = prefix;
		}

		/**
		 * Returns the default TCP port used by the protocol.
		 *
		 * @public
		 * @returns {Number}
		 */
		get defaultPort() {
			return this._defaultPort;
		}

		/**
		 * Returns the prefix used to compose a URL.
		 *
		 * @public
		 * @returns {String}
		 */
		get prefix() {
			return this._prefix;
		}

		/**
		 * Returns the {@link ProtocolType} associated with a specific code.
		 *
		 * @public
		 * @static
		 * @param {String} code
		 * @returns {ProtocolType|null}
		 */
		static parse(code) {
			return Enum.fromCode(ProtocolType, code);
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

		toString() {
			return `[ProtocolType (description=${this.description})]`;
		}
	}

	const protocolTypeHttp = new ProtocolType('HTTP', 80, 'http://');
	const protocolTypeHttps = new ProtocolType('HTTPS', 443, 'https://');

	return ProtocolType;
})();