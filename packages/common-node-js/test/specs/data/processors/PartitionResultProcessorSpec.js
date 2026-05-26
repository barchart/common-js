const PartitionResultProcessor = require('./../../../../data/processors/PartitionResultProcessor');

describe('When a PartitionResultProcessor is created with no configuration', () => {
	'use strict';

	let processor;
	let configuration;

	beforeEach(() => {
		processor = new PartitionResultProcessor(configuration = { });
	});

	describe('and a null value is processed', () => {
		let result;

		beforeEach((done) => {
			processor.process(null)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('an array should be returned', () => {
			expect(result instanceof Array).toEqual(true);
		});

		it('the array should have zero items', () => {
			expect(result.length).toEqual(0);
		});
	});

	describe('and an undefined value is processed', () => {
		let result;

		beforeEach((done) => {
			processor.process(null)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('an array should be returned', () => {
			expect(result instanceof Array).toEqual(true);
		});

		it('the array should have zero items', () => {
			expect(result.length).toEqual(0);
		});
	});

	describe('and an array with 21 items is passed', () => {
		let input;
		let result;

		beforeEach((done) => {
			input = [ ];

			for (let i = 0; i < 21; i++) {
				input.push(i);
			}

			result = processor.process(input)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('an array should be returned', () => {
			expect(result instanceof Array).toEqual(true);
		});

		it('the array should have three items (partitions)', () => {
			expect(result.length).toEqual(3);
		});

		it('the the first partition should have ten items', () => {
			expect(result[0].length).toEqual(10);
		});

		it('the the second partition should have ten items', () => {
			expect(result[1].length).toEqual(10);
		});

		it('the the third partition should have ten items', () => {
			expect(result[2].length).toEqual(1);
		});
	});
});

describe('When a PartitionResultProcessor is created for partitions with 15 items', () => {
	'use strict';

	let processor;
	let configuration;

	beforeEach(() => {
		processor = new PartitionResultProcessor(configuration = { size: 15 });
	});

	describe('and an array with 21 items is passed', () => {
		let input;
		let result;

		beforeEach((done) => {
			input = [ ];

			for (let i = 0; i < 21; i++) {
				input.push(i);
			}

			result = processor.process(input)
				.then((r) => {
					result = r;

					done();
				});
		});

		it('an array should be returned', () => {
			expect(result instanceof Array).toEqual(true);
		});

		it('the array should have two items (partitions)', () => {
			expect(result.length).toEqual(2);
		});

		it('the the first partition should have ten items', () => {
			expect(result[0].length).toEqual(15);
		});

		it('the the second partition should have ten items', () => {
			expect(result[1].length).toEqual(6);
		});
	});
});