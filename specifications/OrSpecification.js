var assert = require('./../lang/assert');

var Specification = require('./Specification');

module.exports = function() {
	var OrSpecification = Specification.extend({
		init: function(specificationOne, specificationTwo) {
			assert.argumentIsRequired(specificationOne, 'specificationOne', Specification, 'Specification');
			assert.argumentIsRequired(specificationTwo, 'specificationTwo', Specification, 'Specification');

			this._super();

			this._specificationOne = specificationOne;
			this._specificationTwo = specificationTwo;
		},

		_evaluate: function(data) {
			return this._specificationOne.evaluate(data) || this._specificationTwo.evaluate(data);
		},

		toString: function() {
			return '[OrSpecification]';
		}
	});

	return OrSpecification;
}();