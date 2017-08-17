var PriorityQueue = require('./../../../../collections/specialized/PriorityQueue');

describe('When a Queue is constructed, using a "ladies first" comparator', function() {
	'use strict';

	var queue;

	var comparator = function(a, b) {
		var aLady = a.lady ? -1 : 0;
		var bLady = b.lady ? -1 : 0;

		var result = aLady - bLady;

		if (result === 0) {
			result = a.name.localeCompare(b.name);
		}

		return result;
	};

	beforeEach(function() {
		queue = new PriorityQueue(comparator);
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

	describe('and an three objects are enqueued: Kim, Bryan, and Erica', function() {
		var kim, bryan, erica;

		beforeEach(function() {
			queue.enqueue(kim = { name: 'kim', lady: true });
			queue.enqueue(bryan = { name: 'bryan', lady: false });
			queue.enqueue(erica = { name: 'erica', lady: true });

		});

		it('should not be empty', function() {
			expect(queue.empty()).toEqual(false);
		});

		describe('and we peek at the top of the queue', function() {
			var peek;

			beforeEach(function() {
				peek = queue.peek();
			});

			it('the peek result should be erica', function() {
				expect(peek).toBe(erica);
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

			it('the dequeue result should be erica', function() {
				expect(dequeue).toBe(erica);
			});

			it('should not be empty', function() {
				expect(queue.empty()).toEqual(false);
			});

			describe('and an second object is dequeued', function() {
				var dequeue;

				beforeEach(function() {
					dequeue = queue.dequeue();
				});

				it('the dequeue result should be kim', function() {
					expect(dequeue).toBe(kim);
				});

				it('should not be empty', function() {
					expect(queue.empty()).toEqual(false);
				});

				describe('and a third object is dequeued', function() {
					var dequeue;

					beforeEach(function() {
						dequeue = queue.dequeue();
					});

					it('the dequeue result should be bryan', function() {
						expect(dequeue).toBe(bryan);
					});

					it('should be empty', function() {
						expect(queue.empty()).toEqual(true);
					});
				});
			});
		});

		describe('and the queue is exported to an array', function() {
			var a;

			beforeEach(function() {
				a = queue.toArray();
			});

			it('should return an array with three items', function() {
				expect(a.length).toEqual(3);
			});

			it('the first item should be erica', function() {
				expect(a[0]).toBe(erica);
			});

			it('the second item should be kim', function() {
				expect(a[1]).toBe(kim);
			});

			it('the third item should be bryan', function() {
				expect(a[2]).toBe(bryan);
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
				expect(spy.calls.count()).toEqual(3);
			});

			it('should pass erica to the delegate first', function() {
				expect(spy.calls.argsFor(0)[0]).toBe(erica);
			});

			it('should pass kim to the delegate second', function() {
				expect(spy.calls.argsFor(1)[0]).toBe(kim);
			});

			it('should pass bryan to the delegate thrid', function() {
				expect(spy.calls.argsFor(2)[0]).toBe(bryan);
			});

			it('should not be empty', function() {
				expect(queue.empty()).toEqual(false);
			});
		});
	});
});