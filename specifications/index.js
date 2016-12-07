var AndSpecification = require('./AndSpecification');
var ContainedSpecification = require('./ContainedSpecification');
var ContainsSpecification = require('./ContainsSpecification');
var EqualsSpecification = require('./EqualsSpecification');
var FailSpecification = require('./FailSpecification');
var GreaterThanSpecification = require('./GreaterThanSpecification');
var NumericSpecification = require('./NumericSpecification');
var LessThanSpecification = require('./LessThanSpecification');
var OrSpecification = require('./OrSpecification');
var PassSpecification = require('./PassSpecification');
var Specification = require('./Specification');
var TranslateSpecification = require('./TranslateSpecification');

module.exports = (() => {
	'use strict';

	return {
		AndSpecification: AndSpecification,
		ContainedSpecification: ContainedSpecification,
		ContainsSpecification: ContainsSpecification,
		EqualsSpecification: EqualsSpecification,
		FailSpecification: FailSpecification,
		GreaterThanSpecification: GreaterThanSpecification,
		NumericSpecification: NumericSpecification,
		LessThanSpecification: LessThanSpecification,
		OrSpecification: OrSpecification,
		PassSpecification: PassSpecification,
		Specification: Specification,
		TranslateSpecification: TranslateSpecification
	};
})();
