import AdHoc from './../../../../lang/AdHoc.js';
import Currency from './../../../../lang/Currency.js';
import Day from './../../../../lang/Day.js';
import Decimal from './../../../../lang/Decimal.js';
import Enum from './../../../../lang/Enum.js';
import Money from './../../../../lang/Money.js';
import DataType from './../../../../serialization/json/DataType.js';
import Component from './../../../../serialization/json/Component.js';
import Field from './../../../../serialization/json/Field.js';
import Schema from './../../../../serialization/json/Schema.js';

class Letter extends Enum {
	constructor(name) {
		super(name, name);
	}
}

const LETTER_A = new Letter('A');
const LETTER_B = new Letter('B');

describe('When a person schema is created (first and last names)', () => {
	'use strict';

	let schema;

	beforeEach(() => {
		schema = new Schema('person', [
			new Field('first', DataType.STRING),
			new Field('last', DataType.STRING)
		]);
	});

	describe('and a schema-compliant object is created', () => {
		let object;

		beforeEach(() => {
			object = {
				first: 'bryan',
				last: 'ingle'
			};
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "first" property with the expected value', () => {
					expect(deserialized.first).toEqual('bryan');
				});

				it('should have a "last" property with the expected value', () => {
					expect(deserialized.last).toEqual('ingle');
				});
			});
		});

		describe('and the object is validated', () => {
			it('the object should be valid', () => {
				expect(schema.validate(object)).toEqual(true);
			});

			it('no invalid fields should be reported by the schema', () => {
				expect(schema.getInvalidFields(object).length).toEqual(0);
			});
		});

		describe('and various invalid objects are validated', () => {
			it('a null object should be invalid', () => {
				expect(schema.validate(null)).toEqual(false);
			});

			it('a undefined object should be invalid', () => {
				expect(schema.validate()).toEqual(false);
			});

			it('an empty object should be invalid', () => {
				expect(schema.validate({ })).toEqual(false);
			});

			it('an object with only a first name should be invalid', () => {
				expect(schema.validate({ first: 'bryan' })).toEqual(false);
			});

			it('an object with only a last name should be invalid', () => {
				expect(schema.validate({ last: 'ingle' })).toEqual(false);
			});

			it('an object with with invalid first and last names should be invalid', () => {
				expect(schema.validate({ first: 1, last: { } })).toEqual(false);
			});
		});

		describe('and various objects are checked for invalid fields', () => {
			it('a null object should have two invalid fields', () => {
				expect(schema.getInvalidFields(null).length).toEqual(2);
			});

			it('a undefined object should have two invalid fields', () => {
				expect(schema.getInvalidFields().length).toEqual(2);
			});

			it('an empty object should have two invalid fields', () => {
				expect(schema.getInvalidFields({ }).length).toEqual(2);
			});

			it('an object with only a first name should have one invalid fields', () => {
				expect(schema.getInvalidFields({ first: 'bryan' }).length).toEqual(1);
			});

			it('an object with only a last name should have one invalid fields', () => {
				expect(schema.getInvalidFields({ last: 'ingle' }).length).toEqual(1);
			});

			it('an object with with invalid first and last names should have two invalid fields', () => {
				expect(schema.getInvalidFields({ first: 1, last: { } }).length).toEqual(2);
			});
		});
	});

	describe('and a schema-compliant array is created', () => {
		let object;

		beforeEach(() => {
			object = [ {
				first: 'bryan',
				last: 'ingle'
			}, {
				first: 'borja',
				last: 'yanes'
			} ];
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should be an array with two items', () => {
					expect(deserialized.length).toEqual(2);
				});

				it('the first item should have a "first" property with the expected value', () => {
					expect(deserialized[0].first).toEqual('bryan');
				});

				it('the first item should have a "last" property with the expected value', () => {
					expect(deserialized[0].last).toEqual('ingle');
				});

				it('the second item should have a "first" property with the expected value', () => {
					expect(deserialized[1].first).toEqual('borja');
				});

				it('the second item should have a "last" property with the expected value', () => {
					expect(deserialized[1].last).toEqual('yanes');
				});
			});
		});
	});
});

