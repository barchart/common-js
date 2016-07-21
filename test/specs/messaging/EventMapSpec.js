var EventMap = require('./../../../messaging/EventMap');

describe('When an EventMap is constructed', function() {
	'use strict';

	var eventMap;

	beforeEach(function() {
		eventMap = new EventMap();
	});

	describe('and a handler is registered', function() {
		var eventName;
		var eventHandler;

		beforeEach(function() {
			eventMap.register(eventName = 'hi', eventHandler = jasmine.createSpy('eventHandler'));
		});

		it('should report the event as not empty', function() {
			expect(eventMap.getIsEmpty(eventName)).toBe(false);
		});

		describe('and the event fires', function() {
			var eventData;

			beforeEach(function() {
				eventMap.fire(eventName, eventData = { });
			});

			it('should notify the handler', function() {
				expect(eventHandler).toHaveBeenCalledWith(eventData, eventMap);
			});
		});

		describe('and the an unrelated event fires', function() {
			var eventData;

			beforeEach(function() {
				eventMap.fire('blah', eventData = { });
			});

			it('should not notify the handler', function() {
				expect(eventHandler).not.toHaveBeenCalled();
			});
		});

		describe('and the handler is unregistered', function() {
			beforeEach(function() {
				eventMap.unregister(eventName, eventHandler);
			});

			it('should report the event as empty', function() {
				expect(eventMap.getIsEmpty(eventName)).toBe(true);
			});
		});

		describe('and the handler is unregistered (using the wrong event name)', function() {
			beforeEach(function() {
				eventMap.unregister('blah', eventHandler);
			});

			it('should not report the event as empty', function() {
				expect(eventMap.getIsEmpty(eventName)).toBe(false);
			});
		});

		describe('and the handler is unregistered (using the wrong handler)', function() {
			beforeEach(function() {
				eventMap.unregister(eventName, function() { });
			});

			it('should not report the event as empty', function() {
				expect(eventMap.getIsEmpty(eventName)).toBe(false);
			});
		});

		describe('and another handler is registered', function() {
			var eventHandlerTwo;

			beforeEach(function() {
				eventMap.register(eventName, eventHandlerTwo = jasmine.createSpy('eventHandlerTwo'));
			});

			it('should report the event as not empty', function() {
				expect(eventMap.getIsEmpty(eventName)).toBe(false);
			});

			describe('and the event fires', function() {
				var eventData;

				beforeEach(function() {
					eventMap.fire(eventName, eventData = { });
				});

				it('should notify the first handler', function() {
					expect(eventHandler).toHaveBeenCalledWith(eventData, eventMap);
				});

				it('should notify the second handler', function() {
					expect(eventHandlerTwo).toHaveBeenCalledWith(eventData, eventMap);
				});
			});

			describe('and the an unrelated event fires', function() {
				var eventData;

				beforeEach(function() {
					eventMap.fire('blah', eventData = { });
				});

				it('should not notify the first handler', function() {
					expect(eventHandler).not.toHaveBeenCalled();
				});

				it('should not notify the second handler', function() {
					expect(eventHandlerTwo).not.toHaveBeenCalled();
				});
			});

			describe('and the handler is unregistered', function() {
				beforeEach(function() {
					eventMap.unregister(eventName, eventHandler);
				});

				it('should report the event as empty', function() {
					expect(eventMap.getIsEmpty(eventName)).toBe(false);
				});

				describe('and the event fires', function() {
					var eventData;

					beforeEach(function() {
						eventMap.fire(eventName, eventData = { });
					});

					it('should not notify the first handler', function() {
						expect(eventHandler).not.toHaveBeenCalledWith(eventData, eventMap);
					});

					it('should notify the second handler', function() {
						expect(eventHandlerTwo).toHaveBeenCalledWith(eventData, eventMap);
					});
				});

				describe('and the second handler is unregistered', function() {
					beforeEach(function() {
						eventMap.unregister(eventName, eventHandlerTwo);
					});

					it('should report the event as empty', function() {
						expect(eventMap.getIsEmpty(eventName)).toBe(true);
					});

					describe('and the event fires', function() {
						var eventData;

						beforeEach(function() {
							eventMap.fire(eventName, eventData = { });
						});

						it('should not notify the first handler', function() {
							expect(eventHandler).not.toHaveBeenCalledWith(eventData, eventMap);
						});

						it('should not notify the second handler', function() {
							expect(eventHandlerTwo).not.toHaveBeenCalledWith(eventData, eventMap);
						});
					});
				});
			});
		});
	});
});