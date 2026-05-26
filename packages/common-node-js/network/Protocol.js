const assert = require('@barchart/common-js/lang/assert');

module.exports = (() => {
	'use strict';

	class Protocol {
		constructor(code, standard, secure) {
			assert.argumentIsRequired(description, 'description', String);
			assert.argumentIsRequired(standard, 'standard', String);
			assert.argumentIsRequired(secure, 'secure', String);

			this._description = description;

			this._standard = standard;
			this._secure = secure;
		}

		getDescription() {
			return this._description;
		}

		getStandard() {
			return this._standard;
		}

		getSecure() {
			return this._secure;
		}

		getUrlPrefix(secure) {
			let prefix;

			if (secure) {
				prefix = this._secure;
			} else {
				prefix = this._standard;
			}

			return prefix + '://';
		}

		toString() {
			return '[Protocol (description=' + this._description + ')]';
		}
	}

	function addProtocol(verb) {
		const code = verb.getCode();

		Protocol[code] = verb;
	}

	addProtocol(new Protocol('HyperText', 'http', 'https'));

	return Protocol;
})();