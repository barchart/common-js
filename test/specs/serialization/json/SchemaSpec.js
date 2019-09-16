var AdHoc = require('./../../../../lang/AdHoc');
var Currency = require('./../../../../lang/Currency');
var Day = require('./../../../../lang/Day');
var Decimal = require('./../../../../lang/Decimal');
var Enum = require('./../../../../lang/Enum');
var Money = require('./../../../../lang/Money');

var Component = require('./../../../../serialization/json/Component');
var Field = require('./../../../../serialization/json/Field');
var DataType = require('./../../../../serialization/json/DataType');
var Schema = require('./../../../../serialization/json/Schema');

class Letter extends Enum {
	constructor(name) {
		super(name, name);
	}
}

var LETTER_A = new Letter('A');
var LETTER_B = new Letter('B');

describe('When a person schema is created (first and last names)', function() {
	'use strict';

	var schema;

	beforeEach(function() {
		schema = new Schema('person', [
			new Field('first', DataType.STRING),
			new Field('last', DataType.STRING)
		]);
	});

	describe('and a schema-compliant object is created', function() {
		var object;

		beforeEach(function() {
			object = {
				first: 'bryan',
				last: 'ingle'
			};
		});

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "first" property with the expected value', function() {
					expect(deserialized.first).toEqual('bryan');
				});

				it('should have a "last" property with the expected value', function() {
					expect(deserialized.last).toEqual('ingle');
				});
			});
		});

		describe('and the object is validated', function() {
			it('the object should be valid', function() {
				expect(schema.validate(object)).toEqual(true);
			});

			it('no invalid fields should be reported by the schema', function() {
				expect(schema.getInvalidFields(object).length).toEqual(0);
			});
		});

		describe('and various invalid objects are validated', function() {
			it('a null object should be invalid', function() {
				expect(schema.validate(null)).toEqual(false);
			});

			it('a undefined object should be invalid', function() {
				expect(schema.validate()).toEqual(false);
			});

			it('an empty object should be invalid', function() {
				expect(schema.validate({ })).toEqual(false);
			});

			it('an object with only a first name should be invalid', function() {
				expect(schema.validate({ first: 'bryan' })).toEqual(false);
			});

			it('an object with only a last name should be invalid', function() {
				expect(schema.validate({ last: 'ingle' })).toEqual(false);
			});

			it('an object with with invalid first and last names should be invalid', function() {
				expect(schema.validate({ first: 1, last: { } })).toEqual(false);
			});
		});

		describe('and various are checked for invalid fields', function() {
			it('a null object should have two invalid fields', function() {
				expect(schema.getInvalidFields(null).length).toEqual(2);
			});

			it('a undefined object should have two invalid fields', function() {
				expect(schema.getInvalidFields().length).toEqual(2);
			});

			it('an empty object should have two invalid fields', function() {
				expect(schema.getInvalidFields({ }).length).toEqual(2);
			});

			it('an object with only a first name should have one invalid fields', function() {
				expect(schema.getInvalidFields({ first: 'bryan' }).length).toEqual(1);
			});

			it('an object with only a last name should have one invalid fields', function() {
				expect(schema.getInvalidFields({ last: 'ingle' }).length).toEqual(1);
			});

			it('an object with with invalid first and last names should have two invalid fields', function() {
				expect(schema.getInvalidFields({ first: 1, last: { } }).length).toEqual(2);
			});
		});
	});

	describe('and a schema-compliant array is created', function() {
		var object;

		beforeEach(function() {
			object = [ {
				first: 'bryan',
				last: 'ingle'
			}, {
				first: 'borja',
				last: 'yanes'
			} ];
		});

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should be an array with two items', function() {
					expect(deserialized.length).toEqual(2);
				});

				it('the first item should have a "first" property with the expected value', function() {
					expect(deserialized[0].first).toEqual('bryan');
				});

				it('the first item should have a "last" property with the expected value', function() {
					expect(deserialized[0].last).toEqual('ingle');
				});

				it('the second item should have a "first" property with the expected value', function() {
					expect(deserialized[1].first).toEqual('borja');
				});

				it('the second item should have a "last" property with the expected value', function() {
					expect(deserialized[1].last).toEqual('yanes');
				});
			});
		});
	});
});

