const Decimal = require('./../../../lang/Decimal');

describe('When adding values that cause floating point problems (e.g. 1.1 + 2.2 != 3.3)', () => {
	'use strict';

	let a;
	let b;
	let c;

	beforeEach(() => {
		a = new Decimal(1.1);
		b = new Decimal(2.2);

		c = a.add(b);
	});

	describe('and exported to a floating point value', () => {
		let f;

		beforeEach(() => {
			f = c.toFloat();
		});

		it('should sum to 3.3 (not 3.3000000000000003)', () => {
			expect(f).toEqual(3.3);
		});
	});
});

describe('When working with values that loss of precision occurs with floating point math (e.g. 100 trillion plus one third)', () => {
	'use strict';

	let a;
	let b;
	let c;

	beforeEach(() => {
		a = new Decimal(100000000000000);
		b = new Decimal(1/8);

		c = a.add(b);
	});

	describe('and exported to a fixed string', () => {
		let f;

		beforeEach(() => {
			f = c.toFixed();
		});

		it('should maintain precision', () => {
			expect(f).toEqual("100000000000000.125");
		});
	});
});

describe('When accessing the "Zero" singleton', () => {
	'use strict';

	let zero;

	beforeEach(() => {
		zero = Decimal.ZERO;
	});

	it('should not be positive', () => {
		expect(zero.getIsPositive()).toEqual(false);
	});

	it('should not be negative', () => {
		expect(zero.getIsNegative()).toEqual(false);
	});

	it('should be zero', () => {
		expect(zero.getIsZero()).toEqual(true);
	});

	it('should approximate zero', () => {
		expect(zero.getIsZero(true)).toEqual(true);
	});

	it('the floating point export should equal zero', () => {
		expect(zero.toFloat()).toEqual(0);
	});

	it('the fixed export should equal "0"', () => {
		expect(zero.toFixed()).toEqual('0');
	});

	it('the number export should equal "0"', () => {
		expect(zero.toNumber()).toEqual(0);
	});
});

describe('When instantiating a Decimal', () => {
	'use strict';

	describe('from an object', () => {
		it('should throw', () => {
			expect(() => {
				let d = new Decimal({ });
			}).toThrow();
		});
	});

	describe('from a null value', () => {
		it('should throw', () => {
			expect(() => {
				let d = new Decimal(null);
			}).toThrow();
		});
	});

	describe('from an undefined value', () => {
		it('should throw', () => {
			expect(() => {
				let d = new Decimal(undefined);
			}).toThrow();
		});
	});

	describe('from the number forty two', () => {
		let d;

		beforeEach(() => {
			d = new Decimal(42);
		});

		it('should not be positive', () => {
			expect(d.getIsPositive()).toEqual(true);
		});

		it('should not be negative', () => {
			expect(d.getIsNegative()).toEqual(false);
		});

		it('should be zero', () => {
			expect(d.getIsZero()).toEqual(false);
		});

		it('should approximate zero', () => {
			expect(d.getIsZero(true)).toEqual(false);
		});

		it('the floating point export should equal the meaning of life', () => {
			expect(d.toFloat()).toEqual(42);
		});

		it('the fixed export should equal "42"', () => {
			expect(d.toFixed()).toEqual('42');
		});

		it('the number export should equal "0"', () => {
			expect(d.toNumber()).toEqual(42);
		});

		describe('and adding the number one', () => {
			let e;

			beforeEach(() => {
				e = d.add(1);
			});

			it('should return a Decimal instance', () => {
				expect(e instanceof Decimal).toEqual(true);
			});

			it('should be a different instance', () => {
				expect(e).not.toBe(d);
			});

			it('should equal forty three', () => {
				expect(e.toFloat()).toEqual(43);
			});

			it('should not mutate the original instance', () => {
				expect(d.toFloat()).toEqual(42);
			});
		});

		describe('and adding a Decimal having a value of one', () => {
			let e;
			let x;

			beforeEach(() => {
				e = d.add(x = new Decimal(1));
			});

			it('should return a Decimal instance', () => {
				expect(e instanceof Decimal).toEqual(true);
			});

			it('should be a different instance', () => {
				expect(e).not.toBe(d);
			});

			it('should equal forty three', () => {
				expect(e.toFloat()).toEqual(43);
			});

			it('should not mutate the original instance', () => {
				expect(d.toFloat()).toEqual(42);
			});

			it('should not mutate the operand', () => {
				expect(x.toFloat()).toEqual(1);
			});
		});

		describe('and dividing by zero', () => {
			it('should throw', () => {
				expect(() => {
					let e = d.divideBy(0);
				}).toThrow();
			});
		});

		describe('and modulo by zero', () => {
			it('should throw', () => {
				expect(() => {
					let e = d.mod(0);
				}).toThrow();
			});
		});
	});

	describe('from the string "1"', () => {
		let d;

		beforeEach(() => {
			d = new Decimal("1");
		});

		it('should be positive', () => {
			expect(d.getIsPositive()).toEqual(true);
		});

		it('should not be negative', () => {
			expect(d.getIsNegative()).toEqual(false);
		});

		it('should be zero', () => {
			expect(d.getIsZero()).toEqual(false);
		});

		it('the fixed export should equal "1"', () => {
			expect(d.toFixed()).toEqual('1');
		});
	});

	describe('from another Decimal', () => {
		let original;
		let copy;

		beforeEach(() => {
			original = new Decimal('1.234');
			copy = new Decimal(original);
		});

		it('the copied value should be equal to the original value', () => {
			expect(copy.getIsEqual(original)).toEqual(true);
		});

		it('the original value should be equal to the copied value', () => {
			expect(original.getIsEqual(copy)).toEqual(true);
		});

		it('the copied value should not be a reference to the original value', () => {
			expect(original === copy).toEqual(false);
		});
	});
});

