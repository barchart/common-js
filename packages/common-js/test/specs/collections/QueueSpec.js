const Queue = require('./../../../collections/Queue');

describe('When a Queue is constructed', () => {
	'use strict';

	let queue;

	beforeEach(() => {
		queue = new Queue();
	});

	it('should be empty', () => {
		expect(queue.empty()).toEqual(true);
	});

	it('should throw if "peek" is called', () => {
		expect(() => {
			queue.peek();
		}).toThrow(new Error('Queue is empty'));
	});

	it('should throw if "dequeue" is called', () => {
		expect(() => {
			queue.peek();
		}).toThrow(new Error('Queue is empty'));
	});

	describe('and an object is enqueued', () => {
		let first = 1;

		beforeEach(() => {
			queue.enqueue(first);
		});

		it('should not be empty', () => {
			expect(queue.empty()).toEqual(false);
		});

		describe('and we peek at the top of the queue', () => {
			let peek;

			beforeEach(() => {
				peek = queue.peek();
			});

			it('the peek result should be the item enqueued', () => {
				expect(peek).toBe(first);
			});

			it('should not be empty', () => {
				expect(queue.empty()).toEqual(false);
			});
		});

		describe('and an object is dequeued', () => {
			let dequeue;

			beforeEach(() => {
				dequeue = queue.dequeue();
			});

			it('the dequeue result should be the item enqueued', () => {
				expect(dequeue).toBe(first);
			});

			it('should be empty', () => {
				expect(queue.empty()).toEqual(true);
			});
		});

		describe('and a second object is enqueued', () => {
			let second = {name: "second"};

			beforeEach(() => {
				queue.enqueue(second);
			});

			it('should not be empty', () => {
				expect(queue.empty()).toEqual(false);
			});

			describe('and we peek at the top of the queue', () => {
				let peek;

				beforeEach(() => {
					peek = queue.peek();
				});

				it('the peek result should be the first item enqueued', () => {
					expect(peek).toBe(first);
				});

				it('should not be empty', () => {
					expect(queue.empty()).toEqual(false);
				});
			});

			describe('and an object is dequeued', () => {
				let dequeue;

				beforeEach(() => {
					dequeue = queue.dequeue();
				});

				it('the dequeue result should be the first item enqueued', () => {
					expect(dequeue).toBe(first);
				});

				it('should not be empty', () => {
					expect(queue.empty()).toEqual(false);
				});
			});

			describe('and the queue is exported to an array', () => {
				let a;

				beforeEach(() => {
					a = queue.toArray();
				});

				it('should return an array with two items', () => {
					expect(a.length).toEqual(2);
				});

				it('the first item should be the first item enqueued', () => {
					expect(a[0]).toBe(first);
				});

				it('the second item should be the second item enqueued', () => {
					expect(a[1]).toBe(second);
				});

				it('should not be empty', () => {
					expect(queue.empty()).toEqual(false);
				});
			});

			describe('and the queue is scanned', () => {
				let spy;

				beforeEach(() => {
					spy = jasmine.createSpy();

					queue.scan(spy);
				});

				it('should call the delegate one time for each item in the queue', () => {
					expect(spy.calls.count()).toEqual(2);
				});


				it('should pass the first item to be pushed to the delegate first', () => {
					expect(spy.calls.argsFor(0)[0]).toBe(first);
				});

				it('should pass the second item to be pushed to the delegate second', () => {
					expect(spy.calls.argsFor(1)[0]).toBe(second);
				});

				it('should not be empty', () => {
					expect(queue.empty()).toEqual(false);
				});
			});
		});
	});
});