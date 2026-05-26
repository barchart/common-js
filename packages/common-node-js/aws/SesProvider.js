const aws = require('aws-sdk'),
	log4js = require('log4js'),
	nodemailer = require('nodemailer');

const assert = require('@barchart/common-js/lang/assert'),
	Disposable = require('@barchart/common-js/lang/Disposable'),
	is = require('@barchart/common-js/lang/is'),
	object = require('@barchart/common-js/lang/object'),
	RateLimiter = require('@barchart/common-js/timing/RateLimiter');

const DelegateReadStream = require('./../stream/DelegateReadStream');

module.exports = (() => {
	'use strict';

	const logger = log4js.getLogger('common-node/aws/SesProvider');

	/**
	 * A facade for Amazon's Simple Email Service (SES). The constructor
	 * accepts configuration options. The promise-based instance functions
	 * abstract knowledge of the AWS API.
	 *
	 * @public
	 * @extends Disposable
	 * @param {object} configuration
	 * @param {string} configuration.region - The AWS region (e.g. "us-east-1").
	 * @param {string=} configuration.apiVersion - The SES version (defaults to "2010-12-01").
	 * @param {string=} configuration.recipientOverride - If specified, all emails sent will be redirected to this email address, ignoring the specified recipient.
	 * @param {number=} configuration.rateLimitPerSecond - The number of emails which will be sent to the AWS SDK within one second (defaults to 10).
	 */
	class SesProvider extends Disposable {
		constructor(configuration) {
			super();

			assert.argumentIsRequired(configuration, 'configuration');
			assert.argumentIsRequired(configuration.region, 'configuration.region', String);
			assert.argumentIsOptional(configuration.apiVersion, 'configuration.apiVersion', String);

			if (is.array(configuration.recipientOverride)) {
				assert.argumentIsArray(configuration.recipientOverride, 'configuration.recipientOverride', String);
			} else {
				assert.argumentIsOptional(configuration.recipientOverride, 'configuration.recipientOverride', String);
			}

			assert.argumentIsOptional(configuration.rateLimitPerSecond, 'configuration.rateLimitPerSecond', Number);

			this._configuration = configuration;

			this._sesv2 = null;
			this._transport = null;

			this._started = false;

			this._rateLimiters = { };

			this._rateLimiters.send = new RateLimiter(configuration.rateLimitPerSecond || 10, 1000);
			this._rateLimiters.suppressed = new RateLimiter(configuration.rateLimitPerSecond || 1, 4000);
		}

		/**
		 * Initializes the Amazon SDK. Call this before invoking any other instance
		 * functions.
		 *
		 * @public
		 * @async
		 * @returns {Promise<void>}
		 */
		async start() {
			if (this.disposed) {
				throw new Error('Unable to start, the SES provider has been disposed.');
			}

			if (!this._started) {
				try {
					aws.config.update({ region: this._configuration.region });

					this._transport = nodemailer.createTransport({
						SES: new aws.SES({
							apiVersion: '2010-12-01'
						})
					});

					this._sesv2 = new aws.SESV2({ apiVersion: this._configuration.apiVersion || '2019-09-27' });

					logger.info('The SES provider has started');

					this._started = true;
				} catch (e) {
					logger.error('The SES provider failed to start', e);

					throw e;
				}
			}
		}

		/**
		 * Returns a clone of the configuration object originally passed
		 * to the constructor.
		 *
		 * @returns {Object}
		 */
		getConfiguration() {
			if (this.disposed) {
				throw new Error('The SES provider has been disposed.');
			}

			return object.clone(this._configuration);
		}

		async send(options) {
			checkReady.call(this);

			assert.argumentIsRequired(options, 'options', Object);

			return this.sendEmail(options.senderAddress, options.recipientAddress, options.subject, options.htmlBody, options.textBody, options.attachments, options.headers);
		}

		/**
		 * Attempts to send an email.
		 *
		 * @public
		 * @async
		 * @param {string} senderAddress - The "from" email address.
		 * @param {string|string[]} recipientAddress - The "to" email address(es).
		 * @param {string=} subject - The email's subject.
		 * @param {string=} htmlBody - The email's HTML body.
		 * @param {string=} textBody - The email's text body.
		 * @param {Object[]=} attachments - Attachment descriptors.
		 * @param {Object=} headers - Email headers.
		 * @returns {Promise<void>}
		 */
		async sendEmail(senderAddress, recipientAddress, subject, htmlBody, textBody, attachments, headers) {
			checkReady.call(this);

			assert.argumentIsRequired(senderAddress, 'senderAddress', String);

			if (is.array(recipientAddress)) {
				assert.argumentIsArray(recipientAddress, 'recipientAddress', String);
			} else {
				assert.argumentIsRequired(recipientAddress, 'recipientAddress', String);
			}

			assert.argumentIsOptional(subject, 'subject', String);
			assert.argumentIsOptional(htmlBody, 'htmlBody', String);
			assert.argumentIsOptional(textBody, 'textBody', String);
			assert.argumentIsOptional(headers, 'headers', Object);

			if (attachments) {
				assert.argumentIsArray(attachments, 'attachments', Object, 'Object');
			}

			if (this._configuration.recipientOverride) {
				logger.warn('Overriding email recipient for testing purposes, using [', this._configuration.recipientOverride, ']');

				recipientAddress = this._configuration.recipientOverride;
			}

			const recipientAddressesToUse = is.array(recipientAddress) ? recipientAddress : [recipientAddress];

			const message = buildMessage({ senderAddress, recipientAddresses: recipientAddressesToUse, subject, htmlBody, textBody, attachments, headers });

			await this._rateLimiters.send.enqueue(async () => {
				try {
					logger.debug('Sending email to [', recipientAddress, ']');

					await this._transport.sendMail(message);

					logger.debug('Sent email to [', recipientAddress, ']');
				} catch (error) {
					logger.error('SES provider failed to send email message', message);
					logger.error(error);

					throw error;
				}
			});
		}

		/**
		 * Returns a specific item on the account-level suppression list.
		 *
		 * @public
		 * @async
		 * @param {string} email
		 * @returns {Promise<Object|null>}
		 */
		async getSuppressedItem(email) {
			checkReady.call(this);

			assert.argumentIsRequired(email, 'email', String);

			let item;

			try {
				const response = await this._sesv2.getSuppressedDestination({ EmailAddress: email }).promise();

				item = transformSuppressionListItem(response.SuppressedDestination);
			} catch (e) {
				if (e && e.code === 'NotFoundException') {
					item = null;
				} else {
					throw e;
				}
			}

			return item;
		}

		/**
		 * Returns the list of items on the account-level suppression list.
		 *
		 * @public
		 * @async
		 * @returns {Promise<*[]>}
		 */
		async getSuppressedItems() {
			checkReady.call(this);

			const items = [];

			let token = null;

			while (true) {
				const params = {};

				if (token) {
					params.NextToken = token;
				}

				const response = await this._sesv2.listSuppressedDestinations(params).promise();
				const batch = response.SuppressedDestinationSummaries;

				for (let i = 0; i < batch.length; i++) {
					items.push(transformSuppressionListItem(batch[i]));
				}

				token = response.NextToken || null;

				if (token === null) {
					break;
				}
			}

			return items;
		}

		/**
		 * Creates a readable stream for suppressed items.
		 *
		 * @public
		 * @param {Boolean} discrete
		 * @returns {Stream.Readable}
		 */
		getSuppressedItemStream(discrete) {
			checkReady.call(this);

			let done = false;
			let token = null;

			const delegate = async() => {
				if (done) {
					return null;
				}

				const response = await this._rateLimiters.suppressed.enqueue(async () => {
					const params = { };

					if (token !== null) {
						params.NextToken = token;
					}

					return this._sesv2.listSuppressedDestinations(params).promise();
				});

				const items = response.SuppressedDestinationSummaries.reduce((accumulator, raw) => {
					accumulator.push(transformSuppressionListItem(raw));

					return accumulator;
				}, [ ]);

				token = response.NextToken || null;

				if (token === null) {
					done = true;
				}

				return items;
			};

			return new DelegateReadStream(delegate, null, discrete);
		}

		/**
		 * Adds an email address to the suppression list.
		 *
		 * @public
		 * @async
		 * @param {string} email - The email address to suppress.
		 * @param {string=} reason - The reason for suppression (valid values: "BOUNCE", "COMPLAINT"). Defaults to "COMPLAINT".
		 * @returns {Promise<Object>}
		 */
		async addSuppressedItem(email, reason = 'COMPLAINT') {
			checkReady.call(this);

			assert.argumentIsRequired(email, 'email', String);
			assert.argumentIsOptional(reason, 'reason', String);

			assert.argumentIsValid(reason, 'reason', r => r.toUpperCase() === 'BOUNCE' || r.toUpperCase() === 'COMPLAINT', 'must be one of [ BOUNCE, COMPLIANT ]');

			await this._sesv2.putSuppressedDestination({ EmailAddress: email, Reason: reason.toUpperCase() }).promise();

			return await this.getSuppressedItem(email);
		}

		/**
		 * Removes an email address from the suppression list.
		 *
		 * @public
		 * @async
		 * @param {string} email - The email address to remove from the suppression list.
		 * @returns {Promise<void>}
		 */
		async removeSuppressedItem(email) {
			checkReady.call(this);

			assert.argumentIsRequired(email, 'email', String);

			await this._sesv2.deleteSuppressedDestination({ EmailAddress: email }).promise();
		}

		_onDispose() {
			this._rateLimiters.send.dispose();
			this._rateLimiters.suppressed.dispose();

			this._rateLimiters = null;
		}

		toString() {
			return '[SesProvider]';
		}
	}

	function checkReady() {
		if (this.disposed) {
			throw new Error('The SES provider has been disposed.');
		}

		if (!this._started) {
			throw new Error('The SES provider has not been started.');
		}
	}

	function transformSuppressionListItem(data) {
		return { email: data.EmailAddress, reason: data.Reason, date: data.LastUpdateTime };
	}

	function buildMessage(options) {
		const message = {
			from: options.senderAddress,
			to: options.recipientAddresses,
			subject: options.subject || ''
		};

		if (is.string(options.htmlBody) && options.htmlBody.length > 0) {
			message.html = options.htmlBody;
		}

		if (is.string(options.textBody) && options.textBody.length > 0) {
			message.text = options.textBody;
		}

		if (options.headers) {
			message.headers = options.headers;
		}

		if (options.attachments && options.attachments.length > 0) {
			message.attachments = options.attachments;
		}

		return message;
	}

	return SesProvider;
})();