describe('When a person schema is created (first and last names, with optional middle name)', () => {
	'use strict';

	let schema;

	beforeEach(() => {
		schema = new Schema('person', [
			new Field('first', DataType.STRING),
			new Field('middle', DataType.STRING, true),
			new Field('last', DataType.STRING)
		]);
	});

	describe('and a schema-compliant object is created (with middle name)', () => {
		let object;

		beforeEach(() => {
			object = {
				first: 'bryan',
				middle: 'ray',
				last: 'ingle'
			};
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "first" property with the expected value', () => {
					expect(deserialized.first).toEqual('bryan');
				});

				it('should have a "middle" property with the expected value', () => {
					expect(deserialized.middle).toEqual('ray');
				});

				it('should have a "last" property with the expected value', () => {
					expect(deserialized.last).toEqual('ingle');
				});
			});
		});

		describe('and the object is validated', () => {
			it('the object should be valid', () => {
				expect(schema.validate(object)).toEqual(true);
			});

			it('no invalid fields should be reported by the schema', () => {
				expect(schema.getInvalidFields(object).length).toEqual(0);
			});
		});

		describe('and various invalid objects are validated', () => {
			it('a null object should be invalid', () => {
				expect(schema.validate(null)).toEqual(false);
			});

			it('a undefined object should be invalid', () => {
				expect(schema.validate()).toEqual(false);
			});

			it('an empty object should be invalid', () => {
				expect(schema.validate({ })).toEqual(false);
			});

			it('an object with only a first name should be invalid', () => {
				expect(schema.validate({ first: 'bryan' })).toEqual(false);
			});

			it('an object with only a last name should be invalid', () => {
				expect(schema.validate({ last: 'ingle' })).toEqual(false);
			});

			it('an object with with invalid first and last names should be invalid', () => {
				expect(schema.validate({ first: 1, last: { } })).toEqual(false);
			});

			it('an object with with invalid middle should be invalid', () => {
				expect(schema.validate({ first: 'bryan', middle: null, last: 'ingle' })).toEqual(false);
			});
		});

		describe('and various are checked for invalid fields', () => {
			it('a null object should have two invalid fields', () => {
				expect(schema.getInvalidFields(null).length).toEqual(2);
			});

			it('a undefined object should have two invalid fields', () => {
				expect(schema.getInvalidFields().length).toEqual(2);
			});

			it('an empty object should have two invalid fields', () => {
				expect(schema.getInvalidFields({ }).length).toEqual(2);
			});

			it('an object with only a first name should have one invalid fields', () => {
				expect(schema.getInvalidFields({ first: 'bryan' }).length).toEqual(1);
			});

			it('an object with only a last name should have one invalid fields', () => {
				expect(schema.getInvalidFields({ last: 'ingle' }).length).toEqual(1);
			});

			it('an object with with invalid first and last names should have two invalid fields', () => {
				expect(schema.getInvalidFields({ first: 1, last: { } }).length).toEqual(2);
			});
		});
	});

	describe('and a schema-compliant object is created (without middle name)', () => {
		let object;

		beforeEach(() => {
			object = {
				first: 'bryan',
				last: 'ingle'
			};
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "first" property with the expected value', () => {
					expect(deserialized.first).toEqual('bryan');
				});

				it('should not have a "middle" property', () => {
					expect(deserialized.hasOwnProperty('middle')).toEqual(false);
				});

				it('should have a "last" property with the expected value', () => {
					expect(deserialized.last).toEqual('ingle');
				});
			});
		});

		describe('and the object is validated', () => {
			it('the object should be valid', () => {
				expect(schema.validate(object)).toEqual(true);
			});

			it('no invalid fields should be reported by the schema', () => {
				expect(schema.getInvalidFields(object).length).toEqual(0);
			});
		});
	});
});