describe('When a person schema is created (first and last names, with optional middle name)', function() {
	'use strict';

	var schema;

	beforeEach(function() {
		schema = new Schema('person', [
			new Field('first', DataType.STRING),
			new Field('middle', DataType.STRING, true),
			new Field('last', DataType.STRING)
		]);
	});

	describe('and a schema-compliant object is created (with middle name)', function() {
		var object;

		beforeEach(function() {
			object = {
				first: 'bryan',
				middle: 'ray',
				last: 'ingle'
			};
		});

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "first" property with the expected value', function() {
					expect(deserialized.first).toEqual('bryan');
				});

				it('should have a "middle" property with the expected value', function() {
					expect(deserialized.middle).toEqual('ray');
				});

				it('should have a "last" property with the expected value', function() {
					expect(deserialized.last).toEqual('ingle');
				});
			});
		});

		describe('and the object is validated', function() {
			it('the object should be valid', function() {
				expect(schema.validate(object)).toEqual(true);
			});

			it('no invalid fields should be reported by the schema', function() {
				expect(schema.getInvalidFields(object).length).toEqual(0);
			});
		});

		describe('and various invalid objects are validated', function() {
			it('a null object should be invalid', function() {
				expect(schema.validate(null)).toEqual(false);
			});

			it('a undefined object should be invalid', function() {
				expect(schema.validate()).toEqual(false);
			});

			it('an empty object should be invalid', function() {
				expect(schema.validate({ })).toEqual(false);
			});

			it('an object with only a first name should be invalid', function() {
				expect(schema.validate({ first: 'bryan' })).toEqual(false);
			});

			it('an object with only a last name should be invalid', function() {
				expect(schema.validate({ last: 'ingle' })).toEqual(false);
			});

			it('an object with with invalid first and last names should be invalid', function() {
				expect(schema.validate({ first: 1, last: { } })).toEqual(false);
			});
		});

		describe('and various are checked for invalid fields', function() {
			it('a null object should have two invalid fields', function() {
				expect(schema.getInvalidFields(null).length).toEqual(2);
			});

			it('a undefined object should have two invalid fields', function() {
				expect(schema.getInvalidFields().length).toEqual(2);
			});

			it('an empty object should have two invalid fields', function() {
				expect(schema.getInvalidFields({ }).length).toEqual(2);
			});

			it('an object with only a first name should have one invalid fields', function() {
				expect(schema.getInvalidFields({ first: 'bryan' }).length).toEqual(1);
			});

			it('an object with only a last name should have one invalid fields', function() {
				expect(schema.getInvalidFields({ last: 'ingle' }).length).toEqual(1);
			});

			it('an object with with invalid first and last names should have two invalid fields', function() {
				expect(schema.getInvalidFields({ first: 1, last: { } }).length).toEqual(2);
			});
		});
	});

	describe('and a schema-compliant object is created (without middle name)', function() {
		var object;

		beforeEach(function() {
			object = {
				first: 'bryan',
				last: 'ingle'
			};
		});

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "first" property with the expected value', function() {
					expect(deserialized.first).toEqual('bryan');
				});

				it('should not have a "middle" property', function() {
					expect(deserialized.hasOwnProperty('middle')).toEqual(false);
				});

				it('should have a "last" property with the expected value', function() {
					expect(deserialized.last).toEqual('ingle');
				});
			});
		});

		describe('and the object is validated', function() {
			it('the object should be valid', function() {
				expect(schema.validate(object)).toEqual(true);
			});

			it('no invalid fields should be reported by the schema', function() {
				expect(schema.getInvalidFields(object).length).toEqual(0);
			});
		});
	});
});

