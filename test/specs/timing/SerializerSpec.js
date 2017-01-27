var Serializer = require('./../../../timing/Serializer');

describe('When a Serializer is used to schedule four tasks', function() {
	'use strict';

	var serializer;

	var spies;
	var promises;
	var results;

	beforeEach(function() {
		serializer = new Serializer();

		spies = [ ];
		promises = [ ];
		results = [ ];

		for (var i = 0; i < 4; i++) {
			var spy = getSpy(results, false);

			spies.push(spy);
			promises.push(serializer.enqueue(spy));
		}
	});

	describe('and the tasks complete', function() {
		beforeEach(function(done) {
			Promise.all(promises)
				.then(() => {
					done();
				});
		});

		it('the first task should have been executed', function() {
			expect(spies[0]).toHaveBeenCalled();
		});

		it('the second task should have been executed', function() {
			expect(spies[1]).toHaveBeenCalled();
		});

		it('the third task should have been executed', function() {
			expect(spies[2]).toHaveBeenCalled();
		});

		it('the fourth task should have been executed', function() {
			expect(spies[3]).toHaveBeenCalled();
		});

		it('the first task should complete before the second task starts', function() {
			expect(results[0].end <= results[1].start).toEqual(true);
		});

		it('the second task should complete before the third task starts', function() {
			expect(results[1].end <= results[2].start).toEqual(true);
		});

		it('the third task should complete before the fourth task starts', function() {
			expect(results[2].end <= results[3].start).toEqual(true);
		});
	});
});

function getSpy(results, fail) {
	return jasmine.createSpy('spy').and.callFake(function() {
		return new Promise(function(resolveCallback, rejectCallback) {
			var start = new Date();

			setTimeout(function() {
				var end = new Date();

				results.push({
					start: start.getTime(),
					end: end.getTime()
				});

				if (fail) {
					rejectCallback();
				} else {
					resolveCallback();
				}
			}, 5);
		});
	});
}