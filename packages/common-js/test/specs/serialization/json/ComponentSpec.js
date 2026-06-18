import Currency from './../../../../lang/Currency.js';
import Decimal from './../../../../lang/Decimal.js';
import Money from './../../../../lang/Money.js';
import Component from './../../../../serialization/json/Component.js';
import DataType from './../../../../serialization/json/DataType.js';
import Field from './../../../../serialization/json/Field.js';

describe('When a Component is constructed', () => {
	'use strict';

	let fields;
	let reviver;
	let component;

	beforeEach(() => {
		fields = [ new Field('name', DataType.STRING) ];
		reviver = value => value;

		component = new Component('person', fields, reviver);
	});

	it('should expose constructor values', () => {
		expect({
			name: component.name,
			fields: component.fields,
			reviver: component.reviver
		}).toEqual({
			name: 'person',
			fields,
			reviver
		});
	});

	it('should create a money component', () => {
		const moneyComponent = Component.forMoney('amount');

		const money = moneyComponent.reviver({
			decimal: new Decimal('12.34'),
			currency: Currency.USD
		});

		expect({
			name: moneyComponent.name,
			fields: moneyComponent.fields.length,
			money: money instanceof Money,
			currency: money.currency
		}).toEqual({
			name: 'amount',
			fields: 2,
			money: true,
			currency: Currency.USD
		});
	});

	it('should have the expected string representation', () => {
		expect(component.toString()).toEqual('[Component (name=person)]');
	});
});
