var AndSpecification = require('./AndSpecification');
var EqualsSpecification = require('./EqualsSpecification');
var GreaterThanSpecification = require('./GreaterThanSpecification');
var LessThanSpecification = require('./LessThanSpecification');
var OrSpecification = require('./OrSpecification');
var Specification = require('./Specification');
var SpecificationBuilder = require('./SpecificationBuilder');
var TranslateSpecification = require('./TranslateSpecification');

module.exports = function() {
	'use strict';

	return {
		AndSpecification: AndSpecification,
		EqualsSpecification: EqualsSpecification,
		GreaterThanSpecification: GreaterThanSpecification,
		LessThanSpecification: LessThanSpecification,
		OrSpecification: OrSpecification,
		Specification: Specification,
		SpecificationBuilder: SpecificationBuilder,
		TranslateSpecification: TranslateSpecification
	};
}();