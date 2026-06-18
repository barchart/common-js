import Component from './../../../../../serialization/json/Component.js';
import ComponentBuilder from './../../../../../serialization/json/builders/ComponentBuilder.js';
import DataType from './../../../../../serialization/json/DataType.js';

describe('When a ComponentBuilder is used', () => {
	'use strict';

	let builder;

	beforeEach(() => {
		builder = new ComponentBuilder('person');
	});

	it('should expose a Component instance', () => {
		expect({
			component: builder.component instanceof Component,
			name: builder.component.name
		}).toEqual({
			component: true,
			name: 'person'
		});
	});

	it('should add fields', () => {
		const returned = builder.withField('first', DataType.STRING);

		expect({
			returned,
			fields: builder.component.fields.length,
			name: builder.component.fields[0].name
		}).toEqual({
			returned: builder,
			fields: 1,
			name: 'first'
		});
	});

	it('should add a reviver', () => {
		const reviver = value => value;

		expect({
			returned: builder.withReviver(reviver),
			reviver: builder.component.reviver
		}).toEqual({
			returned: builder,
			reviver
		});
	});

	it('should validate method arguments', () => {
		expect([ () => builder.withField(null, DataType.STRING), () => builder.withField('first', null), () => builder.withReviver(null) ].map(throws)).toEqual([ true, true, true ]);
	});

	it('should have the current string representation', () => {
		expect(builder.toString()).toEqual('[ComponentBuilder (name=undefined)]');
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
