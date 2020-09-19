const Specification = require('./../../../specifications/Specification'),
	Or = require('./../../../specifications/Or');

describe('When an Or specification is constructed', () => {
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

	describe('with two specifications that will pass', () => {
		let specification;

		let specPassOne;
		let specPassTwo;

		let data;
		let result;

		beforeEach(() => {
			specification = new Or(specPassOne = new SpecPass(), specPassTwo = new SpecPass());

			result = specification.evaluate(data = {});
		});

		it('should call the first specification', () => {
			expect(specPassOne._spy).toHaveBeenCalledWith(data);
		});

		it('should not call the second specification', () => {
			expect(specPassTwo._spy).not.toHaveBeenCalledWith(data);
		});

		it('should evaluate to false', () => {
			expect(result).toEqual(true);
		});
	});

	describe('with two specifications that will fail', () => {
		let specification;

		let specPassOne;
		let specPassTwo;

		let data;
		let result;

		beforeEach(() => {
			specification = new Or(specPassOne = new SpecFail(), specPassTwo = new SpecFail());

			result = specification.evaluate(data = {});
		});

		it('should call the first specification', () => {
			expect(specPassOne._spy).toHaveBeenCalledWith(data);
		});

		it('should call the second specification', () => {
			expect(specPassTwo._spy).toHaveBeenCalledWith(data);
		});

		it('should evaluate to false', () => {
			expect(result).toEqual(false);
		});
	});
});