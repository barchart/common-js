import * as assert from '@barchart/common-js/lang/assert.js';

import Enum from '@barchart/common-js/lang/Enum.js';

/**
 * Defines a category of {@link Index}. Currently, there are two types;
 * a "local" secondary index, and a "global" secondary index.
 *
 * @public
 * @extends {Enum}
 */
export default class IndexType extends Enum {
	#allowsConsistentReads;
	#schemaName;
	#separateProvisioning;

	/**
	 * @param {string} code - The code.
	 * @param {string} description - The description.
	 * @param {*} schemaName - The schema name.
	 * @param {*} separateProvisioning - The separate provisioning.
	 * @param {*} allowsConsistentReads - The allows consistent reads.
	 */
	constructor(code, description, schemaName, separateProvisioning, allowsConsistentReads) {
		super(code, description);

		assert.argumentIsRequired(schemaName, 'schemaName', String);
		assert.argumentIsRequired(separateProvisioning, 'separateProvisioning', Boolean);
		assert.argumentIsRequired(allowsConsistentReads, 'allowsConsistentReads', Boolean);

		this.#schemaName = schemaName;
		this.#separateProvisioning = separateProvisioning;
		this.#allowsConsistentReads = allowsConsistentReads;
	}

	/**
	 * Returns the schema name.
	 *
	 * @public
	 * @returns {string}
	 */
	get schemaName() {
		return this.#schemaName;
	}

	/**
	 * Returns the separate provisioning.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get separateProvisioning() {
		return this.#separateProvisioning;
	}

	/**
	 * Indicates is a query or scan on the index supports consistent reads.
	 *
	 * @public
	 * @returns {boolean}
	 */
	get allowsConsistentReads() {
		return this.#allowsConsistentReads;
	}

	/**
	 * Returns the global secondary.
	 *
	 * @public
	 * @static
	 */
	static get GLOBAL_SECONDARY() {
		return indexTypeGlobal;
	}

	/**
	 * Returns the local secondary.
	 *
	 * @public
	 * @static
	 */
	static get LOCAL_SECONDARY() {
		return indexTypeLocal;
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[IndexType (description=${this.code})]`;
	}
}

const indexTypeGlobal = new IndexType('GSI', 'GlobalSecondaryIndex', 'GlobalSecondaryIndexes', true, false);
const indexTypeLocal = new IndexType('LSI', 'LocalSecondaryIndex', 'LocalSecondaryIndexes', false, true);
