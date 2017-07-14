const assert = require('./../../lang/assert');

module.exports = (() => {
	'use strict';

	/**
	 * Maps an action (e.g.. create) to an HTTP verb (e.g. POST).
	 *
	 * @public
	 */
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

		/**
		 * The HTTP action (e.g. create).
		 *
		 * @public
		 * @returns {string}
		 */
		getAction() {
			return this._action;
		}

		/**
		 * The HTTP verb.
		 *
		 * @public
		 * @returns {string}
		 */
		getHttpVerb() {
			return this._httpVerb;
		}

		getQueryIsRequired() {
			return this._requiresQuery;
		}

		getPayloadIsRequired() {
			return this._requiresPayload;
		}

		/**
		 * Indicates if it is appropriate to use a querystring with this action.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		getUseQuerystring() {
			return this._useQuerystring;
		}

		/**
		 * The REST-ful action to create an object.
		 *
		 * @public
		 * @returns {RestAction}
		 */
		static get Create() {
			return CREATE;
		}

		/**
		 * The REST-ful action to update an object.
		 *
		 * @public
		 * @returns {RestAction}
		 */
		static get Update() {
			return UPDATE;
		}

		/**
		 * The REST-ful action to retrieve an object.
		 *
		 * @public
		 * @returns {RestAction}
		 */
		static get Retrieve() {
			return RETRIEVE;
		}

		/**
		 * The REST-ful action to delete an object.
		 *
		 * @public
		 * @returns {RestAction}
		 */
		static get Delete() {
			return DELETE;
		}

		/**
		 * The REST-ful action to retrieve execute a query for object(s).
		 *
		 * @public
		 * @returns {RestAction}
		 */
		static get Query() {
			return QUERY;
		}

		toString() {
			return `[RestAction (action=${this._action})]`;
		}
	}

	const CREATE = new RestAction('Create', 'POST', false, true, false);
	const UPDATE = new RestAction('Update', 'PUT', true, true, false);
	const RETRIEVE = new RestAction('Retrieve', 'GET', true, false, true);
	const DELETE = new RestAction('Delete', 'DELETE', true, false, false);
	const QUERY = new RestAction('Query', 'GET', false, false, true);

	return RestAction;
})();