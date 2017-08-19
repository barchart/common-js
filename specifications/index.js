const AndSpecification = require('./AndSpecification'),
	ContainedSpecification = require('./ContainedSpecification'),
	ContainsSpecification = require('./ContainsSpecification'),
	EqualsSpecification = require('./EqualsSpecification'),
	FailSpecification = require('./FailSpecification'),
	GreaterThanSpecification = require('./GreaterThanSpecification'),
	LessThanSpecification = require('./LessThanSpecification'),
	NanSpecification = require('./NanSpecification'),
	NotSpecification = require('./NotSpecification'),
	NumericSpecification = require('./NumericSpecification'),
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
		LessThanSpecification: LessThanSpecification,
		NanSpecification: NanSpecification,
		NotSpecification: NotSpecification,
		NumericSpecification: NumericSpecification,
		OrSpecification: OrSpecification,
		PassSpecification: PassSpecification,
		Specification: Specification,
		TranslateSpecification: TranslateSpecification
	};
})();
