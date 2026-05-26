const Serializer = require('./../../../timing/Serializer');

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

	describe('and the tasks complete', () => {
		beforeEach((done) => {
			Promise.all(promises)
				.then(() => {
					done();
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
	let promise;
	let reject;

	beforeEach((done) => {
		serializer = new Serializer();

		reject = false;

		promise = serializer.enqueue(() => {
			throw new Error('Boom');
		}).catch((e) => {
			reject = true;

			done();
		});
	});

	it('should reject the promise', () => {
		expect(reject).toEqual(true);
	});
});

describe('When a Serializer is used to schedule a task that rejects', () => {
	let serializer;
	let promise;
	let reject;

	beforeEach((done) => {
		serializer = new Serializer();

		reject = false;

		promise = serializer.enqueue(() => {
			return Promise.reject('Boom Boom');
		}).catch((e) => {
			reject = true;

			done();
		});
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