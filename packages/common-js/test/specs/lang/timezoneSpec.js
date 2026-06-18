import * as timezone from './../../../lang/timezone.js';

describe('When timezone utilities are used', () => {
	'use strict';

	it('should return timezone names', () => {
		const timezones = timezone.getTimezones();

		expect({
			nonEmpty: timezones.length > 0,
			belgrade: timezones.includes('Europe/Belgrade')
		}).toEqual({
			nonEmpty: true,
			belgrade: true
		});
	});

	it('should detect known timezone names', () => {
		expect({
			known: timezone.hasTimezone('Europe/Belgrade'),
			unknown: timezone.hasTimezone('Not/AZone')
		}).toEqual({
			known: true,
			unknown: false
		});
	});

	it('should validate timezone lookup arguments', () => {
		expect(() => timezone.hasTimezone()).toThrow();
	});

	it('should guess a timezone or null', () => {
		const guess = timezone.guessTimezone();

		expect(typeof guess === 'string' || guess === null).toEqual(true);
	});
});
