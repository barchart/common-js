import * as assert from '@barchart/common-js/lang/assert.js';

import Container from './../Container.js';
import PageEndpoint from './PageEndpoint.js';

export default class PageContainer extends Container {
	#secureRedirect;
	#useSession;

	/**
	 * @param {number} port
	 * @param {string} path
	 * @param {boolean=} secure
	 * @param {boolean=} useSession
	 * @param {boolean=} secureRedirect
	 */
	constructor(port, path, secure, useSession, secureRedirect) {
		super(port, path, secure);

		assert.argumentIsOptional(useSession, 'useSession', Boolean);
		assert.argumentIsOptional(secureRedirect, 'secureRedirect', Boolean);

		this.#useSession = useSession || false;
		this.#secureRedirect = secureRedirect || false;
	}

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