describe('When a person schema is created (grouped first and last names with a birthday)', function() {
	'use strict';

	var schema;

	beforeEach(function() {
		schema = new Schema('person', [
			new Field('name.first', DataType.STRING),
			new Field('name.last', DataType.STRING),
			new Field('birthday', DataType.DAY)
		]);
	});

	describe('and a schema-compliant object is created', function() {
		var object;

		beforeEach(function() {
			object = {
				name: {
					first: 'bryan',
					last: 'ingle'
				},
				birthday: new Day(1974, 10, 20)
			};
		});

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should have a "name.first" property with the expected value', function() {
					expect(deserialized.name.first).toEqual('bryan');
				});

				it('should have a "name.last" property with the expected value', function() {
					expect(deserialized.name.last).toEqual('ingle');
				});

				it('should have a "birthday" property with the expected value', function() {
					expect(deserialized.birthday.year).toEqual(1974);
					expect(deserialized.birthday.month).toEqual(10);
					expect(deserialized.birthday.day).toEqual(20);
				});
			});
		});
	});
});

describe('When an account schema is created (using the AdHoc field)', function() {
	'use strict';

	var schema;

	beforeEach(function() {
		schema = new Schema('account', [
			new Field('number', DataType.NUMBER),
			new Field('junk', DataType.AD_HOC)
		]);
	});

	describe('and a schema-compliant object is created', function() {
		var object;

		beforeEach(function() {
			object = {
				number: 123456789,
				junk: new AdHoc({
					address: '209 W. Jackson',
					city: 'Chicago',
					zip: '60603'
				})
			};
		});

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should have a "number" property with the expected value', function() {
					expect(deserialized.number).toEqual(123456789);
				});

				it('should have a "junk" property with the expected value', function() {
					expect(deserialized.junk.data.address).toEqual('209 W. Jackson');
					expect(deserialized.junk.data.city).toEqual('Chicago');
					expect(deserialized.junk.data.zip).toEqual('60603');
				});
			});
		});
	});
});

describe('When an account schema is created (using the Money component)', function() {
	'use strict';

	var schema;

	beforeEach(function() {
		schema = new Schema('account', [
			new Field('number', DataType.NUMBER)
		], [
			Component.forMoney('balance')
		]);
	});

	describe('and a schema-compliant object is created', function() {
		var object;

		beforeEach(function() {
			object = {
				number: 123456789,
				balance: new Money(314.15, Currency.USD)
			};
		});

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should have a "number" property with the expected value', function() {
					expect(deserialized.number).toEqual(123456789);
				});

				it('should have a "balance" property with the expected value', function() {
					expect(deserialized.balance.currency).toEqual(Currency.USD);
					expect(deserialized.balance.decimal.getIsEqual(314.15)).toEqual(true);
				});
			});
		});
	});
});

