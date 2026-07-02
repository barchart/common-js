import Disposable from './../../../lang/Disposable.js';
import Event from './../../../messaging/Event.js';

describe('When an Event is constructed', () => {
	'use strict';

	let event;
	let context;

	beforeEach(() => {
		event = new Event(context = {});
	});

	it('should report a new event as empty', () => {
		expect(event.getIsEmpty()).toEqual(true);
	});


	describe('and an event handler is registered', () => {
		let spyOne;
		let bindingOne;

		beforeEach(() => {
			bindingOne = event.register(spyOne = jasmine.createSpy('spyOne'));
		});

		it('should return a Disposable instance', () => {
			expect(bindingOne instanceof Disposable).toEqual(true);
		});

		it('should report the event as not empty', () => {
			expect(event.getIsEmpty()).toEqual(false);
		});

		describe('and the event handler is unregistered', () => {
			beforeEach(() => {
				event.unregister(spyOne);
			});

			it('should report the event as empty', () => {
				expect(event.getIsEmpty()).toEqual(true);
			});

			describe('and the event fires', () => {
				beforeEach(() => {
					event.fire('payload');
				});

				it('should not notify the observer', () => {
					expect(spyOne).not.toHaveBeenCalled();
				});
			});
		});

		describe('and the event is cleared', () => {
			beforeEach(() => {
				event.clear();
			});

			it('should report the event as empty', () => {
				expect(event.getIsEmpty()).toEqual(true);
			});
		});

		describe('and the event fires', () => {
			let data;

			beforeEach(() => {
				event.fire(data = {});
			});

			it('should notify the observer', () => {
				expect(spyOne).toHaveBeenCalledWith(context, data);
			});

			it('should pass the event data before the sender', () => {
				event.fire('payload');

				expect(spyOne).toHaveBeenCalledWith('payload', context);
			});
		});

		describe('and another event handler is registered', () => {
			let spyTwo;
			let bindingTwo;

			beforeEach(() => {
				bindingTwo = event.register(spyTwo = jasmine.createSpy('spyTwo'));
			});

			it('should return a Disposable instance', () => {
				expect(bindingTwo instanceof Disposable).toEqual(true);
			});

			describe('and the event fires', () => {
				let data;

				beforeEach(() => {
					event.fire(data = {});
				});

				it('should notify both observers', () => {
					expect({
						spyOne: spyOne.calls.allArgs(),
						spyTwo: spyTwo.calls.allArgs()
					}).toEqual({
						spyOne: [ [ context, data ] ],
						spyTwo: [ [ context, data ] ]
					});
				});
			});

			describe('and the first observer is disposed ', () => {

				beforeEach(() => {
					bindingOne.dispose();
				});

				describe('and the event fires', () => {
					let data;

					beforeEach(() => {
						event.fire(data = {});
					});

					it('should not notify the first observer', () => {
						expect(spyOne).not.toHaveBeenCalledWith(context, data);
					});

					it('should notify the second observer', () => {
						expect(spyTwo).toHaveBeenCalledWith(context, data);
					});
				});
			});
		});
	});

	describe('and multiple observers are added which dispose themselves', () => {
		let spyOne;
		let spyTwo;

		let bindingOne;
		let bindingTwo;

		beforeEach(() => {
			bindingOne = event.register(spyOne = jasmine.createSpy('spyOne').and.callFake(() => {
				bindingOne.dispose();
			}));
			bindingTwo = event.register(spyTwo = jasmine.createSpy('spyTwo').and.callFake(() => {
				bindingTwo.dispose();
			}));
		});

		describe('and the event fires', () => {
			let data;

			beforeEach(() => {
				event.fire(data = {});
			});

			it('should notify the first observer', () => {
				expect(spyOne).toHaveBeenCalledWith(context, data);
			});

			it('should notify the second observer', () => {
				expect(spyTwo).toHaveBeenCalledWith(context, data);
			});

			describe('and the event fires again', () => {
				let data;

				beforeEach(() => {
					spyOne.calls.reset();
					spyTwo.calls.reset();

					event.fire(data = {});
				});

				it('should not notify the first observer', () => {
					expect(spyOne).not.toHaveBeenCalledWith(context, data);
				});

				it('should not notify the second observer', () => {
					expect(spyTwo).not.toHaveBeenCalledWith(context, data);
				});
			});
		});
	});

	describe('and two observers are added which dispose each other', () => {
		let spyOne;
		let spyTwo;

		let bindingOne;
		let bindingTwo;

		beforeEach(() => {
			bindingOne = event.register(spyOne = jasmine.createSpy('spyOne').and.callFake(() => {
				bindingTwo.dispose();
			}));
			bindingTwo = event.register(spyTwo = jasmine.createSpy('spyTwo').and.callFake(() => {
				bindingOne.dispose();
			}));
		});

		describe('and the event fires', () => {
			let data;

			beforeEach(() => {
				event.fire(data = {});
			});

			it('should notify the first observer', () => {
				expect(spyOne).toHaveBeenCalledWith(context, data);
			});

			it('should notify the second observer', () => {
				expect(spyTwo).toHaveBeenCalledWith(context, data);
			});

			describe('and the event fires again', () => {
				let data;

				beforeEach(() => {
					spyOne.calls.reset();
					spyTwo.calls.reset();

					event.fire(data = {});
				});

				it('should not notify the first observer', () => {
					expect(spyOne).not.toHaveBeenCalledWith(context, data);
				});

				it('should not notify the second observer', () => {
					expect(spyTwo).not.toHaveBeenCalledWith(context, data);
				});
			});
		});
	});
});
