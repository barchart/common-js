const CommandHandler = require('./../../../commands/CommandHandler'),
	MappedCommandHandler = require('./../../../commands/MappedCommandHandler');

describe('When a MappedCommandHandler is created with two mapped commands', () => {
	'use strict';

	let commandHandler;

	let spyOne;
	let spyTwo;

	let selectorOne;
	let selectorTwo;

	let resultOne;
	let resultTwo;

	beforeEach(() => {
		selectorOne = 'one';
		selectorTwo = 'two';

		resultOne = 'a';
		resultTwo = 'b';

		commandHandler = new MappedCommandHandler((data) => {
			return data.commandType || null;
		});

		commandHandler.addCommandHandler(selectorOne, CommandHandler.fromFunction(spyOne = jasmine.createSpy('spyOne').and.callFake(() => {
			return resultOne;
		})));
		commandHandler.addCommandHandler(selectorTwo, CommandHandler.fromFunction(spyTwo = jasmine.createSpy('spyTwo').and.callFake(() => {
			return resultTwo;
		})));
	});

	describe('and the command is process with data for the first handler', () => {
		let commandData;
		let commandResult;

		beforeEach(() => {
			commandResult = commandHandler.process(commandData = {commandType: selectorOne});
		});

		it('should invoke wrapped function for the first handler', () => {
			expect(spyOne).toHaveBeenCalledWith(commandData);
		});

		it('should return the result from the first handler', () => {
			expect(commandResult).toEqual(resultOne);
		});

		it('should not invoke wrapped function for the secoond handler', () => {
			expect(spyTwo).not.toHaveBeenCalledWith(commandData);
		});
	});

	describe('and the command is process with data for the second handler', () => {
		let commandData;
		let commandResult;

		beforeEach(() => {
			commandResult = commandHandler.process(commandData = {commandType: selectorTwo});
		});

		it('should invoke wrapped function for the second handler', () => {
			expect(spyTwo).toHaveBeenCalledWith(commandData);
		});

		it('should return the result from the second handler', () => {
			expect(commandResult).toEqual(resultTwo);
		});

		it('should not invoke wrapped function for the first handler', () => {
			expect(spyOne).not.toHaveBeenCalledWith(commandData);
		});
	});
});