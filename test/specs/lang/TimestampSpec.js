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