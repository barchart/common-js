var Disposable = require('./../../../../lang/Disposable');
var DisposableStack = require('./../../../../collections/specialized/DisposableStack');

describe('When an DisposableStack is constructed', function() {
	'use strict';

	var disposeStack;

	beforeEach(function() {
		disposeStack = new DisposableStack();
	});

	it('should be disposable', function() {
		expect(disposeStack instanceof Disposable).toEqual(true);
	});

	describe('and a Disposable item is added to the stack', function() {
		var disposableOne;
		var spyOne;

		var disposeOrder;

		beforeEach(function() {
			disposeStack.push(disposableOne = Disposable.fromAction(spyOne = jasmine.createSpy('spyOne').and.callFake(function() { disposeOrder.push(disposableOne); })));
		});

		describe('and the stack is disposed', function() {
			beforeEach(function() {
				disposeOrder = [ ];

				disposeStack.dispose();
			});

			it('the item should be disposed', function() {
				expect(disposableOne.getIsDisposed()).toEqual(true);
			});

			it('the dispose logic should have been triggered', function() {
				expect(spyOne).toHaveBeenCalled();
			});
		});

		describe('and the another item is added to the stack', function() {
			var disposableTwo;
			var spyTwo;

			beforeEach(function() {
				disposeStack.push(disposableTwo = Disposable.fromAction(spyTwo = jasmine.createSpy('spyTwo').and.callFake(function() { disposeOrder.push(disposableTwo); })));
			});

			describe('and the stack is disposed', function() {
				beforeEach(function() {
					disposeOrder = [ ];

					disposeStack.dispose();
				});

				it('the first item should be disposed', function() {
					expect(disposableOne.getIsDisposed()).toEqual(true);
				});

				it('the dispose logic for the first item have been triggered', function() {
					expect(spyOne).toHaveBeenCalled();
				});

				it('the second item should be disposed', function() {
					expect(disposableTwo.getIsDisposed()).toEqual(true);
				});

				it('the dispose logic for the second item have been triggered', function() {
					expect(spyTwo).toHaveBeenCalled();
				});

				it('the second item should be disposed first (per "stack" rules)', function() {
					expect(disposeOrder[0]).toBe(disposableTwo);
				});

				it('the first item should be disposed next (per "stack" rules)', function() {
					expect(disposeOrder[1]).toBe(disposableOne);
				});
			});
		});
	});
});