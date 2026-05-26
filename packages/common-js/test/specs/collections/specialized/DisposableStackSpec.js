const Disposable = require('./../../../../lang/Disposable'),
	DisposableStack = require('./../../../../collections/specialized/DisposableStack');

describe('When an DisposableStack is constructed', () => {
	'use strict';

	let disposeStack;

	beforeEach(() => {
		disposeStack = new DisposableStack();
	});

	it('should be disposable', () => {
		expect(disposeStack instanceof Disposable).toEqual(true);
	});

	describe('and a Disposable item is added to the stack', () => {
		let disposableOne;
		let spyOne;

		let disposeOrder;

		beforeEach(() => {
			disposeStack.push(disposableOne = Disposable.fromAction(spyOne = jasmine.createSpy('spyOne').and.callFake(() => { disposeOrder.push(disposableOne); })));
		});

		describe('and the stack is disposed', () => {
			beforeEach(() => {
				disposeOrder = [ ];

				disposeStack.dispose();
			});

			it('the item should be disposed', () => {
				expect(disposableOne.getIsDisposed()).toEqual(true);
			});

			it('the dispose logic should have been triggered', () => {
				expect(spyOne).toHaveBeenCalled();
			});

			describe('and another item is added to the stack', () => {
				it('should throw an error', () => {
					expect(() => {
						disposeStack.push(Disposable.fromAction(() => { }));
					}).toThrow();
				});
			});
		});

		describe('and the another item is added to the stack', () => {
			let disposableTwo;
			let spyTwo;

			beforeEach(() => {
				disposeStack.push(disposableTwo = Disposable.fromAction(spyTwo = jasmine.createSpy('spyTwo').and.callFake(() => { disposeOrder.push(disposableTwo); })));
			});

			describe('and the stack is disposed', () => {
				beforeEach(() => {
					disposeOrder = [ ];

					disposeStack.dispose();
				});

				it('the first item should be disposed', () => {
					expect(disposableOne.getIsDisposed()).toEqual(true);
				});

				it('the dispose logic for the first item have been triggered', () => {
					expect(spyOne).toHaveBeenCalled();
				});

				it('the second item should be disposed', () => {
					expect(disposableTwo.getIsDisposed()).toEqual(true);
				});

				it('the dispose logic for the second item have been triggered', () => {
					expect(spyTwo).toHaveBeenCalled();
				});

				it('the second item should be disposed first (per "stack" rules)', () => {
					expect(disposeOrder[0]).toBe(disposableTwo);
				});

				it('the first item should be disposed next (per "stack" rules)', () => {
					expect(disposeOrder[1]).toBe(disposableOne);
				});
			});
		});
	});

	describe('and the "pushPromise" function is used to add a DisposableItem to the stack', () => {
		let promise;
		let resolveAction;

		beforeEach(() => {
			promise = new Promise((resolveCallback) => {
				resolveAction = resolveCallback;
			});

			DisposableStack.pushPromise(disposeStack, promise);
		});

		describe('and the promise resolves', () => {
			let spyOne;
			let disposableOne;

			beforeEach((done) => {
				resolveAction(disposableOne = Disposable.fromAction(spyOne = jasmine.createSpy('spyOne')));

				promise.then(() => {
					done();
				});
			});

			describe('and the stack is disposed', () => {
				beforeEach(() => {
					disposeStack.dispose();
				});

				it('the dispose logic should have been triggered', () => {
					expect(spyOne).toHaveBeenCalled();
				});
			});
		});
	});

	describe('and the "pushPromise" function is used to add two DisposableItems to the stack', () => {
		let promise;

		let resolveActionOne;
		let resolveActionTwo;

		beforeEach(() => {
			promise = Promise.all([
				new Promise((resolveCallback) => {
					resolveActionOne = resolveCallback;
				}),
				new Promise((resolveCallback) => {
					resolveActionTwo = resolveCallback;
				})
			]);

			DisposableStack.pushPromise(disposeStack, promise);
		});

		describe('and the promise resolves', () => {
			let spyOne;
			let disposableOne;

			let spyTwo;
			let disposableTwo;

			let disposeOrder;

			beforeEach((done) => {
				disposeOrder = [ ];

				resolveActionTwo(disposableTwo = Disposable.fromAction(spyTwo = jasmine.createSpy('spyTwo').and.callFake(() => { disposeOrder.push(disposableTwo); })));

				setTimeout(
					() => {
						resolveActionOne(disposableOne = Disposable.fromAction(spyOne = jasmine.createSpy('spyOne').and.callFake(() => { disposeOrder.push(disposableOne); })));
					}, 5
				);

				promise.then(() => {
					done();
				});
			});

			describe('and the stack is disposed', () => {
				beforeEach(() => {
					disposeStack.dispose();
				});

				it('the first item should be disposed', () => {
					expect(disposableOne.getIsDisposed()).toEqual(true);
				});

				it('the dispose logic for the first item have been triggered', () => {
					expect(spyOne).toHaveBeenCalled();
				});

				it('the second item should be disposed', () => {
					expect(disposableTwo.getIsDisposed()).toEqual(true);
				});

				it('the dispose logic for the second item have been triggered', () => {
					expect(spyTwo).toHaveBeenCalled();
				});

				it('the second item should be disposed first (per "stack" rules)', () => {
					expect(disposeOrder[0]).toBe(disposableTwo);
				});

				it('the first item should be disposed next (per "stack" rules)', () => {
					expect(disposeOrder[1]).toBe(disposableOne);
				});
			});
		});
	});
});