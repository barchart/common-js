var Decimal = require('./../../../lang/Decimal');

describe('When adding values that cause floating point problems (e.g. 1.1 + 2.2 != 3.3)', function() {
	'use strict';

	var a;
	var b;
	var c;

	beforeEach(function() {
		a = new Decimal(1.1);
		b = new Decimal(2.2);

		c = a.add(b);
	});

	describe('and exported to a floating point value', function() {
		var f;

		beforeEach(function() {
			f = c.toFloat();
		});

		it('should sum to 3.3 (not 3.3000000000000003)', function() {
			expect(f).toEqual(3.3);
		});
	});
});


describe('When working with values that loss of precision occurs with floating point math (e.g. 100 trillion plus one third)', function() {
	'use strict';

	var a;
	var b;
	var c;

	beforeEach(function() {
		a = new Decimal(100000000000000);
		b = new Decimal(1/8);

		c = a.add(b);
	});

	describe('and exported to a fixed string', function() {
		var f;

		beforeEach(function() {
			f = c.toFixed();
		});

		it('should maintain precision', function() {
			expect(f).toEqual("100000000000000.125");
		});
	});
});

describe('When accessing the "Zero" singleton', function() {
	'use strict';

	var zero;

	beforeEach(function() {
		zero = Decimal.ZERO;
	});

	it('should not be positive', function() {
		expect(zero.getIsPositive()).toEqual(false);
	});

	it('should not be negative', function() {
		expect(zero.getIsNegative()).toEqual(false);
	});

	it('should be zero', function() {
		expect(zero.getIsZero()).toEqual(true);
	});

	it('should approximate zero', function() {
		expect(zero.getIsZero(true)).toEqual(true);
	});

	it('the floating point export should equal zero', function() {
		expect(zero.toFloat()).toEqual(0);
	});

	it('the fixed export should equal "0"', function() {
		expect(zero.toFixed()).toEqual('0');
	});
});

describe('When instantiating a Decimal', function() {
	'use strict';

	describe('from an object', function() {
		it('should throw', function() {
			expect(function() {
				var d = new Decimal({ });
			}).toThrow();
		});
	});

	describe('from a null value', function() {
		it('should throw', function() {
			expect(function() {
				var d = new Decimal(null);
			}).toThrow();
		});
	});

	describe('from an undefined value', function() {
		it('should throw', function() {
			expect(function() {
				var d = new Decimal(undefined);
			}).toThrow();
		});
	});

	describe('from the number forty two', function() {
		var d;

		beforeEach(function() {
			d = new Decimal(42);
		});

		it('should not be positive', function() {
			expect(d.getIsPositive()).toEqual(true);
		});

		it('should not be negative', function() {
			expect(d.getIsNegative()).toEqual(false);
		});

		it('should be zero', function() {
			expect(d.getIsZero()).toEqual(false);
		});

		it('should approximate zero', function() {
			expect(d.getIsZero(true)).toEqual(false);
		});

		it('the floating point export should equal the meaning of life', function() {
			expect(d.toFloat()).toEqual(42);
		});

		it('the fixed export should equal "42"', function() {
			expect(d.toFixed()).toEqual('42');
		});

		describe('and adding the number one', function() {
			var e;

			beforeEach(function() {
				e = d.add(1);
			});

			it('should return a Decimal instance', function() {
				expect(e instanceof Decimal).toEqual(true);
			});

			it('should be a different instance', function() {
				expect(e).not.toBe(d);
			});

			it('should equal forty three', function() {
				expect(e.toFloat()).toEqual(43);
			});

			it('should not mutate the original instance', function() {
				expect(d.toFloat()).toEqual(42);
			});
		});

		describe('and adding a Decimal having a value of one', function() {
			var e;
			var x;

			beforeEach(function() {
				e = d.add(x = new Decimal(1));
			});

			it('should return a Decimal instance', function() {
				expect(e instanceof Decimal).toEqual(true);
			});

			it('should be a different instance', function() {
				expect(e).not.toBe(d);
			});

			it('should equal forty three', function() {
				expect(e.toFloat()).toEqual(43);
			});

			it('should not mutate the original instance', function() {
				expect(d.toFloat()).toEqual(42);
			});

			it('should not mutate the operand', function() {
				expect(x.toFloat()).toEqual(1);
			});
		});

		describe('and dividing by zero', function() {
			it('should throw', function() {
				expect(function() {
					var e = d.divideBy(0);
				}).toThrow();
			});
		});
	});

	describe('from the string "1"', function() {
		var d;

		beforeEach(function() {
			d = new Decimal("1");
		});

		it('should be positive', function() {
			expect(d.getIsPositive()).toEqual(true);
		});

		it('should not be negative', function() {
			expect(d.getIsNegative()).toEqual(false);
		});

		it('should be zero', function() {
			expect(d.getIsZero()).toEqual(false);
		});

		it('the fixed export should equal "1"', function() {
			expect(d.toFixed()).toEqual('1');
		});
	});
});