describe('When a person schema is created (grouped first and last names with a birthday)', () => {
	'use strict';

	let schema;

	beforeEach(() => {
		schema = new Schema('person', [
			new Field('name.first', DataType.STRING),
			new Field('name.last', DataType.STRING),
			new Field('birthday', DataType.DAY)
		]);
	});

	describe('and a schema-compliant object is created', () => {
		let object;

		beforeEach(() => {
			object = {
				name: {
					first: 'bryan',
					last: 'ingle'
				},
				birthday: new Day(1974, 10, 20)
			};
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should have a "name.first" property with the expected value', () => {
					expect(deserialized.name.first).toEqual('bryan');
				});

				it('should have a "name.last" property with the expected value', () => {
					expect(deserialized.name.last).toEqual('ingle');
				});

				it('should have a "birthday" property with the expected value', () => {
					expect({
						year: deserialized.birthday.year,
						month: deserialized.birthday.month,
						day: deserialized.birthday.day
					}).toEqual({
						year: 1974,
						month: 10,
						day: 20
					});
				});
			});
		});
	});
});

describe('When an account schema is created (using the AdHoc field)', () => {
	'use strict';

	let schema;

	beforeEach(() => {
		schema = new Schema('account', [
			new Field('number', DataType.NUMBER),
			new Field('junk', DataType.AD_HOC)
		]);
	});

	describe('and a schema-compliant object is created', () => {
		let object;

		beforeEach(() => {
			object = {
				number: 123456789,
				junk: new AdHoc({
					address: '209 W. Jackson',
					city: 'Chicago',
					zip: '60603'
				})
			};
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should have a "number" property with the expected value', () => {
					expect(deserialized.number).toEqual(123456789);
				});

				it('should have a "junk" property with the expected value', () => {
					expect({
						address: deserialized.junk.data.address,
						city: deserialized.junk.data.city,
						zip: deserialized.junk.data.zip
					}).toEqual({
						address: '209 W. Jackson',
						city: 'Chicago',
						zip: '60603'
					});
				});
			});
		});
	});
});

describe('When an account schema is created (using the Money component)', () => {
	'use strict';

	let schema;

	beforeEach(() => {
		schema = new Schema('account', [
			new Field('number', DataType.NUMBER)
		], [
			Component.forMoney('balance')
		]);
	});

	describe('and a schema-compliant object is created', () => {
		let object;

		beforeEach(() => {
			object = {
				number: 123456789,
				balance: new Money(314.15, Currency.USD)
			};
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should have a "number" property with the expected value', () => {
					expect(deserialized.number).toEqual(123456789);
				});

				it('should have a "balance" property with the expected value', () => {
					expect({
						currency: deserialized.balance.currency,
						decimal: deserialized.balance.decimal.getIsEqual(314.15)
					}).toEqual({
						currency: Currency.USD,
						decimal: true
					});
				});
			});
		});
	});
});

