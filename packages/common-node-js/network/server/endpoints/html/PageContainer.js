import * as assert from '@barchart/common-js/lang/assert.js';

import Container from './../Container.js';
import PageEndpoint from './PageEndpoint.js';

export default class PageContainer extends Container {
	constructor(port, path, secure, useSession, secureRedirect) {
		super(port, path, secure);

		assert.argumentIsOptional(useSession, 'useSession', Boolean);
		assert.argumentIsOptional(secureRedirect, 'secureRedirect', Boolean);

		this._useSession = useSession || false;
		this._secureRedirect = secureRedirect || false;
	}

	_getEndpointType() {
		return PageEndpoint;
	}

	getUsesSession() {
		return this._useSession;
	}

	getSecureRedirect() {
		return this._secureRedirect;
	}

	toString() {
		return '[PageContainer]';
	}
}
