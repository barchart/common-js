import * as assert from '@barchart/common-js/lang/assert.js';

import CommandHandler from '@barchart/common-js/commands/CommandHandler.js';

import Endpoint from './../Endpoint.js';
import Verb from './../../../http/Verb.js';

const emptyCommand = CommandHandler.fromFunction((ignored) => {
	return {};
});

export default class RelayEndpoint extends Endpoint {
	constructor(verb, acceptPath, forwardHost, forwardPath, headerOverrides, parameterOverrides) {
		super(emptyCommand);

		assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');
		assert.argumentIsRequired(acceptPath, 'acceptPath', String);
		assert.argumentIsRequired(forwardHost, 'forwardHost', String);
		assert.argumentIsRequired(forwardPath, 'forwardPath', String);
		assert.argumentIsOptional(headerOverrides, 'headerOverrides', Object);
		assert.argumentIsOptional(parameterOverrides, 'parameterOverrides', Object);

		this._verb = verb;

		this._acceptPath = acceptPath;

		this._forwardHost = forwardHost;
		this._forwardPath = forwardPath;

		this._headerOverrides = headerOverrides || { };
		this._parameterOverrides = parameterOverrides || { };
	}

	getVerb() {
		return this._verb;
	}

	getAcceptPath() {
		return this._acceptPath;
	}

	getForwardHost() {
		return this._forwardHost;
	}

	getForwardPath() {
		return this._forwardPath;
	}

	getHeaderOverrides() {
		return this._headerOverrides;
	}

	getParameterOverrides() {
		return this._parameterOverrides;
	}

	toString() {
		return '[RelayEndpoint]';
	}
}
