const HardcodeQueryProvider = require('./../../../../data/providers/HardcodeQueryProvider');

describe('When configured with an object representing a chess game', () => {
	'use strict';

	let processor;
	let configuration;

	beforeEach(() => {
		processor = new HardcodeQueryProvider(configuration = { results: { game: 'chess', moves: [ 'e4', 'e5' ] } } );
	});

	describe('and executed', () => {
		let results;

		beforeEach((done) => {
			results = processor.runQuery({ completely: 'ignored' })
				.then((r) => {
					results = r;

					done();
				});
		});

		it('should not be a reference to the configuration object', () => {
			expect(results).not.toBe(configuration.results);
		});

		it('should have a matching "game" property', () => {
			expect(results.game).toEqual(configuration.results.game);
		});

		it('should have a "moves" property of the same length', () => {
			expect(results.moves.length).toEqual(configuration.results.moves.length);
		});

		it('should have a "moves" property with the same first move', () => {
			expect(results.moves[0]).toEqual(configuration.results.moves[0]);
		});

		it('should have a "moves" property with the same second move', () => {
			expect(results.moves[1]).toEqual(configuration.results.moves[1]);
		});
	});
});