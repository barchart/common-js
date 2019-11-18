const AdHoc = require('./../../../../lang/AdHoc'),
	Currency = require('./../../../../lang/Currency'),
	Day = require('./../../../../lang/Day'),
	Decimal = require('./../../../../lang/Decimal'),
	Enum = require('./../../../../lang/Enum'),
	Money = require('./../../../../lang/Money');

const DataType = require('./../../../../serialization/json/DataType'),
	Component = require('./../../../../serialization/json/Component'),
	Field = require('./../../../../serialization/json/Field'),
	Schema = require('./../../../../serialization/json/Schema');

class Letter extends Enum {
	constructor(name) {
		super(name, name);
	}
}

const LETTER_A = new Letter('A');

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
					expect(deserialized.birthday.year).toEqual(1974);
					expect(deserialized.birthday.month).toEqual(10);
					expect(deserialized.birthday.day).toEqual(20);
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
					expect(deserialized.junk.data.address).toEqual('209 W. Jackson');
					expect(deserialized.junk.data.city).toEqual('Chicago');
					expect(deserialized.junk.data.zip).toEqual('60603');
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
					expect(deserialized.balance.currency).toEqual(Currency.USD);
					expect(deserialized.balance.decimal.getIsEqual(314.15)).toEqual(true);
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
					expect(deserialized.balances.yesterday.currency).toEqual(Currency.USD);
					expect(deserialized.balances.yesterday.decimal.getIsEqual(314.15)).toEqual(true);
				});

				it('should have a "balances.today" property with the expected value', () => {
					expect(deserialized.balances.today.currency).toEqual(Currency.USD);
					expect(deserialized.balances.today.decimal.getIsEqual(271.83)).toEqual(true);
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
					expect(deserialized[0].balances.yesterday.currency).toEqual(Currency.USD);
					expect(deserialized[0].balances.yesterday.decimal.getIsEqual(314.15)).toEqual(true);
				});

				it('the first item should have a "balances.today" property with the expected value', () => {
					expect(deserialized[0].balances.today.currency).toEqual(Currency.USD);
					expect(deserialized[0].balances.today.decimal.getIsEqual(271.83)).toEqual(true);
				});

				it('the second item should have a "number" property with the expected value', () => {
					expect(deserialized[1].number).toEqual(123456789);
				});

				it('the second item should have a "balances.yesterday" property with the expected value', () => {
					expect(deserialized[1].balances.yesterday.currency).toEqual(Currency.USD);
					expect(deserialized[1].balances.yesterday.decimal.getIsEqual(141.42)).toEqual(true);
				});

				it('the second item should have a "balances.today" property with the expected value', () => {
					expect(deserialized[1].balances.today.currency).toEqual(Currency.USD);
					expect(deserialized[1].balances.today.decimal.getIsEqual(173.20)).toEqual(true);
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
			expect(conversion.day instanceof Day).toEqual(true);
			expect(conversion.day.format()).toEqual(original.day);
		});

		it('the conversion should have converted the decimal value into an Decimal instance', () => {
			expect(conversion.decimal instanceof Decimal).toEqual(true);
			expect(conversion.decimal.getIsEqual(original.decimal)).toEqual(true);
		});

		it('the conversion should have converted the miscellany value into an AdHoc instance', () => {
			expect(conversion.miscellany instanceof AdHoc).toEqual(true);
			expect(conversion.miscellany.data.stuff).toEqual(original.miscellany.stuff);
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
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should be an array with two items', () => {
					expect(deserialized.length).toEqual(2);
				});
			});
		});
	});
});