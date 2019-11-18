const Stack = require('./../../../collections/Stack');

describe('When a Stack is constructed', () => {
	'use strict';

	let stack;

	beforeEach(() => {
		stack = new Stack();
	});

	it('should be empty', () => {
		expect(stack.empty()).toEqual(true);
	});

	it('should throw if "peek" is called', () => {
		expect(() => {
			stack.peek();
		}).toThrow(new Error('Stack is empty'));
	});

	it('should throw if "pop" is called', () => {
		expect(() => {
			stack.peek();
		}).toThrow(new Error('Stack is empty'));
	});

	describe('and an object is pushed onto the stack', () => {
		let first = 1;

		beforeEach(() => {
			stack.push(first);
		});

		it('should not be empty', () => {
			expect(stack.empty()).toEqual(false);
		});

		describe('and we peek at the top of the stack', () => {
			let peek;

			beforeEach(() => {
				peek = stack.peek();
			});

			it('the peek result should be the item pushed onto the stack', () => {
				expect(peek).toBe(first);
			});

			it('should not be empty', () => {
				expect(stack.empty()).toEqual(false);
			});
		});

		describe('and an object is popped from the stack', () => {
			let pop;

			beforeEach(() => {
				pop = stack.pop();
			});

			it('the pop result should be the item pushed onto the stack', () => {
				expect(pop).toBe(first);
			});

			it('should be empty', () => {
				expect(stack.empty()).toEqual(true);
			});
		});

		describe('and a second object is pushed onto the stack', () => {
			let second = {name: "second"};

			beforeEach(() => {
				stack.push(second);
			});

			it('should not be empty', () => {
				expect(stack.empty()).toEqual(false);
			});

			describe('and we peek at the top of the stack', () => {
				let peek;

				beforeEach(() => {
					peek = stack.peek();
				});

				it('the peek result should be the second item pushed onto the stack', () => {
					expect(peek).toBe(second);
				});

				it('should not be empty', () => {
					expect(stack.empty()).toEqual(false);
				});
			});

			describe('and an object is popped from the stack', () => {
				let pop;

				beforeEach(() => {
					pop = stack.pop();
				});

				it('the pop result should be the second item pushed onto the stack', () => {
					expect(pop).toBe(second);
				});

				it('should not be empty', () => {
					expect(stack.empty()).toEqual(false);
				});
			});

			describe('and the queue is exported to an array', () => {
				let a;

				beforeEach(() => {
					a = stack.toArray();
				});

				it('should return an array with two items', () => {
					expect(a.length).toEqual(2);
				});

				it('the first item should be the second item pushed', () => {
					expect(a[0]).toBe(second);
				});

				it('the second item should be the first item pushed', () => {
					expect(a[1]).toBe(first);
				});

				it('should not be empty', () => {
					expect(stack.empty()).toEqual(false);
				});
			});

			describe('and the stack is scanned', () => {
				let spy;

				beforeEach(() => {
					spy = jasmine.createSpy();

					stack.scan(spy);
				});

				it('should call the delegate one time for each item in the queue', () => {
					expect(spy.calls.count()).toEqual(2);
				});


				it('should pass the second item to be pushed to the delegate first', () => {
					expect(spy.calls.argsFor(0)[0]).toBe(second);
				});

				it('should pass the first item to be pushed to the delegate second', () => {
					expect(spy.calls.argsFor(1)[0]).toBe(first);
				});
			});
		});
	});
});