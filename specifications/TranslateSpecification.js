var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = (() => {
	class TranslateSpecification extends Specification {
		constructor(specification, translator) {
			assert.argumentIsRequired(specification, 'specification', Specification, 'Specification');
			assert.argumentIsRequired(translator, 'translator', Function);

			this._super();

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