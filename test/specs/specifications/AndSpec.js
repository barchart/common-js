const Specification = require('./../../../specifications/Specification'),
	And = require('./../../../specifications/And');

describe('When an And is constructed', () => {
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
			specification = new And(specPassOne = new SpecPass(), specPassTwo = new SpecPass());

			result = specification.evaluate(data = {});
		});

		it('should call the first specification', () => {
			expect(specPassOne._spy).toHaveBeenCalledWith(data);
		});

		it('should call the second specification', () => {
			expect(specPassTwo._spy).toHaveBeenCalledWith(data);
		});

		it('should evaluate to true', () => {
			expect(result).toEqual(true);
		});
	});

	describe('where the first specifications will fail', () => {
		let specification;

		let specPassOne;
		let specPassTwo;

		let data;
		let result;

		beforeEach(() => {
			specification = new And(specPassOne = new SpecFail(), specPassTwo = new SpecPass());

			result = specification.evaluate(data = {});
		});

		it('should call the first specification', () => {
			expect(specPassOne._spy).toHaveBeenCalledWith(data);
		});

		it('should not call the second specification', () => {
			expect(specPassTwo._spy).not.toHaveBeenCalledWith(data);
		});

		it('should evaluate to false', () => {
			expect(result).toEqual(false);
		});
	});
});