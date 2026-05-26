const Stream = require('stream');

const IteratorReadStream = require('./../../../stream/IteratorReadStream');

class SpyWriteStream extends Stream.Writable {
	constructor(spy) {
		super({ objectMode: true  });

		this._spy = spy;
	}

	_write(chunk, encoding, callback) {
		this._spy(chunk);

		callback(null);
	}

	toString() {
		return '[EmptyWriteStream]';
	}
}

describe('When a IteratorReadStream is created', () => {
	'use strict';

	describe('from an array of three items', () => {
		let readable;


		beforeEach(() => {
			readable = IteratorReadStream.fromArray([1, 2, 3]);
		});

		describe('and piped to a writable stream', () => {
			let writable;
			let spy;

			beforeEach((done) => {
				writable = new SpyWriteStream(spy = jasmine.createSpy('write'));

				readable.pipe(writable);

				writable.on('finish', () => {
					done();
				});
			});

				it('should pass the second value to the writer', () => {
				expect(spy.calls.argsFor(0)).toEqual([ 1 ]);
			});

				it('should pass the third value to the writer', () => {
				expect(spy.calls.argsFor(1)).toEqual([ 2 ]);
			});

			it('should pass the first value to the writer', () => {
				expect(spy.calls.argsFor(2)).toEqual([ 3 ]);
			});
		});
	});
});