describe('When an account schema is created (using the Money component with nesting)', () => {
	'use strict';

	let schema;

	beforeEach(() => {
		schema = new Schema('account', [
			new Field('number', DataType.NUMBER)
		], [
			Component.forMoney('balances.yesterday'),
			Component.forMoney('balances.today')
		]);
	});

	describe('and a schema-compliant object is created', () => {
		let object;

		beforeEach(() => {
			object = {
				number: 987654321,
				balances: {
					yesterday: new Money(314.15, Currency.USD),
					today: new Money(271.83, Currency.USD)
				}
			};
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should have a "number" property with the expected value', () => {
					expect(deserialized.number).toEqual(987654321);
				});

				it('should have a "balances.yesterday" property with the expected value', () => {
					expect({
						currency: deserialized.balances.yesterday.currency,
						decimal: deserialized.balances.yesterday.decimal.getIsEqual(314.15)
					}).toEqual({
						currency: Currency.USD,
						decimal: true
					});
				});

				it('should have a "balances.today" property with the expected value', () => {
					expect({
						currency: deserialized.balances.today.currency,
						decimal: deserialized.balances.today.decimal.getIsEqual(271.83)
					}).toEqual({
						currency: Currency.USD,
						decimal: true
					});
				});
			});
		});
	});

	describe('and a schema-compliant array is created', () => {
		let object;

		beforeEach(() => {
			object = [ {
				number: 987654321,
				balances: {
					yesterday: new Money(314.15, Currency.USD),
					today: new Money(271.83, Currency.USD)
				}
			}, {
				number: 123456789,
				balances: {
					yesterday: new Money(141.42, Currency.USD),
					today: new Money(173.20, Currency.USD)
				}
			} ];
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should be an array with two items', () => {
					expect(deserialized.length).toEqual(2);
				});

				it('the first item should have a "number" property with the expected value', () => {
					expect(deserialized[0].number).toEqual(987654321);
				});

				it('the first item should have a "balances.yesterday" property with the expected value', () => {
					expect({
						currency: deserialized[0].balances.yesterday.currency,
						decimal: deserialized[0].balances.yesterday.decimal.getIsEqual(314.15)
					}).toEqual({
						currency: Currency.USD,
						decimal: true
					});
				});

				it('the first item should have a "balances.today" property with the expected value', () => {
					expect({
						currency: deserialized[0].balances.today.currency,
						decimal: deserialized[0].balances.today.decimal.getIsEqual(271.83)
					}).toEqual({
						currency: Currency.USD,
						decimal: true
					});
				});

				it('the second item should have a "number" property with the expected value', () => {
					expect(deserialized[1].number).toEqual(123456789);
				});

				it('the second item should have a "balances.yesterday" property with the expected value', () => {
					expect({
						currency: deserialized[1].balances.yesterday.currency,
						decimal: deserialized[1].balances.yesterday.decimal.getIsEqual(141.42)
					}).toEqual({
						currency: Currency.USD,
						decimal: true
					});
				});

				it('the second item should have a "balances.today" property with the expected value', () => {
					expect({
						currency: deserialized[1].balances.today.currency,
						decimal: deserialized[1].balances.today.decimal.getIsEqual(173.20)
					}).toEqual({
						currency: Currency.USD,
						decimal: true
					});
				});
			});
		});
	});
});

describe('When a schema is created (having a nested group of optional fields)', () => {
	'use strict';

	let schema;

	beforeEach(() => {
		schema = new Schema('thing', [
			new Field('required.a', DataType.NUMBER),
			new Field('optional.b', DataType.NUMBER, true),
			new Field('optional.c', DataType.NUMBER, true),
			new Field('name', DataType.STRING)
		]);
	});

	describe('and a schema-compliant object is created (using one optional field)', () => {
		let object;

		beforeEach(() => {
			object = {
				required: {
					a: 1
				},
				optional: {
					b: 2
				},
				name: 'swamp'
			};
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "required" property', () => {
					expect(deserialized.hasOwnProperty('required')).toEqual(true);
				});

				it('should have a "required.a" property, with the expected value', () => {
					expect(deserialized.required.a).toEqual(1);
				});

				it('should have an "optional" property', () => {
					expect(deserialized.hasOwnProperty('optional')).toEqual(true);
				});

				it('should have a "optional.b" property, with the expected value', () => {
					expect(deserialized.optional.b).toEqual(2);
				});

				it('should not have a "optional.c" property', () => {
					expect(deserialized.optional.hasOwnProperty('c')).toEqual(false);
				});

				it('should have a "name" property, with the expected value', () => {
					expect(deserialized.name).toEqual('swamp');
				});
			});
		});
	});

	describe('and a schema-compliant object is created (using no optional fields)', () => {
		let object;

		beforeEach(() => {
			object = {
				required: {
					a: 1
				},
				name: 'swamp'
			};
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "required" property', () => {
					expect(deserialized.hasOwnProperty('required')).toEqual(true);
				});

				it('should have a "required.a" property, with the expected value', () => {
					expect(deserialized.required.a).toEqual(1);
				});

				it('should not have an "optional" property', () => {
					expect(deserialized.hasOwnProperty('optional')).toEqual(false);
				});

				it('should have a "name" property, with the expected value', () => {
					expect(deserialized.name).toEqual('swamp');
				});
			});
		});
	});
});

