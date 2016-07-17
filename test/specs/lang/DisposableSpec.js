var Disposable = require('./../../../lang/Disposable');

describe('When a Disposable is extended', function() {
	'use strict';

	class TestDisposable extends Disposable {
		constructor() {
			super();

			this._disposeSpy = jasmine.createSpy('disposeAction');
		}

		getDisposeSpy() {
			return this._disposeSpy;
		}

		_onDispose() {
			this._disposeSpy();
		}
	}

	var testDisposable;

	beforeEach(function() {
		testDisposable = new TestDisposable();
	});

	it('should not indicate that it has been disposed', function() {
		expect(testDisposable.getIsDisposed()).toEqual(false);
	});

	it('should not have triggered the dispose action', function() {
		expect(testDisposable.getDisposeSpy()).not.toHaveBeenCalled();
	});

	describe("and the instance is disposed", function() {
		beforeEach(function() {
			testDisposable.dispose();
		});

		it('should not indicate that it has been disposed', function() {
			expect(testDisposable.getIsDisposed()).toEqual(true);
		});

		it('should have triggered the dispose action', function() {
			expect(testDisposable.getDisposeSpy().calls.count()).toEqual(1);
		});

		describe("and the instance is disposed again", function() {
			beforeEach(function() {
				testDisposable.dispose();
			});

			it('should not indicate that it has been disposed', function() {
				expect(testDisposable.getIsDisposed()).toEqual(true);
			});

			it('should not dispose action again', function() {
				expect(testDisposable.getDisposeSpy().calls.count()).toEqual(1);
			});
		});
	});
});

describe('When a Disposable.fromAction creates a Disposable', function() {
	'use strict';

	var testDisposable;
	var testDisposableSpy;

	beforeEach(function() {
		testDisposable = Disposable.fromAction(testDisposableSpy = jasmine.createSpy('testDisposableSpy'));
	});

	it('should be an instance of Disposable', function() {
		expect(testDisposable instanceof Disposable).toEqual(true);
	});

	it('should not indicate that it has been disposed', function() {
		expect(testDisposable.getIsDisposed()).toEqual(false);
	});

	it('should not have triggered the dispose action', function() {
		expect(testDisposableSpy).not.toHaveBeenCalled();
	});

	describe("and the instance is disposed", function() {
		beforeEach(function() {
			testDisposable.dispose();
		});

		it('should not indicate that it has been disposed', function() {
			expect(testDisposable.getIsDisposed()).toEqual(true);
		});

		it('should have triggered the dispose action', function() {
			expect(testDisposableSpy.calls.count()).toEqual(1);
		});

		describe("and the instance is disposed again", function() {
			beforeEach(function() {
				testDisposable.dispose();
			});

			it('should not indicate that it has been disposed', function() {
				expect(testDisposable.getIsDisposed()).toEqual(true);
			});

			it('should not dispose action again', function() {
				expect(testDisposableSpy.calls.count()).toEqual(1);
			});
		});
	});
});