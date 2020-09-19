const Not = require('./../../../specifications/Not'),
	Specification = require('./../../../specifications/Specification');

describe('When a Not specification is constructed', () => {
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

	describe('with a specification that always fails', () => {
		let specification;
		let spy;

		let result;

		beforeEach(() => {
			specification = new Not(
				new DelegateSpecification(
					spy = jasmine.createSpy('fn').and.callFake((data) => {
						return false;
					})
				)
			);

			result = specification.evaluate('abc');
		});


		it('should call the wrapped specification', () => {
			expect(spy).toHaveBeenCalled();
		});

		it('should pass', () => {
			expect(result).toEqual(true);
		});
	});

	describe('with a specification that always passes', () => {
		let specification;
		let spy;

		let result;

		beforeEach(() => {
			specification = new Not(
				new DelegateSpecification(
					spy = jasmine.createSpy('fn').and.callFake((data) => {
						return true;
					})
				)
			);

			result = specification.evaluate('abc');
		});


		it('should call the wrapped specification', () => {
			expect(spy).toHaveBeenCalled();
		});

		it('should pass', () => {
			expect(result).toEqual(false);
		});
	});
});

describe('When a Specification (that always fails) is constructed', () => {
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

	describe('and inverted', () => {
		let specification;
		let spy;

		let result;

		beforeEach(() => {
			specification = new DelegateSpecification(
				spy = jasmine.createSpy('fn').and.callFake((data) => {
					return false;
				})
			);

			specification = specification.not();

			result = specification.evaluate('abc');
		});


		it('should call the original specification', () => {
			expect(spy).toHaveBeenCalled();
		});

		it('should pass', () => {
			expect(result).toEqual(true);
		});
	});
});

describe('When a Specification (that always succeeds) is constructed', () => {
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

	describe('and inverted', () => {
		let specification;
		let spy;

		let result;

		beforeEach(() => {
			specification = new DelegateSpecification(
				spy = jasmine.createSpy('fn').and.callFake((data) => {
					return true;
				})
			);

			specification = specification.not();

			result = specification.evaluate('abc');
		});


		it('should call the original specification', () => {
			expect(spy).toHaveBeenCalled();
		});

		it('should pass', () => {
			expect(result).toEqual(false);
		});
	});
});