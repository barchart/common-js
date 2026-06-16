import * as assert from '@barchart/common-js/lang/assert.js';

import Money from '@barchart/common-js/lang/Money.js';

import ComponentSerializer from './ComponentSerializer.js';
import ComponentType from './../../definitions/ComponentType.js';

/**
 * A component serializer for {@link Money} instances.
 *
 * @public
 * @extends {ComponentSerializer}
 */
export default class MoneySerializer extends ComponentSerializer {
	constructor() {
		super(ComponentType.MONEY);
	}

	_readComponent(object) {
		assert.argumentIsRequired(object, 'object', Money, 'Money');

		return [
			object.decimal,
			object.currency
		];
	}

	_createComponent(data) {
		return new Money(data[0], data[1]);
	}

	/**
	 * A singleton.
	 *
	 * @public
	 * @static
	 * @returns {MoneySerializer}
	 */
	static get INSTANCE() {
		return instance;
	}

	toString() {
		return '[MoneySerializer]';
	}
}

const instance = new MoneySerializer();
