var Currency = require('./../../../../lang/Currency');
var Day = require('./../../../../lang/Day');
var Money = require('./../../../../lang/Money');

var Component = require('./../../../../serialization/json/Component');
var Field = require('./../../../../serialization/json/Field');
var DataType = require('./../../../../serialization/json/DataType');
var Schema = require('./../../../../serialization/json/Schema');

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