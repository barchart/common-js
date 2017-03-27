const assert = require('./../lang/assert');

const Specification = require('./Specification');

module.exports = (() => {
	'use strict';

	class TranslateSpecification extends Specification {
		constructor(specification, translator) {
			super();

			assert.argumentIsRequired(specification, 'specification', Specification, 'Specification');
			assert.argumentIsRequired(translator, 'translator', Function);

			this._specification = specification;
			this._translator = translator;
		}

		_evaluate(data) {
			return this._specification.evaluate(this._translator(data));
		}

		toString() {
			return '[TranslateSpecification]';
		}
	}

	return TranslateSpecification;
})();