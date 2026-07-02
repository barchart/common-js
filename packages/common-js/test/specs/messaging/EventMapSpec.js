import EventMap from './../../../messaging/EventMap.js';

describe('When an EventMap is constructed', () => {
	'use strict';

	let eventMap;

	beforeEach(() => {
		eventMap = new EventMap();
	});

	it('should not have keys', () => {
		expect(eventMap.getKeys()).toEqual([ ]);
	});

	it('should not have an unknown key', () => {
		expect(eventMap.hasKey('hi')).toEqual(false);
	});


	describe('and a handler is registered', () => {
		let eventName;
		let eventHandler;

		beforeEach(() => {
			eventMap.register(eventName = 'hi', eventHandler = jasmine.createSpy('eventHandler'));
		});

		it('should report the event as not empty', () => {
			expect(eventMap.getIsEmpty(eventName)).toBe(false);
		});

		it('should expose the event key', () => {
			expect({
				keys: eventMap.getKeys(),
				hasKey: eventMap.hasKey(eventName)
			}).toEqual({
				keys: [ eventName ],
				hasKey: true
			});
		});

		describe('and the event is cleared', () => {
			beforeEach(() => {
				eventMap.clear(eventName);
			});

			it('should report the event as empty', () => {
				expect(eventMap.getIsEmpty(eventName)).toBe(true);
			});

			it('should remove the event key', () => {
				expect(eventMap.hasKey(eventName)).toEqual(false);
			});
		});

		describe('and the event fires', () => {
			let eventData;

			beforeEach(() => {
				eventMap.fire(eventName, eventData = { });
			});

			it('should notify the handler', () => {
				expect(eventHandler).toHaveBeenCalledWith(eventData, eventMap);
			});
		});

		describe('and the an unrelated event fires', () => {
			let eventData;

			beforeEach(() => {
				eventMap.fire('blah', eventData = { });
			});

			it('should not notify the handler', () => {
				expect(eventHandler).not.toHaveBeenCalled();
			});
		});

		describe('and the handler is unregistered', () => {
			beforeEach(() => {
				eventMap.unregister(eventName, eventHandler);
			});

			it('should report the event as empty', () => {
				expect(eventMap.getIsEmpty(eventName)).toBe(true);
			});
		});

		describe('and the handler is unregistered (using the wrong event name)', () => {
			beforeEach(() => {
				eventMap.unregister('blah', eventHandler);
			});

			it('should not report the event as empty', () => {
				expect(eventMap.getIsEmpty(eventName)).toBe(false);
			});
		});

		describe('and the handler is unregistered (using the wrong handler)', () => {
			beforeEach(() => {
				eventMap.unregister(eventName, () => { });
			});

			it('should not report the event as empty', () => {
				expect(eventMap.getIsEmpty(eventName)).toBe(false);
			});
		});

		describe('and another handler is registered', () => {
			let eventHandlerTwo;

			beforeEach(() => {
				eventMap.register(eventName, eventHandlerTwo = jasmine.createSpy('eventHandlerTwo'));
			});

			it('should report the event as not empty', () => {
				expect(eventMap.getIsEmpty(eventName)).toBe(false);
			});

			describe('and the event fires', () => {
				let eventData;

				beforeEach(() => {
					eventMap.fire(eventName, eventData = { });
				});

				it('should notify the first handler', () => {
					expect(eventHandler).toHaveBeenCalledWith(eventData, eventMap);
				});

				it('should notify the second handler', () => {
					expect(eventHandlerTwo).toHaveBeenCalledWith(eventData, eventMap);
				});
			});

			describe('and the an unrelated event fires', () => {
				let eventData;

				beforeEach(() => {
					eventMap.fire('blah', eventData = { });
				});

				it('should not notify the first handler', () => {
					expect(eventHandler).not.toHaveBeenCalled();
				});

				it('should not notify the second handler', () => {
					expect(eventHandlerTwo).not.toHaveBeenCalled();
				});
			});

			describe('and the handler is unregistered', () => {
				beforeEach(() => {
					eventMap.unregister(eventName, eventHandler);
				});

				it('should report the event as empty', () => {
					expect(eventMap.getIsEmpty(eventName)).toBe(false);
				});

				describe('and the event fires', () => {
					let eventData;

					beforeEach(() => {
						eventMap.fire(eventName, eventData = { });
					});

					it('should not notify the first handler', () => {
						expect(eventHandler).not.toHaveBeenCalledWith(eventData, eventMap);
					});

					it('should notify the second handler', () => {
						expect(eventHandlerTwo).toHaveBeenCalledWith(eventData, eventMap);
					});
				});

				describe('and the second handler is unregistered', () => {
					beforeEach(() => {
						eventMap.unregister(eventName, eventHandlerTwo);
					});

					it('should report the event as empty', () => {
						expect(eventMap.getIsEmpty(eventName)).toBe(true);
					});

					describe('and the event fires', () => {
						let eventData;

						beforeEach(() => {
							eventMap.fire(eventName, eventData = { });
						});

						it('should not notify the first handler', () => {
							expect(eventHandler).not.toHaveBeenCalledWith(eventData, eventMap);
						});

						it('should not notify the second handler', () => {
							expect(eventHandlerTwo).not.toHaveBeenCalledWith(eventData, eventMap);
						});
					});
				});
			});
		});
	});
});
