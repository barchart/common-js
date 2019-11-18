const CommandHandler = require('./../../../commands/CommandHandler');

describe('When a CommandHandler is created from a function', () => {
	'use strict';

	let commandHandler;
	let spy;
	let result;

	beforeEach(() => {
		commandHandler = CommandHandler.fromFunction(spy = jasmine.createSpy('spy').and.returnValue(result = 123));
	});

	it('returns a CommandHandler instance', () => {
		expect(commandHandler instanceof CommandHandler).toEqual(true);
	});

	describe('and the command is executed', () => {
		let commandData;
		let commandResult;

		beforeEach(() => {
			commandResult = commandHandler.process(commandData = {});
		});

		it('should invoke the wrapped function', () => {
			expect(spy).toHaveBeenCalledWith(commandData);
		});

		it('should return the wrapped function\'s result', () => {
			expect(commandResult).toEqual(result);
		});
	});

	describe('and the command processor is converted to a function', () => {
		let commandFunction;

		beforeEach(() => {
			commandFunction = CommandHandler.toFunction(commandHandler);
		});

		it('returns a function', () => {
			expect(typeof commandFunction).toEqual('function');
		});

		describe('and the converted function is invoked', () => {
			let commandData;
			let commandResult;

			beforeEach(() => {
				commandResult = commandFunction(commandData = {});
			});

			it('should invoke the wrapped function', () => {
				expect(spy).toHaveBeenCalledWith(commandData);
			});

			it('should return the wrapped function\'s result', () => {
				expect(commandResult).toEqual(result);
			});
		});
	});
});