describe('When checking for integers', function() {
	'use strict';

	it('should indicate a zero value is an integer', function() {
		expect(new Decimal('0').getIsInteger()).toEqual(true);
	});

	it('should indicate a value of one is an integer', function() {
		expect(new Decimal('1').getIsInteger()).toEqual(true);
	});

	it('should indicate a value of negative one is an integer', function() {
		expect(new Decimal('-1').getIsInteger()).toEqual(true);
	});

	it('should indicate a value of one and a half is not an integer', function() {
		expect(new Decimal('1.5').getIsInteger()).toEqual(false);
	});

	it('should indicate a value of slightly less than one is an not integer', function() {
		const numerator = new Decimal('999999999');
		const denominator = new Decimal('1000000000');

		expect(numerator.divide(denominator).getIsInteger()).toEqual(false);
	});

	it('should indicate a value of slightly greater than one is an not integer', function() {
		const numerator = new Decimal('1000000000');
		const denominator = new Decimal('999999999');

		expect(numerator.divide(denominator).getIsInteger()).toEqual(false);
	});
});

describe('When counting the number of decimal places', function() {
	'use strict';

	it('should indicate a value of zero has no decimal places', function() {
		expect(new Decimal('0').getDecimalPlaces()).toEqual(0);
	});

	it('should indicate a value of one has no decimal places', function() {
		expect(new Decimal('1').getDecimalPlaces()).toEqual(0);
	});

	it('should indicate a value of negative one has no decimal places', function() {
		expect(new Decimal('-1').getDecimalPlaces()).toEqual(0);
	});

	it('should indicate a value of twenty three has no decimal places', function() {
		expect(new Decimal('23').getDecimalPlaces()).toEqual(0);
	});

	it('should indicate a value of twenty three has no decimal places', function() {
		expect(new Decimal('-23').getDecimalPlaces()).toEqual(0);
	});

	it('should indicate a value of one tenth has one decimal places', function() {
		expect(new Decimal('0.1').getDecimalPlaces()).toEqual(1);
	});

	it('should indicate a value of negative one tenth has one decimal places', function() {
		expect(new Decimal('-0.1').getDecimalPlaces()).toEqual(1);
	});

	it('should indicate a value of one eighth has one decimal places', function() {
		expect(new Decimal('0.125').getDecimalPlaces()).toEqual(3);
	});

	it('should indicate a value of negative one eighth has one decimal places', function() {
		expect(new Decimal('-0.125').getDecimalPlaces()).toEqual(3);
	});

	it('should indicate a value of one hundredth has one decimal places', function() {
		expect(new Decimal('0.01').getDecimalPlaces()).toEqual(2);
	});

	it('should indicate a value of negative one hundredth has one decimal places', function() {
		expect(new Decimal('-0.01').getDecimalPlaces()).toEqual(2);
	});

	it('should indicate a value of "123.123456789012345678901234 has 24 decimal places', function() {
		expect(new Decimal('123.123456789012345678901234').getDecimalPlaces()).toEqual(24);
	});

	it('should indicate a value of "-123.123456789012345678901234 has 24 decimal places', function() {
		expect(new Decimal('-123.123456789012345678901234').getDecimalPlaces()).toEqual(24);
	});
});

