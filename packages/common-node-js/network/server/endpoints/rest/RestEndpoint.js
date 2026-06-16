import * as assert from '@barchart/common-js/lang/assert.js';

import Endpoint from './../Endpoint.js';
import RestAction from './RestAction.js';

export default class RestEndpoint extends Endpoint {
	constructor(action, path, command, validationCommand) {
		super(command, validationCommand);

		assert.argumentIsRequired(action, 'action', RestAction, 'RestAction');
		assert.argumentIsRequired(path, 'path', String);

		this._action = action;
		this._path = path;
	}

	getRestAction() {
		return this._action;
	}

	getPath() {
		return this._path;
	}

	toString() {
		return '[RestEndpoint]';
	}
}
