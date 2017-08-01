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