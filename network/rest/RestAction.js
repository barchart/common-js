var assert = require('./../../lang/assert');

module.exports = (() => {
	'use strict';

	class RestAction {
		constructor(action, httpVerb, requiresQuery, requiresPayload, useQueryString) {
			assert.argumentIsRequired(action, 'action', String);
			assert.argumentIsRequired(httpVerb, 'httpVerb', String);
			assert.argumentIsRequired(requiresQuery, 'requiresQuery', Boolean);
			assert.argumentIsRequired(requiresPayload, 'requiresPayload', Boolean);
			assert.argumentIsRequired(useQueryString, 'useQueryString', Boolean);

			this._action = action;

			this._httpVerb = httpVerb;
			this._requiresQuery = requiresQuery;
			this._requiresPayload = requiresPayload;
			this._useQuerystring = useQueryString;
		}

		getAction() {
			return this._action;
		}

		getHttpVerb() {
			return this._httpVerb;
		}

		getQueryIsRequired() {
			return this._requiresQuery;
		}

		getPayloadIsRequired() {
			return this._requiresPayload;
		}

		getUseQuerystring() {
			return this._useQuerystring;
		}

		toString() {
			return `[RestAction (action=${this._action})]`;
		}
	}

	const addAction = (restAction) => {
		var action = restAction.getAction();

		RestAction[action] = restAction;
	};

	addAction(new RestAction('Create', 'POST', false, true, false));
	addAction(new RestAction('Update', 'PUT', true, true, false));
	addAction(new RestAction('Retrieve', 'GET', true, false, true));
	addAction(new RestAction('Delete', 'DELETE', true, false, false));
	addAction(new RestAction('Query', 'GET', false, false, true));

	return RestAction;
})();