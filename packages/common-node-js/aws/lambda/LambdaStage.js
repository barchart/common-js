import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';

import Enum from '@barchart/common-js/lang/Enum.js';

/**
 * Defines stage for lambda functions.
 *
 * @public
 * @extends {Enum}
 */
export default class LambdaStage extends Enum {
	/**
	 * @param {string} code
	 * @param {string} description
	 */
	constructor(code, description) {
		super(code, description);
	}

	/**
	 * Development.
	 *
	 * @static
	 * @returns {LambdaStage}
	 */
	static get DEV() {
		return dev;
	}

	/**
	 * Demo.
	 *
	 * @static
	 * @returns {LambdaStage}
	 */
	static get DEMO() {
		return demo;
	}

	/**
	 * Stage.
	 *
	 * @static
	 * @returns {LambdaStage}
	 */
	static get STAGE() {
		return stage;
	}

	/**
	 * Production.
	 *
	 * @static
	 * @returns {LambdaStage}
	 */
	static get PROD() {
		return prod;
	}

	/**
	 * Returns a stage from name string.
	 *
	 * @public
	 * @static
	 * @param {string} name
	 * @returns {LambdaStage}
	 */
	static getStageFromName(name) {
		assert.argumentIsRequired(name, 'name', String);

		const matches = name.match(/^(.+)-(dev|stage|prod|demo)(-.+|$)$/);

		if (is.array(matches) && matches.length >= 2) {
			const stage = matches[2];

			return Enum.fromCode(LambdaStage, stage);
		} else {
			return LambdaStage.DEV;
		}
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return `[LambdaStage (code=${this.code})]`;
	}
}

const dev = new LambdaStage('dev', 'Development');
const demo = new LambdaStage('demo', 'Demo');
const stage = new LambdaStage('stage', 'Stage');
const prod = new LambdaStage('prod', 'Production');
