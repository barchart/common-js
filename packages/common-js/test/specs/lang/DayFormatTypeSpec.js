import DayFormatType from './../../../lang/DayFormatType.js';

describe('When DayFormatType values are used', () => {
	'use strict';

	describe('for YYYY_MM_DD format', () => {
		let match;

		beforeEach(() => {
			match = DayFormatType.YYYY_MM_DD.regex.exec('2026-06-17');
		});

		it('should parse year correctly', () => {
			expect(match[DayFormatType.YYYY_MM_DD.yearIndex]).toEqual('2026');
		});

		it('should parse month correctly', () => {
			expect(match[DayFormatType.YYYY_MM_DD.monthIndex]).toEqual('06');
		});

		it('should parse day correctly', () => {
			expect(match[DayFormatType.YYYY_MM_DD.dayIndex]).toEqual('17');
		});

		it('should have zero year shift', () => {
			expect(DayFormatType.YYYY_MM_DD.yearShift).toEqual(0);
		});
	});

	describe('for MM_DD_YYYY format', () => {
		let match;

		beforeEach(() => {
			match = DayFormatType.MM_DD_YYYY.regex.exec('06/17/2026');
		});

		it('should parse year correctly', () => {
			expect(match[DayFormatType.MM_DD_YYYY.yearIndex]).toEqual('2026');
		});

		it('should parse month correctly', () => {
			expect(match[DayFormatType.MM_DD_YYYY.monthIndex]).toEqual('06');
		});

		it('should parse day correctly', () => {
			expect(match[DayFormatType.MM_DD_YYYY.dayIndex]).toEqual('17');
		});

		it('should have zero year shift', () => {
			expect(DayFormatType.MM_DD_YYYY.yearShift).toEqual(0);
		});
	});

	describe('for MM_DD_YY format', () => {
		let match;

		beforeEach(() => {
			match = DayFormatType.MM_DD_YY.regex.exec('06/17/26');
		});

		it('should parse year correctly', () => {
			expect(match[DayFormatType.MM_DD_YY.yearIndex]).toEqual('26');
		});

		it('should parse month correctly', () => {
			expect(match[DayFormatType.MM_DD_YY.monthIndex]).toEqual('06');
		});

		it('should parse day correctly', () => {
			expect(match[DayFormatType.MM_DD_YY.dayIndex]).toEqual('17');
		});

		it('should have century-based year shift', () => {
			expect(DayFormatType.MM_DD_YY.yearShift).toEqual(Math.floor(new Date().getFullYear() / 100) * 100);
		});
	});

	it('should have the expected string representation', () => {
		expect(DayFormatType.YYYY_MM_DD.toString()).toEqual('[DayFormatType (description=YYYY_MM_DD)]');
	});
});