describe('When a complex schema is created (using custom data types)', () => {
	'use strict';

	let schema;

	beforeEach(() => {
		schema = new Schema('complex', [
			new Field('number', DataType.NUMBER),
			new Field('string', DataType.STRING),
			new Field('letter', DataType.forEnum(Letter, 'Letter')),
			new Field('day', DataType.DAY),
			new Field('decimal', DataType.DECIMAL),
			new Field('miscellany', DataType.AD_HOC)
		]);
	});

	describe('and data is basic data is formatted', () => {
		let original;
		let conversion;

		beforeEach(() => {
			conversion = schema.format(original = {
				number: 1,
				string: 'two',
				letter: 'A',
				day: '2018-06-09',
				decimal: 12.34,
				miscellany: {
					stuff: 'is good'
				}
			});
		});

		it('the conversion to be a new object', () => {
			expect(conversion).not.toBe(original);
		});

		it('the conversion should have copied the number value', () => {
			expect(conversion.number).toEqual(original.number);
		});

		it('the conversion should have copied the string value', () => {
			expect(conversion.string).toEqual(original.string);
		});

		it('the conversion should have converted the letter value into an enumeration', () => {
			expect(conversion.letter).toBe(LETTER_A);
		});

		it('the conversion should have converted the day value into an Day instance', () => {
			expect({
				instance: conversion.day instanceof Day,
				value: conversion.day.format()
			}).toEqual({
				instance: true,
				value: original.day
			});
		});

		it('the conversion should have converted the decimal value into an Decimal instance', () => {
			expect({
				instance: conversion.decimal instanceof Decimal,
				value: conversion.decimal.getIsEqual(original.decimal)
			}).toEqual({
				instance: true,
				value: true
			});
		});

		it('the conversion should have converted the miscellany value into an AdHoc instance', () => {
			expect({
				instance: conversion.miscellany instanceof AdHoc,
				stuff: conversion.miscellany.data.stuff
			}).toEqual({
				instance: true,
				stuff: original.miscellany.stuff
			});
		});

		describe('and the converted object is serialized', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(conversion);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('the number field should be match the conversion', () => {
					expect(deserialized.number).toEqual(conversion.number);
				});

				it('the string field should be match the conversion', () => {
					expect(deserialized.string).toEqual(conversion.string);
				});

				it('the letter field should be match the conversion', () => {
					expect(deserialized.letter).toBe(conversion.letter);
				});

				it('the day field should be match the conversion', () => {
					expect(deserialized.day.format()).toEqual(conversion.day.format());
				});

				it('the decimal field should be match the conversion', () => {
					expect(deserialized.decimal.getIsEqual(conversion.decimal)).toEqual(true);
				});

				it('the miscellany field should be match the conversion', () => {
					expect(deserialized.miscellany.data.stuff).toEqual(conversion.miscellany.data.stuff);
				});
			});
		});
	});
});

describe('When a schema is created with only two days', () => {
	'use strict';

	let schema;

	beforeEach(() => {
		schema = new Schema('days', [
			new Field('first', DataType.DAY),
			new Field('last', DataType.DAY)
		]);
	});

	describe('and a schema-compliant object is created', () => {
		let object;

		beforeEach(() => {
			object = {
				first: Day.getToday(),
				last: Day.getToday()
			};
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "first" property with the expected value', () => {
					expect(deserialized.first.getIsEqual(object.first)).toEqual(true);
				});

				it('should have a "last" property with the expected value', () => {
					expect(deserialized.last.getIsEqual(object.last)).toEqual(true);
				});
			});
		});
	});

	describe('and a schema-compliant array is created', () => {
		let object;

		beforeEach(() => {
			object = [ {
				first: Day.getToday(),
				last: Day.getToday()
			}, {
				first: Day.getToday(),
				last: Day.getToday()
			} ];
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should be an array with two items', () => {
					expect(deserialized.length).toEqual(2);
				});
			});
		});
	});
});

