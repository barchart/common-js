import Specification from './../../../specifications/Specification.js';

class PassingSpecification extends Specification {
	_evaluate() {
		return true;
	}
}

class FailingSpecification extends Specification {
	_evaluate() {
		return false;
	}
}

describe('When Specification is used', () => {
	'use strict';

	it('should evaluate false by default', () => {
		expect(new Specification().evaluate({ })).toEqual(false);
	});

	it('should combine two passing specifications with and', () => {
		expect(new PassingSpecification().and(new PassingSpecification()).evaluate({ })).toEqual(true);
	});

	it('should combine passing and failing specifications with and', () => {
		expect(new PassingSpecification().and(new FailingSpecification()).evaluate({ })).toEqual(false);
	});

	it('should combine failing and passing specifications with or', () => {
		expect(new FailingSpecification().or(new PassingSpecification()).evaluate({ })).toEqual(true);
	});

	it('should combine two failing specifications with or', () => {
		expect(new FailingSpecification().or(new FailingSpecification()).evaluate({ })).toEqual(false);
	});

	it('should invert passing specification with not', () => {
		expect(new PassingSpecification().not().evaluate({ })).toEqual(false);
	});

	it('should invert failing specification with not', () => {
		expect(new FailingSpecification().not().evaluate({ })).toEqual(true);
	});

	it('should validate and specification argument', () => {
		expect(() => new Specification().and(null)).toThrow();
	});

	it('should validate or specification argument', () => {
		expect(() => new Specification().or(null)).toThrow();
	});
});
