const FilterContainsResultProcessor = require('./../../../../data/processors/FilterContainsResultProcessor');

describe('When a filtering an array based on containment of a single value', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new FilterContainsResultProcessor({ outerArrayPropertyName: 'things', innerArrayPropertyName: 'colors', valuePropertyName: 'desiredColor' });
	});

	describe('and an array with some matching items is passed', () => {
		let result;

		let context;

		let blueTang;
		let clownfish;
		let goldfish;
		let orca;
		let damsel;

		beforeEach((done) => {
			context = {
				desiredColor: 'white',
				things: [
					blueTang = {
						name: 'Blue Tang',
						colors: [ 'blue', 'black', 'yellow' ]
					},
					clownfish = {
						name: 'Clownfish',
						colors: [ 'black', 'orange', 'white' ]
					},
					goldfish = {
						name: 'Goldfish',
						colors: [ 'gold' ]
					},
					orca = {
						name: 'Orca',
						colors: [ 'white', 'black' ]
					},
					damsel = {
						name: 'Three Striped Damsel',
						colors: [ 'black', 'white' ]
					}
				]
			};

			processor.process(context)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('an array should be returned', () => {
			expect(result instanceof Array).toEqual(true);
		});

		it('the array should have three items', () => {
			expect(result.length).toEqual(3);
		});

		it('the first item should be the clownfish', () => {
			expect(result[0]).toBe(clownfish);
		});

		it('the second item should be the orca', () => {
			expect(result[1]).toBe(orca);
		});

		it('the third item should be the damsel', () => {
			expect(result[2]).toBe(damsel);
		});
	});
});

describe('When a filtering an array based on containment of a set of possible values', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new FilterContainsResultProcessor({ outerArrayPropertyName: 'things', innerArrayPropertyName: 'colors', valuesPropertyName: 'desiredColors' });
	});

	describe('and an array with some matching items is passed', () => {
		let result;

		let context;

		let blueTang;
		let clownfish;
		let goldfish;
		let orca;
		let damsel;

		beforeEach((done) => {
			context = {
				desiredColors:  [ 'yellow', 'gold' ],
				things: [
					blueTang = {
						name: 'Blue Tang',
						colors: [ 'blue', 'black', 'yellow' ]
					},
					clownfish = {
						name: 'Clownfish',
						colors: [ 'black', 'orange', 'white' ]
					},
					goldfish = {
						name: 'Goldfish',
						colors: [ 'gold' ]
					},
					orca = {
						name: 'Orca',
						colors: [ 'white', 'black' ]
					},
					damsel = {
						name: 'Three Striped Damsel',
						colors: [ 'black', 'white' ]
					}
				]
			};

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

		it('the first item should be the blue tang', () => {
			expect(result[0]).toBe(blueTang);
		});

		it('the second item should be the goldfish', () => {
			expect(result[1]).toBe(goldfish);
		});
	});
});

describe('When a filtering an array based on matching exact values', () => {
	'use strict';

	let processor;

	beforeEach(() => {
		processor = new FilterContainsResultProcessor({ outerArrayPropertyName: 'things', innerArrayPropertyName: 'colors', valuesPropertyName: 'desiredColors', exact: true });
	});

	describe('and an array with some matching items is passed', () => {
		let result;

		let context;

		let blueTang;
		let clownfish;
		let goldfish;
		let orca;
		let damsel;

		beforeEach((done) => {
			context = {
				desiredColors:  [ 'black', 'white' ],
				things: [
					blueTang = {
						name: 'Blue Tang',
						colors: [ 'blue', 'black', 'yellow' ]
					},
					clownfish = {
						name: 'Clownfish',
						colors: [ 'black', 'orange', 'white' ]
					},
					goldfish = {
						name: 'Goldfish',
						colors: [ 'gold' ]
					},
					orca = {
						name: 'Orca',
						colors: [ 'white', 'black' ]
					},
					damsel = {
						name: 'Three Striped Damsel',
						colors: [ 'black', 'white' ]
					}
				]
			};

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

		it('the first item should be the damsel', () => {
			expect(result[0]).toBe(damsel);
		});
	});
});