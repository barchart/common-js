const Timestamp = require('./../../../lang/Timestamp');

describe('When Timestamp is created from a timestamp (1502372574350)', () => {
	'use strict';

	let instance;

	beforeEach(() => {
		instance = new Timestamp(1502372574350);
	});

	it('should not have instantiated the underlying moment', () => {
		expect(instance._moment).toEqual(null);
	});

	it('should know the timestamp', () => {
		expect(instance.timestamp).toEqual(1502372574350);
	});

	describe('and the "moment" property is accessed', () => {
		let m;

		beforeEach(() => {
			m = instance.moment;
		});

		it('should not have instantiated the underlying moment', () => {
			expect(instance._moment).not.toEqual(null);
		});

		it('should return a moment', () => {
			expect(m.isValid()).toEqual(true);
		});

		describe('and the "moment" property is accessed (again)', () => {
			let n;

			beforeEach(() => {
				n = instance.moment;
			});

			it('should return the same moment', () => {
				expect(m).toBe(n);
			});
		});
	});

	describe('and two seconds are added', () => {
		let result;

		beforeEach(() => {
			result = instance.addSeconds(2);
		});

		it('should return a Timestanp instance', () => {
			expect(result instanceof Timestamp).toEqual(true);
		});

		it('should not be the same instance as the original timestamp', () => {
			expect(result).not.toBe(instance);
		});

		it('should reflect the correct timestamp (2000 milliseconds in the future)', () => {
			expect(result.timestamp).toEqual(1502372576350);
		});

		it('should not have changed the timestamp of the original instance', () => {
			expect(instance.timestamp).toEqual(1502372574350);
		});
	});

	describe('and ten milliseconds are added', () => {
		let result;

		beforeEach(() => {
			result = instance.add(10);
		});

		it('should return a Timestanp instance', () => {
			expect(result instanceof Timestamp).toEqual(true);
		});

		it('should not be the same instance as the original timestamp', () => {
			expect(result).not.toBe(instance);
		});

		it('should reflect the correct timestamp (10 milliseconds in the future)', () => {
			expect(result.timestamp).toEqual(1502372574360);
		});

		it('should not have changed the timestamp of the original instance', () => {
			expect(instance.timestamp).toEqual(1502372574350);
		});
	});
});

describe('When Timestamp is created for the current moment', () => {
	'use strict';

	let instance;

	beforeEach(() => {
		instance = Timestamp.now();
	});

	it('should not be close to the current time', () => {
		const milliseconds = (new Date()).getTime();

		expect(milliseconds - instance.timestamp < 500).toEqual(true);
	});
});

describe('When comparing two unequal Timestamp instances', () => {
	'use strict';

	let earlier;
	let later;

	beforeEach(() => {
		earlier = new Timestamp(123);
		later = new Timestamp(456);
	});

	it('The earlier timestamp should be considered "before" the later timestamp', () => {
		expect(earlier.getIsBefore(later)).toEqual(true);
	});

	it('The earlier timestamp should not be considered "after" the later timestamp', () => {
		expect(earlier.getIsAfter(later)).toEqual(false);
	});

	it('The earlier timestamp should not be considered "equal to" the later timestamp', () => {
		expect(earlier.getIsEqual(later)).toEqual(false);
	});

	it('The later timestamp should be considered "after" the earlier timestamp', () => {
		expect(later.getIsAfter(earlier)).toEqual(true);
	});

	it('The later timestamp should not be considered "before" the earlier timestamp', () => {
		expect(later.getIsBefore(earlier)).toEqual(false);
	});

	it('The later timestamp should not be considered "equal to" the earlier timestamp', () => {
		expect(later.getIsEqual(earlier)).toEqual(false);
	});
});

describe('When comparing two equal Timestamp instances', () => {
	let a;
	let b;

	beforeEach(() => {
		a = new Timestamp(789);
		b = new Timestamp(789);
	});

	it('Timestamp a should not be considered "before" timestamp b', () => {
		expect(a.getIsBefore(b)).toEqual(false);
	});

	it('Timestamp a should not not be considered "after" timestamp b', () => {
		expect(a.getIsAfter(b)).toEqual(false);
	});

	it('Timestamp a should be considered "equal to" timestamp b', () => {
		expect(a.getIsEqual(b)).toEqual(true);
	});

	it('Timestamp b should not be considered "after" timestamp a', () => {
		expect(b.getIsAfter(a)).toEqual(false);
	});

	it('Timestamp b should not be considered "before" timestamp a', () => {
		expect(b.getIsBefore(a)).toEqual(false);
	});

	it('Timestamp b should be considered "equal to" timestamp a', () => {
		expect(b.getIsEqual(a)).toEqual(true);
	});
});

describe('When comparing the same Timestamp instances', () => {
	let ts;

	beforeEach(() => {
		ts = new Timestamp(12345678);
	});

	it('The timestamp should be considered equal to itself', () => {
		expect(ts.getIsEqual(ts)).toEqual(true);
	});

	it('The timestamp should not be considered "after" itself', () => {
		expect(ts.getIsAfter(ts)).toEqual(false);
	});

	it('The timestamp should not be considered "before" itself', () => {
		expect(ts.getIsBefore(ts)).toEqual(false);
	});

});