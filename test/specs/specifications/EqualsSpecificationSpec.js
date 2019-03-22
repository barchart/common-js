const EqualsSpecification = require('./../../../specifications/EqualsSpecification');

describe('When a EqualsSpecification is constructed (without accessors)', () => {
	'use strict';

	let specification;
	let value;

	beforeEach(() => {
		specification = new EqualsSpecification(value = { });
	});

	describe('and the same object is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate(value);
		});

		it('should pass', () => {
			expect(result).toEqual(true);
		});
	});

	describe('and a different same object is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate({ });
		});

		it('should not pass', () => {
			expect(result).toEqual(false);
		});
	});
});

describe('When a EqualsSpecification is constructed (which uses accessors)', () => {
	'use strict';

	let specification;

	let dataSpy;
	let valueSpy;

	beforeEach(() => {
		dataSpy = jasmine.createSpy('dataSpy').and.callFake((data) => data.left);
		valueSpy = jasmine.createSpy('valueSpy').and.callFake((data) => data.right);

		specification = new EqualsSpecification(null, dataSpy, valueSpy);
	});

	describe('and the same object is evaluated', () => {
		let result;

		beforeEach(() => {
			const item = { };

			result = specification.evaluate({ left: item, right: item });
		});

		it('should call the "data" accessor', () => {
			expect(dataSpy).toHaveBeenCalled();
		});

		it('should call the "value" accessor', () => {
			expect(valueSpy).toHaveBeenCalled();
		});

		it('should pass', () => {
			expect(result).toEqual(true);
		});
	});

	describe('and a different object is evaluated', () => {
		let result;

		beforeEach(() => {
			result = specification.evaluate({ left: { }, right: { } });
		});

		it('should call the "data" accessor', () => {
			expect(dataSpy).toHaveBeenCalled();
		});

		it('should call the "value" accessor', () => {
			expect(valueSpy).toHaveBeenCalled();
		});

		it('should not pass', () => {
			expect(result).toEqual(false);
		});
	});
});