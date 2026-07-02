import AdHoc from './../../../../lang/AdHoc.js';
import Day from './../../../../lang/Day.js';
import Decimal from './../../../../lang/Decimal.js';
import Enum from './../../../../lang/Enum.js';
import Timestamp from './../../../../lang/Timestamp.js';
import DataType from './../../../../serialization/json/DataType.js';

class Letter extends Enum {
	constructor(code) {
		super(code, code);
	}

	static get A() {
		return letterA;
	}
}

const letterA = new Letter('A');

describe('When DataType is constructed', () => {
	'use strict';

	describe('with custom delegates', () => {
		let dataType;

		beforeEach(() => {
			const reviver = value => `revived:${value}`;
			const validator = value => value === 'ok';
			const builder = value => `built:${value}`;

			dataType = new DataType('Custom', null, reviver, validator, builder);
		});

		it('should have the correct description', () => {
			expect(dataType.description).toEqual('Custom');
		});

		it('should have null enumeration type', () => {
			expect(dataType.enumerationType).toBeNull();
		});

		it('should use the provided reviver', () => {
			expect(dataType.reviver('x')).toEqual('revived:x');
		});

		it('should use the provided validator', () => {
			expect(dataType.validator('ok')).toEqual(true);
		});

		it('should use the provided builder', () => {
			expect(dataType.convert('x')).toEqual('built:x');
		});
	});

	describe('with enum data types', () => {
		let dataType;

		beforeEach(() => {
			dataType = DataType.forEnum(Letter, 'Letter');
		});

		it('should have the correct description', () => {
			expect(dataType.description).toEqual('Letter');
		});

		it('should have the correct enumeration type', () => {
			expect(dataType.enumerationType).toBe(Letter);
		});

		it('should revive enum values correctly', () => {
			expect(dataType.reviver('A')).toBe(Letter.A);
		});

		it('should validate enum instances', () => {
			expect(dataType.validator(Letter.A)).toEqual(true);
		});

		it('should not validate string codes', () => {
			expect(dataType.validator('A')).toEqual(false);
		});

		it('should convert string codes to enum instances', () => {
			expect(dataType.convert('A')).toBe(Letter.A);
		});
	});

	it('should validate enum data type arguments', () => {
		expect(() => DataType.forEnum(class NotEnum { }, 'Bad')).toThrow();
	});

	describe('with primitive data types', () => {
		it('should validate STRING type', () => {
			expect(DataType.STRING.validator('value')).toEqual(true);
		});

		it('should validate NUMBER type', () => {
			expect(DataType.NUMBER.validator(1)).toEqual(true);
		});

		it('should validate BOOLEAN type', () => {
			expect(DataType.BOOLEAN.validator(false)).toEqual(true);
		});

		it('should validate OBJECT type', () => {
			expect(DataType.OBJECT.validator({ })).toEqual(true);
		});

		it('should validate ARRAY type', () => {
			expect(DataType.ARRAY.validator([ ])).toEqual(true);
		});
	});

	describe('with object data types', () => {
		it('should convert DECIMAL values', () => {
			expect(DataType.DECIMAL.convert('1.23') instanceof Decimal).toEqual(true);
		});

		it('should revive DECIMAL values', () => {
			expect(DataType.DECIMAL.reviver('1.23') instanceof Decimal).toEqual(true);
		});

		it('should convert DAY values', () => {
			expect(DataType.DAY.convert('2026-06-17') instanceof Day).toEqual(true);
		});

		it('should revive DAY values', () => {
			expect(DataType.DAY.reviver('2026-06-17') instanceof Day).toEqual(true);
		});

		it('should convert TIMESTAMP values', () => {
			expect(DataType.TIMESTAMP.convert(1781654400000) instanceof Timestamp).toEqual(true);
		});

		it('should revive TIMESTAMP values', () => {
			expect(DataType.TIMESTAMP.reviver(1781654400000) instanceof Timestamp).toEqual(true);
		});

		it('should convert AD_HOC values', () => {
			expect(DataType.AD_HOC.convert({ value: 1 }) instanceof AdHoc).toEqual(true);
		});

		it('should revive AD_HOC values', () => {
			expect(DataType.AD_HOC.reviver('{"value":1}') instanceof AdHoc).toEqual(true);
		});
	});

	it('should leave unbuildable values unchanged', () => {
		const value = Symbol('value');

		expect(DataType.DECIMAL.convert(value)).toBe(value);
	});
});
