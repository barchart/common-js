const PriorityQueue = require('./../../../../collections/specialized/PriorityQueue');

describe('When a Queue is constructed, using a "ladies first" comparator', () => {
	'use strict';

	let queue;

	let comparator = function(a, b) {
		let aLady = a.lady ? -1 : 0;
		let bLady = b.lady ? -1 : 0;

		let result = aLady - bLady;

		if (result === 0) {
			result = a.name.localeCompare(b.name);
		}

		return result;
	};

	beforeEach(() => {
		queue = new PriorityQueue(comparator);
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

	describe('and an three objects are enqueued: Kim, Bryan, and Erica', () => {
		let kim, bryan, erica;

		beforeEach(() => {
			queue.enqueue(kim = { name: 'kim', lady: true });
			queue.enqueue(bryan = { name: 'bryan', lady: false });
			queue.enqueue(erica = { name: 'erica', lady: true });

		});

		it('should not be empty', () => {
			expect(queue.empty()).toEqual(false);
		});

		describe('and we peek at the top of the queue', () => {
			let peek;

			beforeEach(() => {
				peek = queue.peek();
			});

			it('the peek result should be erica', () => {
				expect(peek).toBe(erica);
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

			it('the dequeue result should be erica', () => {
				expect(dequeue).toBe(erica);
			});

			it('should not be empty', () => {
				expect(queue.empty()).toEqual(false);
			});

			describe('and an second object is dequeued', () => {
				let dequeue;

				beforeEach(() => {
					dequeue = queue.dequeue();
				});

				it('the dequeue result should be kim', () => {
					expect(dequeue).toBe(kim);
				});

				it('should not be empty', () => {
					expect(queue.empty()).toEqual(false);
				});

				describe('and a third object is dequeued', () => {
					let dequeue;

					beforeEach(() => {
						dequeue = queue.dequeue();
					});

					it('the dequeue result should be bryan', () => {
						expect(dequeue).toBe(bryan);
					});

					it('should be empty', () => {
						expect(queue.empty()).toEqual(true);
					});
				});
			});
		});

		describe('and the queue is exported to an array', () => {
			let a;

			beforeEach(() => {
				a = queue.toArray();
			});

			it('should return an array with three items', () => {
				expect(a.length).toEqual(3);
			});

			it('the first item should be erica', () => {
				expect(a[0]).toBe(erica);
			});

			it('the second item should be kim', () => {
				expect(a[1]).toBe(kim);
			});

			it('the third item should be bryan', () => {
				expect(a[2]).toBe(bryan);
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
				expect(spy.calls.count()).toEqual(3);
			});

			it('should pass erica to the delegate first', () => {
				expect(spy.calls.argsFor(0)[0]).toBe(erica);
			});

			it('should pass kim to the delegate second', () => {
				expect(spy.calls.argsFor(1)[0]).toBe(kim);
			});

			it('should pass bryan to the delegate thrid', () => {
				expect(spy.calls.argsFor(2)[0]).toBe(bryan);
			});

			it('should not be empty', () => {
				expect(queue.empty()).toEqual(false);
			});
		});
	});
});

describe('When a Queue is constructed, using a simple (ascending) numeric comparator', () => {
	'use strict';

	let queue;

	let comparator = function(a, b) {
		return a - b;
	};

	beforeEach(() => {
		queue = new PriorityQueue(comparator);
	});

	describe('and the following values are enqueued: 3, 2, and 1', () => {
		beforeEach(() => {
			queue.enqueue(3);
			queue.enqueue(2);
			queue.enqueue(1);
		});

		describe('and all items are dequeued', () => {
			let a, b, c;

			beforeEach(() => {
				a = queue.dequeue();
				b = queue.dequeue();
				c = queue.dequeue();
			});

			it('the dequeued items should be ordered property', () => {
				expect(a).toEqual(1);
				expect(b).toEqual(2);
				expect(c).toEqual(3);
			});
		});
	});

	describe('and the following values are enqueued: 1, 2, and 3', () => {
		beforeEach(() => {
			queue.enqueue(1);
			queue.enqueue(2);
			queue.enqueue(3);
		});

		describe('and all items are dequeued', () => {
			let a, b, c;

			beforeEach(() => {
				a = queue.dequeue();
				b = queue.dequeue();
				c = queue.dequeue();
			});

			it('the dequeued items should be ordered property', () => {
				expect(a).toEqual(1);
				expect(b).toEqual(2);
				expect(c).toEqual(3);
			});
		});
	});

	describe('and the following values are enqueued: 2, 3, and 1', () => {
		beforeEach(() => {
			queue.enqueue(2);
			queue.enqueue(3);
			queue.enqueue(1);
		});

		describe('and all items are dequeued', () => {
			let a, b, c;

			beforeEach(() => {
				a = queue.dequeue();
				b = queue.dequeue();
				c = queue.dequeue();
			});

			it('the dequeued items should be ordered property', () => {
				expect(a).toEqual(1);
				expect(b).toEqual(2);
				expect(c).toEqual(3);
			});
		});
	});

	describe('and the following values are enqueued: 3, 1, 2', () => {
		beforeEach(() => {
			queue.enqueue(3);
			queue.enqueue(1);
			queue.enqueue(2);
		});

		describe('and all items are dequeued', () => {
			let a, b, c;

			beforeEach(() => {
				a = queue.dequeue();
				b = queue.dequeue();
				c = queue.dequeue();
			});

			it('the dequeued items should be ordered property', () => {
				expect(a).toEqual(1);
				expect(b).toEqual(2);
				expect(c).toEqual(3);
			});
		});
	});

	describe('and the following values are enqueued: 3, 1, 2', () => {
		beforeEach(() => {
			queue.enqueue(8);
			queue.enqueue(7);
			queue.enqueue(9);
			queue.enqueue(3);
			queue.enqueue(1);
			queue.enqueue(2);
			queue.enqueue(4);
			queue.enqueue(6);
			queue.enqueue(5);
		});

		describe('and all items are dequeued', () => {
			let a, b, c, d, e, f, g, h, i;

			beforeEach(() => {
				a = queue.dequeue();
				b = queue.dequeue();
				c = queue.dequeue();
				d = queue.dequeue();
				e = queue.dequeue();
				f = queue.dequeue();
				g = queue.dequeue();
				h = queue.dequeue();
				i = queue.dequeue();
			});

			it('the dequeued items should be ordered property', () => {
				expect(a).toEqual(1);
				expect(b).toEqual(2);
				expect(c).toEqual(3);
				expect(d).toEqual(4);
				expect(e).toEqual(5);
				expect(f).toEqual(6);
				expect(g).toEqual(7);
				expect(h).toEqual(8);
				expect(i).toEqual(9);
			});
		});
	});
});