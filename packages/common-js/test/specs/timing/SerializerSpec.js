import Serializer from './../../../timing/Serializer.js';

describe('When a Serializer is used to schedule four tasks', () => {
	'use strict';

	let serializer;

	let spies;
	let promises;
	let results;

	beforeEach(() => {
		serializer = new Serializer();

		spies = [ ];
		promises = [ ];
		results = [ ];

		for (let i = 0; i < 4; i++) {
			let spy = getSpy(results, false);

			spies.push(spy);
			promises.push(serializer.enqueue(spy));
		}
	});

	it('should expose the initial counters', () => {
		expect({
			current: serializer.getCurrent(),
			total: serializer.getTotal(),
			pending: serializer.getPending(),
			running: serializer.getRunning()
		}).toEqual({
			current: 1,
			total: 4,
			pending: 3,
			running: true
		});
	});

	describe('and the tasks complete', () => {
		beforeEach(async () => {
			await Promise.all(promises);
		});

		it('should expose the completed counters', () => {
			expect({
				current: serializer.getCurrent(),
				total: serializer.getTotal(),
				pending: serializer.getPending(),
				running: serializer.getRunning()
			}).toEqual({
				current: 4,
				total: 4,
				pending: 0,
				running: false
			});
		});

		it('the first task should have been executed', () => {
			expect(spies[0]).toHaveBeenCalled();
		});

		it('the second task should have been executed', () => {
			expect(spies[1]).toHaveBeenCalled();
		});

		it('the third task should have been executed', () => {
			expect(spies[2]).toHaveBeenCalled();
		});

		it('the fourth task should have been executed', () => {
			expect(spies[3]).toHaveBeenCalled();
		});

		it('the first task should complete before the second task starts', () => {
			expect(results[0].end <= results[1].start).toEqual(true);
		});

		it('the second task should complete before the third task starts', () => {
			expect(results[1].end <= results[2].start).toEqual(true);
		});

		it('the third task should complete before the fourth task starts', () => {
			expect(results[2].end <= results[3].start).toEqual(true);
		});
	});
});

describe('When a Serializer is used to schedule a task that throws', () => {
	let serializer;
	let reject;

	beforeEach(async () => {
		serializer = new Serializer();

		reject = false;

		try {
			await serializer.enqueue(() => {
				throw new Error('Boom');
			});
		} catch (e) {
			reject = true;
		}
	});

	it('should reject the promise', () => {
		expect(reject).toEqual(true);
	});
});

describe('When a Serializer is used to schedule a task that rejects', () => {
	let serializer;
	let reject;

	beforeEach(async () => {
		serializer = new Serializer();

		reject = false;

		try {
			await serializer.enqueue(async () => {
				throw 'Boom Boom';
			});
		} catch (e) {
			reject = true;
		}
	});

	it('should reject the promise', () => {
		expect(reject).toEqual(true);
	});
});

function getSpy(results, fail) {
	return jasmine.createSpy('spy').and.callFake(() => {
		return new Promise((resolveCallback, rejectCallback) => {
			let start = new Date();

			setTimeout(() => {
				let end = new Date();

				results.push({
					start: start.getTime(),
					end: end.getTime()
				});

				if (fail) {
					rejectCallback();
				} else {
					resolveCallback();
				}
			}, 5);
		});
	});
}
