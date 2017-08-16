var Stack = require('./../../../collections/Stack');

describe('When a Stack is constructed', function() {
	'use strict';

	var stack;

	beforeEach(function() {
		stack = new Stack();
	});

	it('should be empty', function() {
		expect(stack.empty()).toEqual(true);
	});

	it('should throw if "peek" is called', function() {
		expect(function() {
			stack.peek();
		}).toThrow(new Error('Stack is empty'));
	});

	it('should throw if "pop" is called', function() {
		expect(function() {
			stack.peek();
		}).toThrow(new Error('Stack is empty'));
	});

	describe('and an object is pushed onto the stack', function() {
		var first = 1;

		beforeEach(function() {
			stack.push(first);
		});

		it('should not be empty', function() {
			expect(stack.empty()).toEqual(false);
		});

		describe('and we peek at the top of the stack', function() {
			var peek;

			beforeEach(function() {
				peek = stack.peek();
			});

			it('the peek result should be the item pushed onto the stack', function() {
				expect(peek).toBe(first);
			});

			it('should not be empty', function() {
				expect(stack.empty()).toEqual(false);
			});
		});

		describe('and an object is popped from the stack', function() {
			var pop;

			beforeEach(function() {
				pop = stack.pop();
			});

			it('the pop result should be the item pushed onto the stack', function() {
				expect(pop).toBe(first);
			});

			it('should be empty', function() {
				expect(stack.empty()).toEqual(true);
			});
		});

		describe('and a second object is pushed onto the stack', function() {
			var second = {name: "second"};

			beforeEach(function() {
				stack.push(second);
			});

			it('should not be empty', function() {
				expect(stack.empty()).toEqual(false);
			});

			describe('and we peek at the top of the stack', function() {
				var peek;

				beforeEach(function() {
					peek = stack.peek();
				});

				it('the peek result should be the second item pushed onto the stack', function() {
					expect(peek).toBe(second);
				});

				it('should not be empty', function() {
					expect(stack.empty()).toEqual(false);
				});
			});

			describe('and an object is popped from the stack', function() {
				var pop;

				beforeEach(function() {
					pop = stack.pop();
				});

				it('the pop result should be the second item pushed onto the stack', function() {
					expect(pop).toBe(second);
				});

				it('should not be empty', function() {
					expect(stack.empty()).toEqual(false);
				});
			});

			describe('and the queue is exported to an array', function() {
				var a;

				beforeEach(function() {
					a = stack.toArray();
				});

				it('should return an array with two items', function() {
					expect(a.length).toEqual(2);
				});

				it('the first item should be the second item pushed', function() {
					expect(a[0]).toBe(second);
				});

				it('the second item should be the first item pushed', function() {
					expect(a[1]).toBe(first);
				});

				it('should not be empty', function() {
					expect(stack.empty()).toEqual(false);
				});
			});

			describe('and the stack is scanned', function() {
				var spy;

				beforeEach(function() {
					spy = jasmine.createSpy();

					stack.scan(spy);
				});

				it('should call the delegate one time for each item in the queue', function() {
					expect(spy.calls.count()).toEqual(2);
				});


				it('should pass the second item to be pushed to the delegate first', function() {
					expect(spy.calls.argsFor(0)[0]).toBe(second);
				});

				it('should pass the first item to be pushed to the delegate second', function() {
					expect(spy.calls.argsFor(1)[0]).toBe(first);
				});
			});
		});
	});
});