describe('When checking for values that approximate zero', function() {
	'use strict';

	it('A value of "0.01" should approximate zero, when rounding to one decimal places', function() {
		expect(new Decimal('0.01').getIsZero(true, 1)).toEqual(true);
	});

	it('A value of "0.09" should not approximate zero, when rounding to one decimal places', function() {
		expect(new Decimal('0.09').getIsZero(true, 1)).toEqual(false);
	});

	it('A value of "0.01" should not approximate zero, when rounding is not specified', function() {
		expect(new Decimal('0.01').getIsZero(true)).toEqual(false);
	});

	it('A value of "0.09" should not approximate zero, when rounding is not specified', function() {
		expect(new Decimal('0.09').getIsZero(true)).toEqual(false);
	});
});

describe('When raising to a power', function() {
	'use strict';

	it('The value of 2 raised to 8 should be 256', function() {
		expect(new Decimal(2).raise(8).getIsEqual(256)).toEqual(true);
	});

	it('The value of 2 raised to -1 should be 0.5', function() {
		expect(new Decimal(2).raise(-1).getIsEqual(0.5)).toEqual(true);
	});

	it('The value of 2 raised to 0 should be 1', function() {
		expect(new Decimal(2).raise(0).getIsEqual(1)).toEqual(true);
	});
});

describe('When checking for values that approximate each other', function() {
	'use strict';

	it('A value of "0.01" should approximate a value of "0.019" (when using two significant digits)', function() {
		expect(new Decimal('0.01').getIsApproximate(new Decimal('0.019'), 2)).toEqual(true);
	});

	it('A value of "0.019" should approximate a value of "0.01" (when using two significant digits)', function() {
		expect(new Decimal('0.019').getIsApproximate(new Decimal('0.01'), 2)).toEqual(true);
	});

	it('A value of "-0.01" should approximate a value of "-0.019" (when using two significant digits)', function() {
		expect(new Decimal('-0.01').getIsApproximate(new Decimal('-0.019'), 2)).toEqual(true);
	});

	it('A value of "-0.019" should approximate a value of "-0.01" (when using two significant digits)', function() {
		expect(new Decimal('-0.019').getIsApproximate(new Decimal('-0.01'), 2)).toEqual(true);
	});

	it('A value of "0.01" should approximate a value of "0.009" (when using two significant digits)', function() {
		expect(new Decimal('0.01').getIsApproximate(new Decimal('0.009'), 2)).toEqual(true);
	});

	it('A value of "0.009" should approximate a value of "0.01" (when using two significant digits)', function() {
		expect(new Decimal('0.009').getIsApproximate(new Decimal('0.01'), 2)).toEqual(true);
	});

	it('A value of "0.01" should not approximate a value of "0.02" (when using two significant digits)', function() {
		expect(new Decimal('0.01').getIsApproximate(new Decimal('0.02'), 2)).toEqual(false);
	});

	it('A value of "0.02" should not approximate a value of "0.01" (when using two significant digits)', function() {
		expect(new Decimal('0.02').getIsApproximate(new Decimal('0.01'), 2)).toEqual(false);
	});
});

describe('When cloning a decimal', function() {
	'use strict';

	var source;
	var clone;

	beforeEach(function() {
		source = new Decimal(Math.PI);
		clone = Decimal.clone(source);
	});

	it('the cloned instance should not be the same as the source instance', function() {
		expect(clone).not.toBe(source);
	});

	it('the cloned instance should equal the source instance', function() {
		expect(source.getIsEqual(clone)).toEqual(true);
	});
});
