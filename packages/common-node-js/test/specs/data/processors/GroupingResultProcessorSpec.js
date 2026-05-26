const GroupingResultProcessor = require('./../../../../data/processors/GroupingResultProcessor');

describe('When a GroupingResultProcessor is created', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new GroupingResultProcessor({ sourcePropertyName: 'cities', groupPropertyName: 'continent' });
	});

	describe('and an array of cities is grouped by continent', () => {
		let result;

		let original;

		let cities;
		let cairo;
		let rome;
		let lisbon;

		beforeEach((done) => {
			processor.process(original = {
				cities: cities = [
					cairo = { name: 'Cairo', continent: 'Africa' },
					rome = { name: 'Rome', continent: 'Europe' },
					lisbon = { name: 'Lisbon', continent: 'Europe' }
				]
			}).then((r) => {
				result = r;

				done();
			});
		});

		it('the original object should be returned', () => {
			expect(result).toBe(original);
		});

		it('the cities property should be the original array', () => {
			expect(result).not.toBe(cities);
		});

		it('the cities property should be an object', () => {
			expect(typeof result.cities).toEqual('object');
		});

		it('the cities property should have an array of European cities', () => {
			expect(Array.isArray(result.cities.Europe)).toEqual(true);
		});

		it('the European continent should have two cities', () => {
			expect(result.cities.Europe.length).toEqual(2);
		});

			it('the first African city should be Cairo', () => {
			expect(result.cities.Europe[0]).toBe(rome);
		});

		it('the second European city should be Lisbon', () => {
			expect(result.cities.Europe[1]).toBe(lisbon);
		});

		it('the cities property should have an array of African cities', () => {
			expect(Array.isArray(result.cities.Africa)).toEqual(true);
		});

		it('the African continent should have one city', () => {
			expect(result.cities.Africa.length).toEqual(1);
		});

		it('the first European city should be Rome', () => {
			expect(result.cities.Africa[0]).toBe(cairo);
		});
	});
});
