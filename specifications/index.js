var AndSpecification = require('./AndSpecification');
var EqualsSpecification = require('./EqualsSpecification');
var GreaterThanSpecification = require('./GreaterThanSpecification');
var NumericSpecification = require('./NumericSpecification');
var LessThanSpecification = require('./LessThanSpecification');
var OrSpecification = require('./OrSpecification');
var Specification = require('./Specification');
var TranslateSpecification = require('./TranslateSpecification');

module.exports = function() {
	'use strict';

	return {
		AndSpecification: AndSpecification,
		EqualsSpecification: EqualsSpecification,
		GreaterThanSpecification: GreaterThanSpecification,
		NumericSpecification: NumericSpecification,
		LessThanSpecification: LessThanSpecification,
		OrSpecification: OrSpecification,
		Specification: Specification,
		TranslateSpecification: TranslateSpecification
	};
}();