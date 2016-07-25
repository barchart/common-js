var Specification = require('./../../../specifications/Specification');
var AndSpecification = require('./../../../specifications/AndSpecification');

describe('When an AndSpecification is constructed', function() {
	'use strict';

	class SpecPass extends Specification {
		constructor() {
			super();

			this._spy = jasmine.createSpy('spyPass').and.returnValue(true);
		}

		_evaluate(data) {
			return this._spy (data);
		}
	}

	class SpecFail extends Specification {
		constructor() {
			super();

			this._spy = jasmine.createSpy('spyPass').and.returnValue(false);
		}

		_evaluate(data) {
			return this._spy (data);
		}
	}

	describe('with two specifications that will pass', function() {
		var specification;

		var specPassOne;
		var specPassTwo;

		var data;
		var result;

		beforeEach(function() {
			specification = new AndSpecification(specPassOne = new SpecPass(), specPassTwo = new SpecPass());

			result = specification.evaluate(data = {});
		});

		it('should call the first specification', function() {
			expect(specPassOne._spy).toHaveBeenCalledWith(data);
		});

		it('should call the second specification', function() {
			expect(specPassTwo._spy).toHaveBeenCalledWith(data);
		});

		it('should evaluate to true', function() {
			expect(result).toEqual(true);
		});
	});

	describe('where the first specifications will fail', function() {
		var specification;

		var specPassOne;
		var specPassTwo;

		var data;
		var result;

		beforeEach(function() {
			specification = new AndSpecification(specPassOne = new SpecFail(), specPassTwo = new SpecPass());

			result = specification.evaluate(data = {});
		});

		it('should call the first specification', function() {
			expect(specPassOne._spy).toHaveBeenCalledWith(data);
		});

		it('should not call the second specification', function() {
			expect(specPassTwo._spy).not.toHaveBeenCalledWith(data);
		});

		it('should evaluate to false', function() {
			expect(result).toEqual(false);
		});
	});
});