import LambdaEventParser from './../../../../aws/lambda/LambdaEventParser.js';
import LambdaHelper from './../../../../aws/lambda/LambdaHelper.js';
import LambdaStage from './../../../../aws/lambda/LambdaStage.js';
import LambdaTriggerType from './../../../../aws/lambda/LambdaTriggerType.js';

describe('When Lambda event parser utilities are used', () => {
	'use strict';

	it('should read headers, context, path parameters, query strings, and body values', () => {
		const event = {
			headers: {
				Accept: 'application/json'
			},
			requestContext: {
				authorizer: {
					accountId: 'A1'
				}
			},
			pathParameters: {
				proxy: 'orders/A%201/items',
				orderId: '42'
			},
			queryStringParameters: {
				mode: 'text',
				limit: '10'
			},
			body: JSON.stringify({
				status: 'OPEN',
				nested: {
					count: 2
				}
			})
		};

		const parser = new LambdaEventParser(event);

		expect({
			plainText: parser.plainText,
			header: parser.getHeader('Accept'),
			context: parser.getContext('accountId'),
			paths: parser.getPaths(),
			path: parser.getPath('orderId', value => Number.parseInt(value, 10)),
			query: parser.getQueryString('limit', value => Number.parseInt(value, 10)),
			alias: parser.getQuerystring('mode'),
			body: parser.getBody('nested.count'),
			rawBody: parser.getBody()
		}).toEqual({
			plainText: true,
			header: 'application/json',
			context: 'A1',
			paths: [ 'orders', 'A 1', 'items' ],
			path: 42,
			query: 10,
			alias: 'text',
			body: 2,
			rawBody: event.body
		});
	});

	it('should read HTTP API authorizer context values', () => {
		const parser = new LambdaEventParser({
			version: '2.0',
			requestContext: {
				authorizer: {
					lambda: {
						userId: 'U1'
					}
				}
			}
		});

		expect(parser.getContext('userId')).toEqual('U1');
	});

	it('should return null when parser callbacks fail', () => {
		const parser = new LambdaEventParser({
			pathParameters: {
				id: 'bad'
			},
			queryStringParameters: {
				limit: 'bad'
			}
		});

		expect({
			path: parser.getPath('id', () => {
				throw new Error('Invalid path');
			}),
			query: parser.getQueryString('limit', () => {
				throw new Error('Invalid query');
			})
		}).toEqual({
			path: null,
			query: null
		});
	});

	it('should extract messages from supported event trigger payloads', () => {
		const parser = new LambdaEventParser({
			Records: [
				{
					eventSource: 'aws:sqs',
					messageId: 'M1',
					body: JSON.stringify({ id: 1 })
				},
				{
					EventSource: 'aws:sns',
					Sns: {
						MessageId: 'M2',
						Message: JSON.stringify({ id: 2 })
					}
				}
			]
		});

		expect({
			parsed: parser.getMessages(),
			text: parser.getMessages(true)
		}).toEqual({
			parsed: [
				{ id: 1 },
				{ id: 2 }
			],
			text: [
				JSON.stringify({ id: 1 }),
				JSON.stringify({ id: 2 })
			]
		});
	});

	it('should match lambda trigger types without calling services', () => {
		const sqsMessage = {
			eventSource: 'aws:sqs',
			messageId: 'M1',
			body: 'hello'
		};

		const type = LambdaTriggerType.fromMessage(sqsMessage);

		expect({
			type,
			matches: type.getMatch(sqsMessage),
			id: type.getId(sqsMessage),
			content: type.getContent(sqsMessage)
		}).toEqual({
			type: LambdaTriggerType.SQS,
			matches: true,
			id: 'M1',
			content: 'hello'
		});
	});

	it('should create pure helper objects and resolve stages', () => {
		const callback = () => { };

		expect({
			parser: LambdaHelper.getEventParser({ }) instanceof LambdaEventParser,
			responderComplete: LambdaHelper.getResponder(callback).complete,
			validator: typeof LambdaHelper.getValidator().validate,
			stage: LambdaHelper.getStage('prod'),
			stageFromName: LambdaStage.getStageFromName('service-stage-worker'),
			defaultStage: LambdaStage.getStageFromName('service-worker')
		}).toEqual({
			parser: true,
			responderComplete: false,
			validator: 'function',
			stage: LambdaStage.PROD,
			stageFromName: LambdaStage.STAGE,
			defaultStage: LambdaStage.DEV
		});
	});
});
