const assert = require('@barchart/common-js/lang/assert');

const Verb = require('./../../../http/Verb');

module.exports = (() => {
	'use strict';

	class RestAction {
		constructor(description, verb) {
			assert.argumentIsRequired(description, 'description', String);
			assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');

			this._description = description;
			this._verb = verb;
		}

		getDescription() {
			return this._description;
		}

		getVerb() {
			return this._verb;
		}

		toString() {
			return `[RestAction (verb=${this._verb})]`;
		}
	}

	function addRestAction(action) {
		const description = action.getDescription();

		RestAction[description] = action;
	}

	addRestAction(new RestAction('Create', Verb.POST));
	addRestAction(new RestAction('Retrieve', Verb.GET));
	addRestAction(new RestAction('Update', Verb.PUT));
	addRestAction(new RestAction('Delete', Verb.DELETE));
	addRestAction(new RestAction('Query', Verb.GET));

	return RestAction;
})();