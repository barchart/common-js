const log4js = require('log4js');

const is = require('@barchart/common-js/lang/is'),
	Timezones = require('@barchart/common-js/lang/Timezones');

const LambdaMessageValidator = require('./LambdaMessageValidator'),
	LambdaTriggerType = require('./../LambdaTriggerType');

module.exports = (() => {
	'use strict';

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
	class LambdaMessageValidatorDst extends LambdaMessageValidator {
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

	return LambdaMessageValidatorDst;
})();