describe('When checking for integers', () => {
	'use strict';

	it('should indicate a zero value is an integer', () => {
		expect(new Decimal('0').getIsInteger()).toEqual(true);
	});

	it('should indicate a value of one is an integer', () => {
		expect(new Decimal('1').getIsInteger()).toEqual(true);
	});

	it('should indicate a value of negative one is an integer', () => {
		expect(new Decimal('-1').getIsInteger()).toEqual(true);
	});

	it('should indicate a value of one and a half is not an integer', () => {
		expect(new Decimal('1.5').getIsInteger()).toEqual(false);
	});

	it('should indicate a value of slightly less than one is an not integer', () => {
		const numerator = new Decimal('999999999');
		const denominator = new Decimal('1000000000');

		expect(numerator.divide(denominator).getIsInteger()).toEqual(false);
	});

	it('should indicate a value of slightly greater than one is an not integer', () => {
		const numerator = new Decimal('1000000000');
		const denominator = new Decimal('999999999');

		expect(numerator.divide(denominator).getIsInteger()).toEqual(false);
	});
});

describe('When counting the number of decimal places', () => {
	'use strict';

	it('should indicate a value of zero has no decimal places', () => {
		expect(new Decimal('0').getDecimalPlaces()).toEqual(0);
	});

	it('should indicate a value of one has no decimal places', () => {
		expect(new Decimal('1').getDecimalPlaces()).toEqual(0);
	});

	it('should indicate a value of negative one has no decimal places', () => {
		expect(new Decimal('-1').getDecimalPlaces()).toEqual(0);
	});

	it('should indicate a value of twenty three has no decimal places', () => {
		expect(new Decimal('23').getDecimalPlaces()).toEqual(0);
	});

	it('should indicate a value of twenty three has no decimal places', () => {
		expect(new Decimal('-23').getDecimalPlaces()).toEqual(0);
	});

	it('should indicate a value of one tenth has one decimal places', () => {
		expect(new Decimal('0.1').getDecimalPlaces()).toEqual(1);
	});

	it('should indicate a value of negative one tenth has one decimal places', () => {
		expect(new Decimal('-0.1').getDecimalPlaces()).toEqual(1);
	});

	it('should indicate a value of one eighth has one decimal places', () => {
		expect(new Decimal('0.125').getDecimalPlaces()).toEqual(3);
	});

	it('should indicate a value of negative one eighth has one decimal places', () => {
		expect(new Decimal('-0.125').getDecimalPlaces()).toEqual(3);
	});

	it('should indicate a value of one hundredth has one decimal places', () => {
		expect(new Decimal('0.01').getDecimalPlaces()).toEqual(2);
	});

	it('should indicate a value of negative one hundredth has one decimal places', () => {
		expect(new Decimal('-0.01').getDecimalPlaces()).toEqual(2);
	});

	it('should indicate a value of "123.123456789012345678901234 has 24 decimal places', () => {
		expect(new Decimal('123.123456789012345678901234').getDecimalPlaces()).toEqual(24);
	});

	it('should indicate a value of "-123.123456789012345678901234 has 24 decimal places', () => {
		expect(new Decimal('-123.123456789012345678901234').getDecimalPlaces()).toEqual(24);
	});
});

