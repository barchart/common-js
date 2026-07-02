import LambdaResponder from './../../../../aws/lambda/LambdaResponder.js';
import LambdaResponseGenerator from './../../../../aws/lambda/responses/LambdaResponseGenerator.js';

class StubResponseGenerator extends LambdaResponseGenerator {
	constructor(response) {
		super();

		this.response = response;
	}

	_generate() {
		return this.response;
	}
}

describe('When a Lambda responder is used', () => {
	'use strict';

	let callback;
	let responder;

	beforeEach(() => {
		callback = jasmine.createSpy('callback');
		responder = new LambdaResponder(callback);
	});

	it('should send JSON responses through the callback', async () => {
		const response = await responder
			.setHeader('X-Test', 'yes')
			.send({ id: 1 });

		expect({
			complete: responder.complete,
			callback: callback.calls.argsFor(0),
			response
		}).toEqual({
			complete: true,
			callback: [ null, response ],
			response: {
				statusCode: 200,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Credentials': true,
					'Content-Type': 'application/json',
					'X-Test': 'yes'
				},
				body: JSON.stringify({ id: 1 })
			}
		});
	});

	it('should send plain text errors with an error status code', async () => {
		const response = await responder.sendError('failed', 400);

		expect(response).toEqual({
			statusCode: 400,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
				'Content-Type': 'text/plain'
			},
			body: 'failed'
		});
	});

	it('should send binary responses as base64 encoded data', async () => {
		const response = await responder.sendBinary(Buffer.from('hello'), 'text/plain');

		expect(response).toEqual({
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
				'Content-Type': 'text/plain'
			},
			body: Buffer.from('hello').toString('base64'),
			isBase64Encoded: true
		});
	});

	it('should send raw responses once', async () => {
		const first = await responder.sendRaw({ ok: true });
		const second = await responder.sendRaw({ ok: false });

		expect({
			first,
			second,
			callbackCount: callback.calls.count()
		}).toEqual({
			first: { ok: true },
			second: { ok: true },
			callbackCount: 1
		});
	});

	it('should use custom response generators before the default response', async () => {
		const generated = {
			statusCode: 202,
			headers: {
				'Content-Type': 'application/custom'
			},
			body: 'accepted'
		};

		const response = await responder
			.addResponseGenerator(new StubResponseGenerator(generated))
			.send({ id: 1 });

		expect(response).toEqual(generated);
	});

	it('should add multiple response generators', async () => {
		const generated = {
			statusCode: 201,
			headers: { },
			body: 'created'
		};

		const response = await responder
			.addResponseGenerators([
				new StubResponseGenerator(null),
				new StubResponseGenerator(generated)
			])
			.send({ id: 1 });

		expect(response).toEqual(generated);
	});
});
