var Queue = require('./../../../collections/Queue');

describe('When a Queue is constructed', function() {
	'use strict';

	var queue;

	beforeEach(function() {
		queue = new Queue();
	});

	it('should be empty', function() {
		expect(queue.empty()).toEqual(true);
	});

	it('should throw if "peek" is called', function() {
		expect(function() {
			queue.peek();
		}).toThrow(new Error('Queue is empty'));
	});

	it('should throw if "dequeue" is called', function() {
		expect(function() {
			queue.peek();
		}).toThrow(new Error('Queue is empty'));
	});

	describe('and an object is enqueued', function() {
		var first = 1;

		beforeEach(function() {
			queue.enqueue(first);
		});

		it('should not be empty', function() {
			expect(queue.empty()).toEqual(false);
		});

		describe('and we peek at the top of the queue', function() {
			var peek;

			beforeEach(function() {
				peek = queue.peek();
			});

			it('the peek result should be the item enqueued', function() {
				expect(peek).toBe(first);
			});

			it('should not be empty', function() {
				expect(queue.empty()).toEqual(false);
			});
		});

		describe('and an object is dequeued', function() {
			var dequeue;

			beforeEach(function() {
				dequeue = queue.dequeue();
			});

			it('the dequeue result should be the item enqueued', function() {
				expect(dequeue).toBe(first);
			});

			it('should be empty', function() {
				expect(queue.empty()).toEqual(true);
			});
		});

		describe('and a second object is enqueued', function() {
			var second = {name: "second"};

			beforeEach(function() {
				queue.enqueue(second);
			});

			it('should not be empty', function() {
				expect(queue.empty()).toEqual(false);
			});

			describe('and we peek at the top of the queue', function() {
				var peek;

				beforeEach(function() {
					peek = queue.peek();
				});

				it('the peek result should be the first item enqueued', function() {
					expect(peek).toBe(first);
				});

				it('should not be empty', function() {
					expect(queue.empty()).toEqual(false);
				});
			});

			describe('and an object is dequeued', function() {
				var dequeue;

				beforeEach(function() {
					dequeue = queue.dequeue();
				});

				it('the dequeue result should be the first item enqueued', function() {
					expect(dequeue).toBe(first);
				});

				it('should not be empty', function() {
					expect(queue.empty()).toEqual(false);
				});
			});

			describe('and the queue is exported to an array', function() {
				var a;

				beforeEach(function() {
					a = queue.toArray();
				});

				it('should return an array with two items', function() {
					expect(a.length).toEqual(2);
				});

				it('the first item should be the first item enqueued', function() {
					expect(a[0]).toBe(first);
				});

				it('the second item should be the second item enqueued', function() {
					expect(a[1]).toBe(second);
				});

				it('should not be empty', function() {
					expect(queue.empty()).toEqual(false);
				});
			});

			describe('and the queue is scanned', function() {
				var spy;

				beforeEach(function() {
					spy = jasmine.createSpy();

					queue.scan(spy);
				});

				it('should call the delegate one time for each item in the queue', function() {
					expect(spy.calls.count()).toEqual(2);
				});


				it('should pass the first item to be pushed to the delegate first', function() {
					expect(spy.calls.argsFor(0)[0]).toBe(first);
				});

				it('should pass the second item to be pushed to the delegate second', function() {
					expect(spy.calls.argsFor(1)[0]).toBe(second);
				});

				it('should not be empty', function() {
					expect(queue.empty()).toEqual(false);
				});
			});
		});
	});
});