const Disposable = require('./../../../lang/Disposable');

describe('When a Disposable is extended', () => {
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

	let testDisposable;

	beforeEach(() => {
		testDisposable = new TestDisposable();
	});

	it('should not indicate that it has been disposed', () => {
		expect(testDisposable.getIsDisposed()).toEqual(false);
	});

	it('should not have triggered the dispose action', () => {
		expect(testDisposable.getDisposeSpy()).not.toHaveBeenCalled();
	});

	describe("and the instance is disposed", () => {
		beforeEach(() => {
			testDisposable.dispose();
		});

		it('should not indicate that it has been disposed', () => {
			expect(testDisposable.getIsDisposed()).toEqual(true);
		});

		it('should have triggered the dispose action', () => {
			expect(testDisposable.getDisposeSpy().calls.count()).toEqual(1);
		});

		describe("and the instance is disposed again", () => {
			beforeEach(() => {
				testDisposable.dispose();
			});

			it('should not indicate that it has been disposed', () => {
				expect(testDisposable.getIsDisposed()).toEqual(true);
			});

			it('should not dispose action again', () => {
				expect(testDisposable.getDisposeSpy().calls.count()).toEqual(1);
			});
		});
	});
});

describe('When a Disposable.fromAction creates a Disposable', () => {
	'use strict';

	let testDisposable;
	let testDisposableSpy;

	beforeEach(() => {
		testDisposable = Disposable.fromAction(testDisposableSpy = jasmine.createSpy('testDisposableSpy'));
	});

	it('should be an instance of Disposable', () => {
		expect(testDisposable instanceof Disposable).toEqual(true);
	});

	it('should not indicate that it has been disposed', () => {
		expect(testDisposable.getIsDisposed()).toEqual(false);
	});

	it('should not have triggered the dispose action', () => {
		expect(testDisposableSpy).not.toHaveBeenCalled();
	});

	describe("and the instance is disposed", () => {
		beforeEach(() => {
			testDisposable.dispose();
		});

		it('should not indicate that it has been disposed', () => {
			expect(testDisposable.getIsDisposed()).toEqual(true);
		});

		it('should have triggered the dispose action', () => {
			expect(testDisposableSpy.calls.count()).toEqual(1);
		});

		describe("and the instance is disposed again", () => {
			beforeEach(() => {
				testDisposable.dispose();
			});

			it('should not indicate that it has been disposed', () => {
				expect(testDisposable.getIsDisposed()).toEqual(true);
			});

			it('should not dispose action again', () => {
				expect(testDisposableSpy.calls.count()).toEqual(1);
			});
		});
	});
});