describe('When an account schema is created (using the Money component with nesting)', function() {
	'use strict';

	var schema;

	beforeEach(function() {
		schema = new Schema('account', [
			new Field('number', DataType.NUMBER)
		], [
			Component.forMoney('balances.yesterday'),
			Component.forMoney('balances.today')
		]);
	});

	describe('and a schema-compliant object is created', function() {
		var object;

		beforeEach(function() {
			object = {
				number: 987654321,
				balances: {
					yesterday: new Money(314.15, Currency.USD),
					today: new Money(271.83, Currency.USD)
				}
			};
		});

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should have a "number" property with the expected value', function() {
					expect(deserialized.number).toEqual(987654321);
				});

				it('should have a "balances.yesterday" property with the expected value', function() {
					expect(deserialized.balances.yesterday.currency).toEqual(Currency.USD);
					expect(deserialized.balances.yesterday.decimal.getIsEqual(314.15)).toEqual(true);
				});

				it('should have a "balances.today" property with the expected value', function() {
					expect(deserialized.balances.today.currency).toEqual(Currency.USD);
					expect(deserialized.balances.today.decimal.getIsEqual(271.83)).toEqual(true);
				});
			});
		});
	});

	describe('and a schema-compliant array is created', function() {
		var object;

		beforeEach(function() {
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

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should be an array with two items', function() {
					expect(deserialized.length).toEqual(2);
				});

				it('the first item should have a "number" property with the expected value', function() {
					expect(deserialized[0].number).toEqual(987654321);
				});

				it('the first item should have a "balances.yesterday" property with the expected value', function() {
					expect(deserialized[0].balances.yesterday.currency).toEqual(Currency.USD);
					expect(deserialized[0].balances.yesterday.decimal.getIsEqual(314.15)).toEqual(true);
				});

				it('the first item should have a "balances.today" property with the expected value', function() {
					expect(deserialized[0].balances.today.currency).toEqual(Currency.USD);
					expect(deserialized[0].balances.today.decimal.getIsEqual(271.83)).toEqual(true);
				});

				it('the second item should have a "number" property with the expected value', function() {
					expect(deserialized[1].number).toEqual(123456789);
				});

				it('the second item should have a "balances.yesterday" property with the expected value', function() {
					expect(deserialized[1].balances.yesterday.currency).toEqual(Currency.USD);
					expect(deserialized[1].balances.yesterday.decimal.getIsEqual(141.42)).toEqual(true);
				});

				it('the second item should have a "balances.today" property with the expected value', function() {
					expect(deserialized[1].balances.today.currency).toEqual(Currency.USD);
					expect(deserialized[1].balances.today.decimal.getIsEqual(173.20)).toEqual(true);
				});
			});
		});
	});
});

describe('When a schema is created (having a nested group of optional fields)', function() {
	'use strict';

	var schema;

	beforeEach(function() {
		schema = new Schema('thing', [
			new Field('required.a', DataType.NUMBER),
			new Field('optional.b', DataType.NUMBER, true),
			new Field('optional.c', DataType.NUMBER, true),
			new Field('name', DataType.STRING)
		]);
	});

	describe('and a schema-compliant object is created (using one optional field)', function() {
		var object;

		beforeEach(function() {
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

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "required" property', function() {
					expect(deserialized.hasOwnProperty('required')).toEqual(true);
				});

				it('should have a "required.a" property, with the expected value', function() {
					expect(deserialized.required.a).toEqual(1);
				});

				it('should have an "optional" property', function() {
					expect(deserialized.hasOwnProperty('optional')).toEqual(true);
				});

				it('should have a "optional.b" property, with the expected value', function() {
					expect(deserialized.optional.b).toEqual(2);
				});

				it('should not have a "optional.c" property', function() {
					expect(deserialized.optional.hasOwnProperty('c')).toEqual(false);
				});

				it('should have a "name" property, with the expected value', function() {
					expect(deserialized.name).toEqual('swamp');
				});
			});
		});
	});

	describe('and a schema-compliant object is created (using no optional fields)', function() {
		var object;

		beforeEach(function() {
			object = {
				required: {
					a: 1
				},
				name: 'swamp'
			};
		});

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "required" property', function() {
					expect(deserialized.hasOwnProperty('required')).toEqual(true);
				});

				it('should have a "required.a" property, with the expected value', function() {
					expect(deserialized.required.a).toEqual(1);
				});

				it('should not have an "optional" property', function() {
					expect(deserialized.hasOwnProperty('optional')).toEqual(false);
				});

				it('should have a "name" property, with the expected value', function() {
					expect(deserialized.name).toEqual('swamp');
				});
			});
		});
	});
});

