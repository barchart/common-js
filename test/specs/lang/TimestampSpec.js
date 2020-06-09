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