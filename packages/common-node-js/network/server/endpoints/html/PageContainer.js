import * as assert from '@barchart/common-js/lang/assert.js';

import Container from './../Container.js';
import PageEndpoint from './PageEndpoint.js';

/**
 * Stores page configuration.
 *
 * @public
 */
export default class PageContainer extends Container {
	#secureRedirect;
	#useSession;

	/**
	 * @param {number} port - The port.
	 * @param {string} path - The path.
	 * @param {boolean=} secure - The secure.
	 * @param {boolean=} useSession - The use session.
	 * @param {boolean=} secureRedirect - The secure redirect.
	 */
	constructor(port, path, secure, useSession, secureRedirect) {
		super(port, path, secure);

		assert.argumentIsOptional(useSession, 'useSession', Boolean);
		assert.argumentIsOptional(secureRedirect, 'secureRedirect', Boolean);

		this.#useSession = useSession || false;
		this.#secureRedirect = secureRedirect || false;
	}

	/**
	 * Returns the endpoint type.
	 *
	 * @protected
	 * @returns {*}
	 */
	_getEndpointType() {
		return PageEndpoint;
	}

	/**
	 * Returns the uses session.
	 *
	 * @public
	 * @returns {boolean}
	 */
	getUsesSession() {
		return this.#useSession;
	}

	/**
	 * Returns the secure redirect.
	 *
	 * @public
	 * @returns {boolean}
	 */
	getSecureRedirect() {
		return this.#secureRedirect;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[PageContainer]';
	}
}
