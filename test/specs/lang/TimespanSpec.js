const Timespan = require('./../../../lang/Timespan');

describe('When a timespan is created with an elapsed time of 2 days, 3 hours, 4 minutes, 5 seconds, and 6 milliseconds', () => {
	'use strict';

	let start;
	let end;

	let ts;

	beforeEach(() =>
	{
		start = new Date();
		end = new Date(start.getTime() + (1000 * 60 * 60 * 24 * 2) + (1000 * 60 * 60 * 3) + (1000 * 60 * 4) +  (1000 * 5) + 6);

		ts = new Timespan(start.getTime(), end.getTime());
	});

	it('the days should be 2', () => {
		expect(ts.days).toEqual(2);
	});

	it('the hours should be 51', () => {
		expect(ts.hours).toEqual(51);
	});

	it('the minutes should be 3064', () => {
		expect(ts.minutes).toEqual(3064);
	});

	it('the seconds should be 183845', () => {
		expect(ts.seconds).toEqual(183845);
	});

	it('the milliseconds should be 183845006', () => {
		expect(ts.milliseconds).toEqual(183845006);
	});

	describe('When calculating the duration for days, hours, minutes and seconds', () => {
		let duration;

		beforeEach(() => {
			duration = ts.getDuration(true, true, true, true);
		});

		it('the days should be 2', () => {
			expect(duration.days).toEqual(2);
		});

		it('the hours should be 3', () => {
			expect(duration.hours).toEqual(3);
		});

		it('the minutes should be 4', () => {
			expect(duration.minutes).toEqual(4);
		});

		it('the seconds should be 5', () => {
			expect(duration.seconds).toEqual(5);
		});

		it('the milliseconds should be 6', () => {
			expect(duration.milliseconds).toEqual(6);
		});
	});

	describe('When calculating the duration hours and minutes', () => {
		let duration;

		beforeEach(() => {
			duration = ts.getDuration(false, true, true, false);
		});

		it('the days should be 0', () => {
			expect(duration.days).toEqual(0);
		});

		it('the hours should be 51', () => {
			expect(duration.hours).toEqual(51);
		});

		it('the minutes should be 4', () => {
			expect(duration.minutes).toEqual(4);
		});

		it('the seconds should be 0', () => {
			expect(duration.seconds).toEqual(0);
		});

		it('the milliseconds should be 5006', () => {
			expect(duration.milliseconds).toEqual(5006);
		});
	});

	describe('When calculating the duration minutes and seconds', () => {
		let duration;

		beforeEach(() => {
			duration = ts.getDuration(false, false, true, true);
		});

		it('the days should be 0', () => {
			expect(duration.days).toEqual(0);
		});

		it('the hours should be 0', () => {
			expect(duration.hours).toEqual(0);
		});

		it('the minutes should be 3064', () => {
			expect(duration.minutes).toEqual(3064);
		});

		it('the seconds should be 5', () => {
			expect(duration.seconds).toEqual(5);
		});

		it('the milliseconds should be 6', () => {
			expect(duration.milliseconds).toEqual(6);
		});
	});

	describe('When calculating the duration hours and seconds', () => {
		let duration;

		beforeEach(() => {
			duration = ts.getDuration(false, true, false, true);
		});

		it('the days should be 0', () => {
			expect(duration.days).toEqual(0);
		});

		it('the hours should be 51', () => {
			expect(duration.hours).toEqual(51);
		});

		it('the minutes should be 0', () => {
			expect(duration.minutes).toEqual(0);
		});

		it('the seconds should be 245', () => {
			expect(duration.seconds).toEqual(245);
		});

		it('the milliseconds should be 6', () => {
			expect(duration.milliseconds).toEqual(6);
		});
	});
});