describe('When checking for values that approximate zero', () => {
	'use strict';

	it('A value of "0.01" should approximate zero, when rounding to one decimal places', () => {
		expect(new Decimal('0.01').getIsZero(true, 1)).toEqual(true);
	});

	it('A value of "0.09" should not approximate zero, when rounding to one decimal places', () => {
		expect(new Decimal('0.09').getIsZero(true, 1)).toEqual(false);
	});

	it('A value of "0.01" should not approximate zero, when rounding is not specified', () => {
		expect(new Decimal('0.01').getIsZero(true)).toEqual(false);
	});

	it('A value of "0.09" should not approximate zero, when rounding is not specified', () => {
		expect(new Decimal('0.09').getIsZero(true)).toEqual(false);
	});
});

describe('When raising to a power', () => {
	'use strict';

	it('The value of 2 raised to 8 should be 256', () => {
		expect(new Decimal(2).raise(8).getIsEqual(256)).toEqual(true);
	});

	it('The value of 2 raised to -1 should be 0.5', () => {
		expect(new Decimal(2).raise(-1).getIsEqual(0.5)).toEqual(true);
	});

	it('The value of 2 raised to 0 should be 1', () => {
		expect(new Decimal(2).raise(0).getIsEqual(1)).toEqual(true);
	});
});

describe('When checking for values that approximate each other', () => {
	'use strict';

	it('A value of "1" should approximate a value of "1" (when using ten significant digits)', () => {
		expect(new Decimal('1').getIsApproximate(new Decimal('1'), 10)).toEqual(true);
	});

	it('A value of "10" should approximate a value of "10" (when using zero significant digits)', () => {
		expect(new Decimal('10').getIsApproximate(new Decimal('10'), 0)).toEqual(true);
	});

	it('A value of "10" should not approximate a value of "10.0001" (when using zero significant digits)', () => {
		expect(new Decimal('10').getIsApproximate(new Decimal('10.0001'), 0)).toEqual(false);
	});

	it('A value of "10.0001" should not approximate a value of "10" (when using zero significant digits)', () => {
		expect(new Decimal('10.0001').getIsApproximate(new Decimal('10'), 0)).toEqual(false);
	});

	it('A value of "0.01" should approximate a value of "0.019" (when using two significant digits)', () => {
		expect(new Decimal('0.01').getIsApproximate(new Decimal('0.019'), 2)).toEqual(true);
	});

	it('A value of "0.019" should approximate a value of "0.01" (when using two significant digits)', () => {
		expect(new Decimal('0.019').getIsApproximate(new Decimal('0.01'), 2)).toEqual(true);
	});

	it('A value of "-0.01" should approximate a value of "-0.019" (when using two significant digits)', () => {
		expect(new Decimal('-0.01').getIsApproximate(new Decimal('-0.019'), 2)).toEqual(true);
	});

	it('A value of "-0.019" should approximate a value of "-0.01" (when using two significant digits)', () => {
		expect(new Decimal('-0.019').getIsApproximate(new Decimal('-0.01'), 2)).toEqual(true);
	});

	it('A value of "0.01" should approximate a value of "0.009" (when using two significant digits)', () => {
		expect(new Decimal('0.01').getIsApproximate(new Decimal('0.009'), 2)).toEqual(true);
	});

	it('A value of "0.009" should approximate a value of "0.01" (when using two significant digits)', () => {
		expect(new Decimal('0.009').getIsApproximate(new Decimal('0.01'), 2)).toEqual(true);
	});

	it('A value of "0.01" should not approximate a value of "0.02" (when using two significant digits)', () => {
		expect(new Decimal('0.01').getIsApproximate(new Decimal('0.02'), 2)).toEqual(false);
	});

	it('A value of "0.02" should not approximate a value of "0.01" (when using two significant digits)', () => {
		expect(new Decimal('0.02').getIsApproximate(new Decimal('0.01'), 2)).toEqual(false);
	});

	it('A value of "0.01" should not approximate a value of "-0.01" (when using two significant digits)', () => {
		expect(new Decimal('0.01').getIsApproximate(new Decimal('-0.01'), 2)).toEqual(false);
	});

	it('A value of "-0.01" should not approximate a value of "0.01" (when using two significant digits)', () => {
		expect(new Decimal('-0.01').getIsApproximate(new Decimal('0.01'), 2)).toEqual(false);
	});

	it('A value of "0.00001" should approximate a value of Decimal.ZERO (when using four significant digits)', () => {
		expect(new Decimal('0.00001').getIsApproximate(Decimal.ZERO, 4)).toEqual(true);
	});

	it('A value of "0.00001" should not approximate a value of Decimal.ZERO (when using five significant digits)', () => {
		expect(new Decimal('0.00001').getIsApproximate(Decimal.ZERO, 5)).toEqual(false);
	});
});

