import * as is from '@barchart/common-js/lang/is.js';

import Timezones from '@barchart/common-js/lang/Timezones.js';

import LambdaMessageValidator from './LambdaMessageValidator.js';
import LambdaTriggerType from './../LambdaTriggerType.js';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/lambda/validators/LambdaMessageValidatorDst');

/**
 * Validates Lambda Function invocations triggered by CloudWatch Events
 * (i.e. scheduled jobs) which are intended to run at a specific time
 * of day, regardless of daylights savings time. In these cases, the
 * Lambda Function will be scheduled twice per day. This validator
 * will accept one of the scheduled invocations and reject the other.
 *
 * @public
 */
export default class LambdaMessageValidatorDst extends LambdaMessageValidator {
	constructor() {
		super();
	}

	_validate(name, message, event, trigger, messageId) {
		if (trigger !== LambdaTriggerType.CLOUDWATCH) {
			return true;
		}

		if (!message) {
			return true;
		}

		const content = trigger.getContent(message);

		const tz = content.tz;
		const dst = content.dst;

		if (!(is.string(tz) && is.boolean(dst))) {
			return true;
		}

		const timezone = Timezones.parse(tz);

		if (timezone === null) {
			logger.error(`Lambda CloudWatch Event trigger is invalid — timezone cannot be determined [ ${tz} ]`);

			return false;
		}

		const valid = timezone.getIsDaylightSavingsTime() === dst;

		if (!valid) {
			logger.debug(`Lambda CloudWatch Event trigger is invalid — trigger ${(dst ? 'is' : 'is not')} intended for use during daylight savings time in [ ${timezone.code} ]`);
		}

		return valid;
	}

	toString() {
		return '[LambdaMessageValidatorDst]';
	}
}
