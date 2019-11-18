const Disposable = require('./../../../lang/Disposable'),
	Event = require('./../../../messaging/Event');

describe('When an Event is constructed', () => {
	'use strict';

	let event;
	let context;

	beforeEach(() => {
		event = new Event(context = {});
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

		describe('and the event fires', () => {
			let data;

			beforeEach(() => {
				event.fire(data = {});
			});

			it('should notify the observer', () => {
				expect(spyOne).toHaveBeenCalledWith(context, data);
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
					expect(spyOne).toHaveBeenCalledWith(context, data);
					expect(spyTwo).toHaveBeenCalledWith(context, data);
				});
			});

			describe('and the first observer is disposed ', () => {
				let data;

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

			it('should notify both observer', () => {
				expect(spyOne).toHaveBeenCalledWith(context, data);
				expect(spyTwo).toHaveBeenCalledWith(context, data);
			});

			describe('and the event fires again', () => {
				let data;

				beforeEach(() => {
					spyOne.calls.reset();
					spyTwo.calls.reset();

					event.fire(data = {});
				});

				it('should not notify either observer', () => {
					expect(spyOne).not.toHaveBeenCalledWith(context, data);
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

			it('should notify both observer', () => {
				expect(spyOne).toHaveBeenCalledWith(context, data);
				expect(spyTwo).toHaveBeenCalledWith(context, data);
			});

			describe('and the event fires again', () => {
				let data;

				beforeEach(() => {
					spyOne.calls.reset();
					spyTwo.calls.reset();

					event.fire(data = {});
				});

				it('should not notify either observer', () => {
					expect(spyOne).not.toHaveBeenCalledWith(context, data);
					expect(spyTwo).not.toHaveBeenCalledWith(context, data);
				});
			});
		});
	});
});