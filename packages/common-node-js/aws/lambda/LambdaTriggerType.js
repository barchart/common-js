const is = require('@barchart/common-js/lang/is');

const Enum = require('@barchart/common-js/lang/Enum');

module.exports = (() => {
	'use strict';

	/**
	 * An enumeration of mechanisms which can trigger a Lambda Function.
	 *
	 * @public
	 * @extends {Enum}
	 * @param {String} code
	 * @param {Function} matchPredicate
	 * @param {Function} idExtractor
	 * @param {Function} contentExtractor
	 */
	class LambdaTriggerType extends Enum {
		constructor(code, matchPredicate, idExtractor, contentExtractor) {
			super(code, code);

			this._matchPredicate = matchPredicate;
			this._idExtractor = idExtractor;
			this._contentExtractor = contentExtractor;
		}

		/**
		 * Returns true if the message matches the trigger type; otherwise false.
		 *
		 * @public
		 * @param {Object} message
		 * @returns {Boolean}
		 */
		getMatch(message) {
			return this._matchPredicate(message);
		}

		/**
		 * Extracts and returns the message's identifier.
		 *
		 * @public
		 * @param {Object} message
		 * @returns {String|null}
		 */
		getId(message) {
			return this._idExtractor(message) || null;
		}

		/**
		 * Extracts and returns the message's content.
		 *
		 * @public
		 * @param {Object} message
		 * @returns {String|null}
		 */
		getContent(message) {
			return this._contentExtractor(message) || null;
		}

		/**
		 * Given a message, returns the {@LambdaTriggerType} which matches the message.
		 *
		 * @public
		 * @static
		 * @param {Object} message
		 * @returns {LambdaTriggerType|null}
		 */
		static fromMessage(message) {
			return Enum.getItems(LambdaTriggerType).find(t => t.getMatch(message)) || null;
		}

		/**
		 * A CloudWatch events trigger.
		 *
		 * @public
		 * @static
		 * @returns {LambdaTriggerType}
		 */
		static get CLOUDWATCH() {
			return cloudwatch;
		}

		/**
		 * A Dynamo stream.
		 *
		 * @public
		 * @static
		 * @returns {LambdaTriggerType}
		 */
		static get DYNAMO() {
			return dynamo;
		}

		/**
		 * An SNS message.
		 *
		 * @public
		 * @static
		 * @returns {LambdaTriggerType}
		 */
		static get SNS() {
			return sns;
		}

		/**
		 * An SQS message.
		 *
		 * @public
		 * @static
		 * @returns {LambdaTriggerType}
		 */
		static get SQS() {
			return sqs;
		}

		/**
		 * A direct invocation of a Lambda function from the Barchart Scheduler
		 * Service (see https://github.com/barchart/scheduler-private).
		 *
		 * @public
		 * @static
		 * @returns {LambdaTriggerType}
		 */
		static get BARCHART_SCHEDULER() {
			return barchartScheduler;
		}

		/**
		 * A direct, recursive invocation of a Lambda function.
		 *
		 * @public
		 * @static
		 * @returns {LambdaTriggerType}
		 */
		static get BARCHART_RECURSIVE() {
			return barchartRecursive;
		}

		/**
		 * A trigger from the API Gateway (in the original REST mode).
		 *
		 * @public
		 * @static
		 * @returns {LambdaTriggerType}
		 */
		static get API_GATEWAY_REST() {
			return apiGatewayRest;
		}

		/**
		 * A trigger from the API Gateway (in the newer HTTP mode).
		 *
		 * @public
		 * @static
		 * @returns {LambdaTriggerType}
		 */
		static get API_GATEWAY_HTTP() {
			return apiGatewayHttp;
		}

		toString() {
			return `[LambdaTriggerType (code=${this.code})]`;
		}
	}

	const cloudwatch = new LambdaTriggerType('CRON', m => m.source === 'aws.events', m => m.id, m => m.detail);
	const dynamo = new LambdaTriggerType('DYNAMO', m => m.eventSource === 'aws:dynamodb', m => m.eventID, m => m.dynamodb);
	const sns = new LambdaTriggerType('SNS', m => m.EventSource === 'aws:sns', m => m.Sns.MessageId, m => m.Sns.Message);
	const sqs = new LambdaTriggerType('SQS', m => m.eventSource === 'aws:sqs', m => m.messageId, m => m.body);

	const barchartScheduler = new LambdaTriggerType('BARCHART_SCHEDULER', m => m.source === 'barchart:scheduler', m => m.guid, m => m.data);
	const barchartRecursive = new LambdaTriggerType('BARCHART_RECURSIVE', m => m.source === 'barchart:recursive', m => m.guid, m => m.data);

	const apiGatewayRest = new LambdaTriggerType('API_GATEWAY_REST', m => is.object(m.requestContext) && !m.hasOwnProperty('version'), m => m.requestContext.requestId || null, m => m);
	const apiGatewayHttp = new LambdaTriggerType('API_GATEWAY_HTTP', m => is.object(m.requestContext) && m.hasOwnProperty('version') && m.version === '2.0', m => m.requestContext.requestId || null, m => m);

	return LambdaTriggerType;
})();
