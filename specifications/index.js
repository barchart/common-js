const AndSpecification = require('./AndSpecification'),
	ContainedSpecification = require('./ContainedSpecification'),
	ContainsSpecification = require('./ContainsSpecification'),
	EqualsSpecification = require('./EqualsSpecification'),
	FailSpecification = require('./FailSpecification'),
	GreaterThanSpecification = require('./GreaterThanSpecification'),
	NumericSpecification = require('./NumericSpecification'),
	LessThanSpecification = require('./LessThanSpecification'),
	OrSpecification = require('./OrSpecification'),
	PassSpecification = require('./PassSpecification'),
	Specification = require('./Specification'),
	TranslateSpecification = require('./TranslateSpecification');

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
