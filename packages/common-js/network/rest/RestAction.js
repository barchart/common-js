const assert = require('./../../lang/assert'),
	Enum = require('./../../lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Maps an action (e.g. create) to an HTTP verb (e.g. POST).
	 *
	 * @public
	 * @extends {Enum}
	 */
	class RestAction extends Enum {
		constructor(action, httpVerb, requiresPath, requiresPayload, allowQuerystring, allowBody) {
			super(action, action);

			assert.argumentIsRequired(action, 'action', String);
			assert.argumentIsRequired(httpVerb, 'httpVerb', String);
			assert.argumentIsRequired(requiresPath, 'requiresPath', Boolean);
			assert.argumentIsRequired(requiresPayload, 'requiresPayload', Boolean);
			assert.argumentIsRequired(allowQuerystring, 'allowQuerystring', Boolean);
			assert.argumentIsRequired(allowBody, 'allowBody', Boolean);

			this._action = action;

			this._httpVerb = httpVerb;
			this._requiresPath = requiresPath;
			this._requiresPayload = requiresPayload;
			this._allowQuerystring = allowQuerystring;
			this._allowBody = allowBody;
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

		/**
		 * Indicates if a path, beyond the base URL, is required.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		getPathIsRequired() {
			return this._requiresPath;
		}

		/**
		 * Indicates if a payload is required, either for the purpose of formulating a
		 * request body or querystring, is required.
		 *
		 * @public
		 * @returns {*}
		 */
		getPayloadIsRequired() {
			return this._requiresPayload;
		}

		/**
		 * Indicates if a querystring is allowed with this action.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		getAllowQuerystring() {
			return this._allowQuerystring;
		}

		/**
		 * Indicates if a request body is allowed with this action.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		getAllowBody() {
			return this._allowBody;
		}

		/**
		 * Given a code, returns the enumeration item.
		 *
		 * @public
		 * @param {String} code
		 * @returns {RestAction|null}
		 */
		static parse(code) {
			return Enum.fromCode(RestAction, code);
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
	}

	const CREATE = new RestAction('Create', 'POST', false, true, false, true);
	const UPDATE = new RestAction('Update', 'PUT', true, true, false, true);
	const RETRIEVE = new RestAction('Retrieve', 'GET', true, false, true, false);
	const DELETE = new RestAction('Delete', 'DELETE', true, false, false, false);
	const QUERY = new RestAction('Query', 'GET', false, false, true, false);

	return RestAction;
})();