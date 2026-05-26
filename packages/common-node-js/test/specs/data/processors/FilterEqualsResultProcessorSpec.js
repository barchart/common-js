const FilterEqualsResultProcessor = require('./../../../../data/processors/FilterEqualsResultProcessor');

describe('When a FilterEqualsResultProcessor is created', () => {
	'use strict';

	let tools;

	let webstorm;
	let intellij;
	let eclipse;
	let vs;

	beforeEach(() => {
		tools = [
			webstorm = { product: 'WebStorm', vendor: 'JetBrains', language: 'JavaScript' },
			intellij = { product: 'IntelliJ', vendor: 'JetBrains', language: 'Java' },
			eclipse = { product: 'Eclipse', vendor: 'Eclipse Foundation', language: 'Java' },
			vs = { product: 'Visual Studio', vendor: 'Microsoft', language: 'C#' }
		];
	});

	describe('and filtering based on hardcoded value(s)', () => {
		describe('for items that are provided by JetBrains', () => {
			let processor;
			let result;

			beforeEach((done) => {
				processor = new FilterEqualsResultProcessor({ conditions: [ { propertyName: 'vendor', value: 'JetBrains' } ] });

				processor.process(tools).then((r) => {
					result = r;

					done();
				});
			});

			it('a new array should be returned', () => {
				expect(result).not.toBe(tools);
			});

			it('the new array should have two items', () => {
				expect(result.length).toEqual(2);
			});

			it('the first item should be WebStorm', () => {
				expect(result[0]).toBe(webstorm);
			});

			it('the second item should be IntelliJ', () => {
				expect(result[1]).toBe(intellij);
			});
		});

		describe('for items that are not provided by JetBrains', () => {
			let processor;
			let result;

			beforeEach((done) => {
				processor = new FilterEqualsResultProcessor({ conditions: [ { propertyName: 'vendor', value: 'JetBrains', inverse: true } ] });

				processor.process(tools).then((r) => {
					result = r;

					done();
				});
			});

			it('a new array should be returned', () => {
				expect(result).not.toBe(tools);
			});

			it('the new array should have two items', () => {
				expect(result.length).toEqual(2);
			});

			it('the first item should be Eclipse', () => {
				expect(result[0]).toBe(eclipse);
			});

			it('the second item should be Visual Studio', () => {
				expect(result[1]).toBe(vs);
			});
		});

		describe('for items that are provided by JetBrains and support JavaScript', () => {
			let processor;
			let result;

			beforeEach((done) => {
				processor = new FilterEqualsResultProcessor({ conditions:  [ { propertyName: 'vendor', value: 'JetBrains' }, { propertyName: 'language', value: 'JavaScript' } ] });

				processor.process(tools).then((r) => {
					result = r;

					done();
				});
			});

			it('a new array should be returned', () => {
				expect(result).not.toBe(tools);
			});

			it('the new array should have one item', () => {
				expect(result.length).toEqual(1);
			});

			it('the first item should be WebStorm', () => {
				expect(result[0]).toBe(webstorm);
			});
		});

		describe('for items that are neither JetBrains products or support Java', () => {
			let processor;
			let result;

			beforeEach((done) => {
				processor = new FilterEqualsResultProcessor({ conditions: [ { propertyName: 'vendor', value: 'JetBrains', inverse: true }, { propertyName: 'language', value: 'Java', inverse: true } ] });

				processor.process(tools).then((r) => {
					result = r;

					done();
				});
			});

			it('a new array should be returned', () => {
				expect(result).not.toBe(tools);
			});

			it('the new array should have one item', () => {
				expect(result.length).toEqual(1);
			});

			it('the first item should be Visual Studio', () => {
				expect(result[0]).toBe(vs);
			});
		});
	});

	describe('and filtering based on dynamic value(s)', () => {
		describe('for items that are provided by a dynamic reference', () => {
			let processor;
			let result;

			beforeEach((done) => {
				processor = new FilterEqualsResultProcessor({ sourceRef: 'ide', conditions: [ { propertyName: 'vendor', valueRef: 'query' } ] });

				processor.process({ ide: tools, query: 'JetBrains' }).then((r) => {
					result = r;

					done();
				});
			});

			it('a new array should be returned', () => {
				expect(result).not.toBe(tools);
			});

			it('the new array should have two items', () => {
				expect(result.length).toEqual(2);
			});

			it('the first item should be WebStorm', () => {
				expect(result[0]).toBe(webstorm);
			});

			it('the second item should be IntelliJ', () => {
				expect(result[1]).toBe(intellij);
			});
		});
	});
});
