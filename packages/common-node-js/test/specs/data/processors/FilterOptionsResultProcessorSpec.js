const FilterOptionsResultProcessor = require('./../../../../data/processors/FilterOptionsResultProcessor');

describe('When presented with some goods', () => {
	'use strict';

	let context;

	let car;
	let phone;
	let gas;
	let electricity;

	beforeEach(() => {
		context = {
			goods: {
				durable: ['car', 'phone']
			},
			things: [
				car = {
					brand: 'Tesla',
					type: 'car'
				},
				phone = {
					name: 'Apple',
					type: 'phone'
				},
				gas = {
					brand: 'Chevron',
					type: 'gas'
				},
				electricity = {
					brand: 'Consumers',
					type: 'electricity'
				}
			]
		};
	});

	describe('and then filtering for durable goods', () => {
		let processor;
		let result;

		beforeEach((done) => {
			processor = new FilterOptionsResultProcessor({ sourceRef: 'things', conditions: [ { optionsRef: 'goods.durable', propertyName: 'type' } ] });

			processor.process(context)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('an array should be returned', () => {
			expect(result instanceof Array).toEqual(true);
		});

		it('the array should have two items', () => {
			expect(result.length).toEqual(2);
		});

		it('the first item should be the car', () => {
			expect(result[0]).toBe(car);
		});

		it('the second item should be the phone', () => {
			expect(result[1]).toBe(phone);
		});
	});

	describe('and then filtering for non-durable goods', () => {
		let processor;
		let result;

		beforeEach((done) => {
			processor = new FilterOptionsResultProcessor({ sourceRef: 'things', conditions: [ { optionsRef: 'goods.durable', propertyName: 'type', inverse: true } ] });

			processor.process(context)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('an array should be returned', () => {
			expect(result instanceof Array).toEqual(true);
		});

		it('the array should have two items', () => {
			expect(result.length).toEqual(2);
		});

		it('the first item should be the car', () => {
			expect(result[0]).toBe(gas);
		});

		it('the second item should be the phone', () => {
			expect(result[1]).toBe(electricity);
		});
	});

	describe('and then filtering for Tesla or Chevron products', () => {
		let processor;
		let result;

		beforeEach((done) => {
			processor = new FilterOptionsResultProcessor({ sourceRef: 'things', conditions: [ { options: [ 'Tesla', 'Chevron' ], propertyName: 'brand'} ] });

			processor.process(context)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('an array should be returned', () => {
			expect(result instanceof Array).toEqual(true);
		});

		it('the array should have two items', () => {
			expect(result.length).toEqual(2);
		});

		it('the first item should be the car', () => {
			expect(result[0]).toBe(car);
		});

		it('the second item should be the phone', () => {
			expect(result[1]).toBe(gas);
		});
	});

	describe('and then filtering for Tesla products that are also durable goods', () => {
		let processor;
		let result;

		beforeEach((done) => {
			processor = new FilterOptionsResultProcessor({ sourceRef: 'things', conditions: [ { options: [ 'Tesla' ], propertyName: 'brand' }, { optionsRef: 'goods.durable', propertyName: 'type' } ] });

			processor.process(context)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('an array should be returned', () => {
			expect(result instanceof Array).toEqual(true);
		});

		it('the array should have one item', () => {
			expect(result.length).toEqual(1);
		});

		it('the first item should be the car', () => {
			expect(result[0]).toBe(car);
		});
	});
});