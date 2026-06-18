import DataType from './../../../../serialization/json/DataType.js';
import Field from './../../../../serialization/json/Field.js';

describe('When a Field is constructed', () => {
	'use strict';

	let field;

	beforeEach(() => {
		field = new Field('name', DataType.STRING, true, true);
	});

	it('should expose constructor values', () => {
		expect({
			name: field.name,
			dataType: field.dataType,
			optional: field.optional,
			array: field.array
		}).toEqual({
			name: 'name',
			dataType: DataType.STRING,
			optional: true,
			array: true
		});
	});

	it('should default boolean flags to false', () => {
		const defaulted = new Field('name', DataType.STRING);

		expect({
			optional: defaulted.optional,
			array: defaulted.array
		}).toEqual({
			optional: false,
			array: false
		});
	});

	it('should validate constructor arguments', () => {
		expect([ () => new Field(null, DataType.STRING), () => new Field('name', null) ].map(throws)).toEqual([ true, true ]);
	});

	it('should have the expected string representation', () => {
		expect(field.toString()).toEqual('[Field (name=name)]');
	});
});

function throws(action) {
	try {
		action();

		return false;
	} catch {
		return true;
	}
}