describe('When a schema is created with an array (that contains an enumeration)', () => {
	'use strict';

	let schema;

	beforeEach(() => {
		schema = new Schema('array-letters', [
			new Field('letters', DataType.forEnum(Letter, 'Letter'), true, true)
		]);
	});

	describe('and a schema-compliant object is created (where both arrays are empty)', () => {
		let object;

		beforeEach(() => {
			object = {
				letters: [ LETTER_B, LETTER_A ]
			};
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "letters" array', () => {
					expect(Array.isArray(deserialized.letters)).toEqual(true);
				});

				it('the "letters" array should have two items', () => {
					expect(deserialized.letters.length).toEqual(2);
				});

				it('the "letters" array should have a LETTER_B item', () => {
					expect(deserialized.letters[0]).toBe(LETTER_B);
				});

				it('the "letters" array should have a LETTER_A item', () => {
					expect(deserialized.letters[1]).toBe(LETTER_A);
				});
			});
		});
	});

	describe('and a schema-compliant array is created', () => {
		let object;

		beforeEach(() => {
			object = [
				{
					letters: [ LETTER_A ]
				},
				{
					letters: [ LETTER_B ]
				},
				{
					letters: [ LETTER_A, LETTER_B ]
				}
			];
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should be an array with three items', () => {
					expect(deserialized.length).toEqual(3);
				});
			});
		});
	});
});

describe('When a schema is created with two nested arrays', () => {
	'use strict';

	let schema;

	beforeEach(() => {
		schema = new Schema('nested-arrays', [
			new Field('arr.a', DataType.forEnum(Letter, 'Letter'), true, true),
			new Field('arr.b', DataType.NUMBER, true, true)
		]);
	});

	describe('and a schema-compliant object is created (where both arrays are empty)', () => {
		let object;

		beforeEach(() => {
			object = {
				arr: {
					a: [ ],
					b: [ ]
				}
			};
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "arr" object', () => {
					expect(typeof deserialized.arr).toEqual('object');
				});

				it('should have an "arr.a" array', () => {
					expect(Array.isArray(deserialized.arr.a)).toEqual(true);
				});

				it('the "arr.a" array should be empty', () => {
					expect(deserialized.arr.a.length).toEqual(0);
				});

				it('should have an "arr.b" array', () => {
					expect(Array.isArray(deserialized.arr.b)).toEqual(true);
				});

				it('the "arr.b" array should be empty', () => {
					expect(deserialized.arr.b.length).toEqual(0);
				});
			});
		});
	});

	describe('and a schema-compliant array is created', () => {
		let object;

		beforeEach(() => {
			object = [
				{
					arr: {
						a: [],
						b: []
					}
				},
				{
					arr: {
						a: [ LETTER_A ],
						b: [ 1 ]
					}
				}
			];
		});

		describe('and the object is "stringified" as JSON', () => {
			let serialized;

			beforeEach(() => {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', () => {
				let deserialized;

				beforeEach(() => {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should be an array with two items', () => {
					expect(deserialized.length).toEqual(2);
				});
			});
		});
	});
});

describe('When Schema accessors and factories are used', () => {
	'use strict';

	let schema;

	beforeEach(() => {
		schema = new Schema('person', [ new Field('name', DataType.STRING) ], [ Component.forMoney('wallet') ]);
	});

	it('should expose components without allowing array mutation', () => {
		const components = schema.components;

		components.pop();

		expect(schema.components.length).toEqual(1);
	});

	it('should expose the correct component name', () => {
		expect(schema.components[0].name).toEqual('wallet');
	});

	it('should create reviver functions from the reviver factory', () => {
		const simpleSchema = new Schema('person', [
			new Field('name', DataType.STRING)
		]);

		const reviver = simpleSchema.getReviverFactory()();
		const deserialized = JSON.parse('{"name":"Luka"}', reviver);

		expect(deserialized.name).toEqual('Luka');
	});
});