describe('When a complex schema is created (using custom data types)', function() {
	'use strict';

	var schema;

	beforeEach(function() {
		schema = new Schema('complex', [
			new Field('number', DataType.NUMBER),
			new Field('string', DataType.STRING),
			new Field('letter', DataType.forEnum(Letter, 'Letter')),
			new Field('day', DataType.DAY),
			new Field('decimal', DataType.DECIMAL),
			new Field('miscellany', DataType.AD_HOC)
		]);
	});

	describe('and data is basic data is formatted', function() {
		var original;
		var conversion;

		beforeEach(function() {
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

		it('the conversion to be a new object', function() {
			expect(conversion).not.toBe(original);
		});

		it('the conversion should have copied the number value', function() {
			expect(conversion.number).toEqual(original.number);
		});

		it('the conversion should have copied the string value', function() {
			expect(conversion.string).toEqual(original.string);
		});

		it('the conversion should have converted the letter value into an enumeration', function() {
			expect(conversion.letter).toBe(LETTER_A);
		});

		it('the conversion should have converted the day value into an Day instance', function() {
			expect(conversion.day instanceof Day).toEqual(true);
			expect(conversion.day.format()).toEqual(original.day);
		});

		it('the conversion should have converted the decimal value into an Decimal instance', function() {
			expect(conversion.decimal instanceof Decimal).toEqual(true);
			expect(conversion.decimal.getIsEqual(original.decimal)).toEqual(true);
		});

		it('the conversion should have converted the miscellany value into an AdHoc instance', function() {
			expect(conversion.miscellany instanceof AdHoc).toEqual(true);
			expect(conversion.miscellany.data.stuff).toEqual(original.miscellany.stuff);
		});

		describe('and the converted object is serialized', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(conversion);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('the number field should be match the conversion', function() {
					expect(deserialized.number).toEqual(conversion.number);
				});

				it('the string field should be match the conversion', function() {
					expect(deserialized.string).toEqual(conversion.string);
				});

				it('the letter field should be match the conversion', function() {
					expect(deserialized.letter).toBe(conversion.letter);
				});

				it('the day field should be match the conversion', function() {
					expect(deserialized.day.format()).toEqual(conversion.day.format());
				});

				it('the decimal field should be match the conversion', function() {
					expect(deserialized.decimal.getIsEqual(conversion.decimal)).toEqual(true);
				});

				it('the miscellany field should be match the conversion', function() {
					expect(deserialized.miscellany.data.stuff).toEqual(conversion.miscellany.data.stuff);
				});
			});
		});
	});
});

describe('When a schema is created with only two days', function() {
	'use strict';

	var schema;

	beforeEach(function() {
		schema = new Schema('days', [
			new Field('first', DataType.DAY),
			new Field('last', DataType.DAY)
		]);
	});

	describe('and a schema-compliant object is created', function() {
		var object;

		beforeEach(function() {
			object = {
				first: Day.getToday(),
				last: Day.getToday()
			};
		});

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					deserialized = JSON.parse(serialized, schema.getReviver());
				});

				it('should have a "first" property with the expected value', function() {
					expect(deserialized.first.getIsEqual(object.first)).toEqual(true);
				});

				it('should have a "last" property with the expected value', function() {
					expect(deserialized.last.getIsEqual(object.last)).toEqual(true);
				});
			});
		});
	});

	describe('and a schema-compliant array is created', function() {
		var object;

		beforeEach(function() {
			object = [ {
				first: Day.getToday(),
				last: Day.getToday()
			}, {
				first: Day.getToday(),
				last: Day.getToday()
			} ];
		});

		describe('and the object is "stringified" as JSON', function() {
			var serialized;

			beforeEach(function() {
				serialized = JSON.stringify(object);
			});

			describe('and the object is rehydrated using the schema reviver', function() {
				var deserialized;

				beforeEach(function() {
					try {
						deserialized = JSON.parse(serialized, schema.getReviver());
					} catch (e) {
						console.log(e);
					}
				});

				it('should be an array with two items', function() {
					expect(deserialized.length).toEqual(2);
				});
			});
		});
	});
});