describe('When cloning a decimal', () => {
	'use strict';

	let source;
	let clone;

	beforeEach(() => {
		source = new Decimal(Math.PI);
		clone = Decimal.clone(source);
	});

	it('the cloned instance should not be the same as the source instance', () => {
		expect(clone).not.toBe(source);
	});

	it('the cloned instance should equal the source instance', () => {
		expect(source.getIsEqual(clone)).toEqual(true);
	});
});

describe('When checking for containment', () => {
	let d;

	beforeEach(() => {
		d = new Decimal('1.234');
	});

	describe('with inclusivity', () => {
		it('The value of 1.234 should be between -2 and 2', () => {
			expect(d.getIsBetween(-2, 2)).toEqual(true);
		});

		it('The value of 1.234 should be between 1.234 and 1.235', () => {
			expect(d.getIsBetween(1.234, 1.235)).toEqual(true);
		});

		it('The value of 1.234 should be between 1.233 and 1.234', () => {
			expect(d.getIsBetween(1.233, 1.234)).toEqual(true);
		});

		it('The value of 1.234 should be between 1.234 and 1.234', () => {
			expect(d.getIsBetween(1.234, 1.234)).toEqual(true);
		});

		it('The value of 1.234 should not be between 0 and 1', () => {
			expect(d.getIsBetween(0, 1)).toEqual(false);
		});

		it('The value of 1.234 should not be between 2 and 1', () => {
			expect(d.getIsBetween(2, 1)).toEqual(false);
		});
	});

	describe('with exclusivity', () => {
		it('The value of 1.234 should be between -2 and 2', () => {
			expect(d.getIsBetween(-2, 2, true)).toEqual(true);
		});

		it('The value of 1.234 should not be between 1.234 and 1.235', () => {
			expect(d.getIsBetween(1.234, 1.235, true)).toEqual(false);
		});

		it('The value of 1.234 should not be between 1.233 and 1.234', () => {
			expect(d.getIsBetween(1.233, 1.234, true)).toEqual(false);
		});

		it('The value of 1.234 should not be between 1.234 and 1.234', () => {
			expect(d.getIsBetween(1.234, 1.234, true)).toEqual(false);
		});

		it('The value of 1.234 should not be between 0 and 1', () => {
			expect(d.getIsBetween(0, 1, true)).toEqual(false);
		});

		it('The value of 1.234 should not be between 2 and 1', () => {
			expect(d.getIsBetween(2, 1, true)).toEqual(false);
		});
	});
});
