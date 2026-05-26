const assert = require('@barchart/common-js/lang/assert'),
	Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * Defines a category of {@link Index}. Currently, there are two types;
	 * a "local" secondary index, and a "global" secondary index.
	 *
	 * @public
	 * @extends {Enum}
	 */
	class IndexType extends Enum {
		constructor(code, description, schemaName, separateProvisioning, allowsConsistentReads) {
			super(code, description);

			assert.argumentIsRequired(schemaName, 'schemaName', String);
			assert.argumentIsRequired(separateProvisioning, 'separateProvisioning', Boolean);
			assert.argumentIsRequired(allowsConsistentReads, 'allowsConsistentReads', Boolean);

			this._schemaName = schemaName;
			this._separateProvisioning = separateProvisioning;
			this._allowsConsistentReads = allowsConsistentReads;
		}

		get schemaName() {
			return this._schemaName;
		}

		get separateProvisioning() {
			return this._separateProvisioning;
		}

		/**
		 * Indicates is a query or scan on the index supports consistent reads.
		 *
		 * @public
		 * @returns {Boolean}
		 */
		get allowsConsistentReads() {
			return this._allowsConsistentReads;
		}

		static get GLOBAL_SECONDARY() {
			return indexTypeGlobal;
		}

		static get LOCAL_SECONDARY() {
			return indexTypeLocal;
		}

		toString() {
			return `[IndexType (description=${this.code})]`;
		}
	}

	const indexTypeGlobal = new IndexType('GSI', 'GlobalSecondaryIndex', 'GlobalSecondaryIndexes', true, false);
	const indexTypeLocal = new IndexType('LSI', 'LocalSecondaryIndex', 'LocalSecondaryIndexes', false, true);

	return IndexType;
})();