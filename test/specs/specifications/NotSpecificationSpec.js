var NotSpecification = require('./../../../specifications/NotSpecification');
var Specification = require('./../../../specifications/Specification');

describe('When a NotSpecification is constructed', function() {
	'use strict';

	class DelegateSpecification extends Specification {
		constructor(fn) {
			super();

			this._fn = fn;
		}

		_evaluate(data) {
			return this._fn(data);
		}
	}

	describe('with a specification that always fails', function() {
		var specification;
		var spy;

		var result;

		beforeEach(function() {
			specification = new NotSpecification(
				new DelegateSpecification(
					spy = jasmine.createSpy('fn').and.callFake(function(data) {
						return false;
					})
				)
			);

			result = specification.evaluate('abc');
		});


		it('should call the wrapped specification', function() {
			expect(spy).toHaveBeenCalled();
		});

		it('should pass', function() {
			expect(result).toEqual(true);
		});
	});

	describe('with a specification that always passes', function() {
		var specification;
		var spy;

		var result;

		beforeEach(function() {
			specification = new NotSpecification(
				new DelegateSpecification(
					spy = jasmine.createSpy('fn').and.callFake(function(data) {
						return true;
					})
				)
			);

			result = specification.evaluate('abc');
		});


		it('should call the wrapped specification', function() {
			expect(spy).toHaveBeenCalled();
		});

		it('should pass', function() {
			expect(result).toEqual(false);
		});
	});
});

describe('When a Specification (that always fails) is constructed', function() {
	'use strict';

	class DelegateSpecification extends Specification {
		constructor(fn) {
			super();

			this._fn = fn;
		}

		_evaluate(data) {
			return this._fn(data);
		}
	}

	describe('and inverted', function () {
		var specification;
		var spy;

		var result;

		beforeEach(function () {
			specification = new DelegateSpecification(
				spy = jasmine.createSpy('fn').and.callFake(function (data) {
					return false;
				})
			);

			specification = specification.not();

			result = specification.evaluate('abc');
		});


		it('should call the original specification', function () {
			expect(spy).toHaveBeenCalled();
		});

		it('should pass', function () {
			expect(result).toEqual(true);
		});
	});
});

describe('When a Specification (that always succeeds) is constructed', function() {
	'use strict';

	class DelegateSpecification extends Specification {
		constructor(fn) {
			super();

			this._fn = fn;
		}

		_evaluate(data) {
			return this._fn(data);
		}
	}

	describe('and inverted', function () {
		var specification;
		var spy;

		var result;

		beforeEach(function () {
			specification = new DelegateSpecification(
				spy = jasmine.createSpy('fn').and.callFake(function (data) {
					return true;
				})
			);

			specification = specification.not();

			result = specification.evaluate('abc');
		});


		it('should call the original specification', function () {
			expect(spy).toHaveBeenCalled();
		});

		it('should pass', function () {
			expect(result).toEqual(false);
		});
	});
});