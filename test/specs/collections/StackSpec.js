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

			it('the peek result the item pushed onto the stack', function() {
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

			it('the pop result the item pushed onto the stack', function() {
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

				it('the peek result the second item pushed onto the stack', function() {
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

				it('the pop result the second item pushed onto the stack', function() {
					expect(pop).toBe(second);
				});

				it('should not be empty', function() {
					expect(stack.empty()).toEqual(false);
				});
			});
		});
	});
});