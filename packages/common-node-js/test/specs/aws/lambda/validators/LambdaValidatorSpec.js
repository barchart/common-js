import LambdaTriggerType from './../../../../../aws/lambda/LambdaTriggerType.js';
import LambdaEventValidator from './../../../../../aws/lambda/validators/LambdaEventValidator.js';
import LambdaMessageValidator from './../../../../../aws/lambda/validators/LambdaMessageValidator.js';
import LambdaMessageValidatorDst from './../../../../../aws/lambda/validators/LambdaMessageValidatorDst.js';

class StubEventValidator extends LambdaEventValidator {
	constructor(valid) {
		super([ new StubMessageValidator(valid) ]);
	}
}

class StubMessageValidator extends LambdaMessageValidator {
	constructor(valid) {
		super();

		this.valid = valid;
		this.calls = [ ];
	}

	_validate(name, message, event, trigger, messageId) {
		this.calls.push({ name, message, event, trigger, messageId });

		return this.valid;
	}
}

describe('When Lambda validators are used', () => {
	'use strict';

	let functionName;

	beforeEach(() => {
		functionName = process.env.AWS_LAMBDA_FUNCTION_NAME;
		process.env.AWS_LAMBDA_FUNCTION_NAME = 'test-lambda';
	});

	afterEach(() => {
		if (functionName) {
			process.env.AWS_LAMBDA_FUNCTION_NAME = functionName;
		} else {
			delete process.env.AWS_LAMBDA_FUNCTION_NAME;
		}
	});

	it('should validate messages that expose a trigger and message id', async () => {
		const validator = new StubEventValidator(true);
		const valid = await validator.validate({
			Records: [
				{
					eventSource: 'aws:sqs',
					messageId: 'M1',
					body: '{}'
				}
			]
		});

		expect(valid).toEqual(true);
	});

	it('should fail when any lambda message validation fails', async () => {
		const validator = new StubEventValidator(false);
		const valid = await validator.validate({
			Records: [
				{
					eventSource: 'aws:sqs',
					messageId: 'M1',
					body: '{}'
				}
			]
		});

		expect(valid).toEqual(false);
	});

	it('should run every message validator for every message', async () => {
		const first = new StubMessageValidator(true);
		const second = new StubMessageValidator(true);
		const event = {
			Records: [
				{
					eventSource: 'aws:sqs',
					messageId: 'M1',
					body: '{}'
				}
			]
		};
		const validator = new LambdaEventValidator([ first ]);

		validator.addMessageValidator(second);

		const valid = await validator.validate(event);

		expect({
			valid,
			first: first.calls[0],
			second: second.calls[0]
		}).toEqual({
			valid: true,
			first: {
				name: 'test-lambda',
				message: event.Records[0],
				event,
				trigger: LambdaTriggerType.SQS,
				messageId: 'M1'
			},
			second: {
				name: 'test-lambda',
				message: event.Records[0],
				event,
				trigger: LambdaTriggerType.SQS,
				messageId: 'M1'
			}
		});
	});

	it('should fail when any message validator rejects a message', async () => {
		const validator = new LambdaEventValidator([
			new StubMessageValidator(true),
			new StubMessageValidator(false)
		]);

		const valid = await validator.validate({
			eventSource: 'aws:sqs',
			messageId: 'M1',
			body: '{}'
		});

		expect(valid).toEqual(false);
	});

	it('should allow events when no message validators are configured', async () => {
		const validator = new LambdaEventValidator();

		expect(await validator.validate({ })).toEqual(true);
	});

	it('should validate daylight savings metadata on CloudWatch messages', async () => {
		const validator = new LambdaMessageValidatorDst();
		const invalid = await validator.validate(
			'test-lambda',
			{
				source: 'aws.events',
				id: 'C1',
				detail: {
					tz: 'Not/AZone',
					dst: true
				}
			},
			{ },
			LambdaTriggerType.CLOUDWATCH,
			'C1'
		);
		const nonCloudWatch = await validator.validate(
			'test-lambda',
			{
				eventSource: 'aws:sqs',
				messageId: 'M1',
				body: '{}'
			},
			{ },
			LambdaTriggerType.SQS,
			'M1'
		);

		expect({
			invalid,
			nonCloudWatch
		}).toEqual({
			invalid: false,
			nonCloudWatch: true
		});
	});
});
