import LambdaEventParser from './../../../../../aws/lambda/LambdaEventParser.js';
import LambdaResponseGenerator from './../../../../../aws/lambda/responses/LambdaResponseGenerator.js';
import LambdaResponseGeneratorGzip from './../../../../../aws/lambda/responses/LambdaResponseGeneratorGzip.js';
import LambdaResponseProcessor from './../../../../../aws/lambda/responses/LambdaResponseProcessor.js';

import zlib from 'zlib';

class StubResponseGenerator extends LambdaResponseGenerator {
	constructor(response) {
		super();

		this.response = response;
		this.calls = 0;
	}

	_generate() {
		this.calls = this.calls + 1;

		return this.response;
	}
}

describe('When Lambda response generators are used', () => {
	'use strict';

	it('should build API Gateway response objects', () => {
		const headers = LambdaResponseGenerator.getHeadersForJson();

		expect({
			headers,
			response: LambdaResponseGenerator.buildResponseForApiGateway(201, headers, 'created', true)
		}).toEqual({
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
				'Content-Type': 'application/json'
			},
			response: {
				statusCode: 201,
				headers,
				body: 'created',
				isBase64Encoded: true
			}
		});
	});

	it('should use the default generator for string and buffer responses', async () => {
		const headers = LambdaResponseGenerator.getHeadersForJson();
		const text = await LambdaResponseGenerator.DEFAULT.generate(200, headers, 'hello', 5);
		const binary = await LambdaResponseGenerator.DEFAULT.generate(200, headers, Buffer.from('hello'), 5);

		expect({
			text,
			binary
		}).toEqual({
			text: {
				statusCode: 200,
				headers,
				body: 'hello'
			},
			binary: {
				statusCode: 200,
				headers,
				body: Buffer.from('hello').toString('base64'),
				isBase64Encoded: true
			}
		});
	});

	it('should reject oversized default responses', async () => {
		const response = await LambdaResponseGenerator.DEFAULT.generate(
			200,
			LambdaResponseGenerator.getHeadersForJson(),
			'x',
			LambdaResponseGenerator.MAXIMUM_RESPONSE_LENGTH_IN_BYTES + 1
		);

		expect(response).toEqual({
			statusCode: 413,
			headers: LambdaResponseGenerator.getHeadersForJson(),
			body: JSON.stringify({ message: 'Response too large' })
		});
	});

	it('should process response generators in order until one returns a response', async () => {
		const first = new StubResponseGenerator(null);
		const second = new StubResponseGenerator({
			statusCode: 202,
			headers: { },
			body: 'accepted'
		});
		const third = new StubResponseGenerator({
			statusCode: 500,
			headers: { },
			body: 'ignored'
		});
		const processor = new LambdaResponseProcessor();

		processor.addResponseGenerator(first);
		processor.addResponseGenerator(second);
		processor.addResponseGenerator(third);

		const response = await processor.process(200, { }, 'payload');

		expect({
			response,
			calls: [ first.calls, second.calls, third.calls ]
		}).toEqual({
			response: {
				statusCode: 202,
				headers: { },
				body: 'accepted'
			},
			calls: [ 1, 1, 0 ]
		});
	});

	it('should gzip supported responses when the request accepts gzip', async () => {
		const parser = new LambdaEventParser({
			headers: {
				'Accept-Encoding': 'br, gzip'
			}
		});
		const generator = new LambdaResponseGeneratorGzip(parser);
		const body = 'x'.repeat(LambdaResponseGenerator.MINIMUM_RESPONSE_SIZE_FOR_COMPRESSION_IN_BYTES);

		const response = await generator.generate(200, { 'Content-Type': 'text/plain' }, body, Buffer.byteLength(body));
		const decompressed = zlib.gunzipSync(Buffer.from(response.body, 'base64')).toString();

		expect({
			statusCode: response.statusCode,
			headers: response.headers,
			encoded: response.isBase64Encoded,
			decompressed
		}).toEqual({
			statusCode: 200,
			headers: {
				'Content-Type': 'text/plain',
				'Content-Encoding': 'gzip'
			},
			encoded: true,
			decompressed: body
		});
	});

	it('should skip gzip when request headers or response size are not suitable', async () => {
		const parser = new LambdaEventParser({
			headers: {
				'Accept-Encoding': 'br'
			}
		});
		const generator = new LambdaResponseGeneratorGzip(parser);

		expect({
			withoutHeader: await generator.generate(200, { }, 'x'.repeat(2048), 2048),
			tooSmall: await new LambdaResponseGeneratorGzip(new LambdaEventParser({
				headers: {
					'Accept-Encoding': 'gzip'
				}
			})).generate(200, { }, 'small', 5)
		}).toEqual({
			withoutHeader: null,
			tooSmall: null
		});
	});
});
