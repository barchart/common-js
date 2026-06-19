import * as assert from '@barchart/common-js/lang/assert.js';

import Verb from './../../../http/Verb.js';

export default class RestAction {
	#description;
	#verb;

	/**
	 * @param {string} description
	 * @param {*} verb
	 */
	constructor(description, verb) {
		assert.argumentIsRequired(description, 'description', String);
		assert.argumentIsRequired(verb, 'verb', Verb, 'Verb');

		this.#description = description;
		this.#verb = verb;
	}

	/**
	 * Returns the description.
	 *
	 * @public
	 * @returns {string}
	 */
	getDescription() {
		return this.#description;
	}

	/**
	 * Returns the verb.
	 *
	 * @public
	 * @returns {*}
	 */
	getVerb() {
		return this.#verb;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[RestAction (verb=${this.#verb})]`;
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
