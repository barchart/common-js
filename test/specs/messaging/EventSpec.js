var Disposable = require('./../../../lang/Disposable');
var Event = require('./../../../messaging/Event');

describe('When an Event is constructed', function() {
	'use strict';

	var event;
	var context;

	beforeEach(function() {
		event = new Event(context = {});
	});

	describe('and an event handler is registered', function() {
		var spyOne;
		var bindingOne;

		beforeEach(function() {
			bindingOne = event.register(spyOne = jasmine.createSpy('spyOne'));
		});

		it('should return a Disposable instance', function() {
			expect(bindingOne instanceof Disposable).toEqual(true);
		});

		describe('and the event fires', function() {
			var data;

			beforeEach(function() {
				event.fire(data = {});
			});

			it('should notify the observer', function() {
				expect(spyOne).toHaveBeenCalledWith(context, data);
			});
		});

		describe('and another event handler is registered', function() {
			var spyTwo;
			var bindingTwo;

			beforeEach(function() {
				bindingTwo = event.register(spyTwo = jasmine.createSpy('spyTwo'));
			});

			it('should return a Disposable instance', function() {
				expect(bindingTwo instanceof Disposable).toEqual(true);
			});

			describe('and the event fires', function() {
				var data;

				beforeEach(function() {
					event.fire(data = {});
				});

				it('should notify both observers', function() {
					expect(spyOne).toHaveBeenCalledWith(context, data);
					expect(spyTwo).toHaveBeenCalledWith(context, data);
				});
			});

			describe('and the first observer is disposed ', function() {
				var data;

				beforeEach(function() {
					bindingOne.dispose();
				});

				describe('and the event fires', function() {
					var data;

					beforeEach(function() {
						event.fire(data = {});
					});

					it('should not notify the first observer', function() {
						expect(spyOne).not.toHaveBeenCalledWith(context, data);
					});

					it('should notify the second observer', function() {
						expect(spyTwo).toHaveBeenCalledWith(context, data);
					});
				});
			});
		});
	});

	describe('and multiple observers are added which dispose themselves', function() {
		var spyOne;
		var spyTwo;

		var bindingOne;
		var bindingTwo;

		beforeEach(function() {
			bindingOne = event.register(spyOne = jasmine.createSpy('spyOne').and.callFake(function() {
				bindingOne.dispose();
			}));
			bindingTwo = event.register(spyTwo = jasmine.createSpy('spyTwo').and.callFake(function() {
				bindingTwo.dispose();
			}));
		});

		describe('and the event fires', function() {
			var data;

			beforeEach(function() {
				event.fire(data = {});
			});

			it('should notify both observer', function() {
				expect(spyOne).toHaveBeenCalledWith(context, data);
				expect(spyTwo).toHaveBeenCalledWith(context, data);
			});

			describe('and the event fires again', function() {
				var data;

				beforeEach(function() {
					spyOne.calls.reset();
					spyTwo.calls.reset();

					event.fire(data = {});
				});

				it('should not notify either observer', function() {
					expect(spyOne).not.toHaveBeenCalledWith(context, data);
					expect(spyTwo).not.toHaveBeenCalledWith(context, data);
				});
			});
		});
	});

	describe('and two observers are added which dispose each other', function() {
		var spyOne;
		var spyTwo;

		var bindingOne;
		var bindingTwo;

		beforeEach(function() {
			bindingOne = event.register(spyOne = jasmine.createSpy('spyOne').and.callFake(function() {
				bindingTwo.dispose();
			}));
			bindingTwo = event.register(spyTwo = jasmine.createSpy('spyTwo').and.callFake(function() {
				bindingOne.dispose();
			}));
		});

		describe('and the event fires', function() {
			var data;

			beforeEach(function() {
				event.fire(data = {});
			});

			it('should notify both observer', function() {
				expect(spyOne).toHaveBeenCalledWith(context, data);
				expect(spyTwo).toHaveBeenCalledWith(context, data);
			});

			describe('and the event fires again', function() {
				var data;

				beforeEach(function() {
					spyOne.calls.reset();
					spyTwo.calls.reset();

					event.fire(data = {});
				});

				it('should not notify either observer', function() {
					expect(spyOne).not.toHaveBeenCalledWith(context, data);
					expect(spyTwo).not.toHaveBeenCalledWith(context, data);
				});
			});
		});
	});
});