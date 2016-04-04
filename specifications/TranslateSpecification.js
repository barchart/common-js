var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = function() {
	var TranslateSpecification = Specification.extend({
		init: function(specification, translator) {
			assert.argumentIsRequired(specification, 'specification', Specification, 'Specification');
			assert.argumentIsRequired(translator, 'translator', Function);

			this._super();

			this._specification = specification;
			this._translator = translator;
		},

		_evaluate: function(data) {
			return this._specification.evaluate(this._translator(data));
		},

		toString: function() {
			return '[TranslateSpecification]';
		}
	});

	return TranslateSpecification;
}();