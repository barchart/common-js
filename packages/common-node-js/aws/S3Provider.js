import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as object from '@barchart/common-js/lang/object.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

import AwsOptions from './AwsOptions.js';

import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner';

import log4js from 'log4js';

const logger = log4js.getLogger('common-node/aws/S3Provider');

const mimeTypes = {
	text: 'text/plain',
	html: 'text/html',
	json: 'application/json'
};

const encodingTypes = {
	utf8: 'utf-8'
};


/**
 * @typedef {import('stream').Readable} Readable
 */

/**
 * AWS SDK client configuration for the S3 provider.
 *
 * @typedef {import('@aws-sdk/client-s3').S3ClientConfig} S3ProviderOptions
 */

/**
 * Wrapper for Amazon's S3 SDK.
 *
 * @public
 * @extends Disposable
 */
export default class S3Provider extends Disposable {
	#s3;

	#configuration;
	#options;

	#started;

	/**
	 * @param {object=} configuration - The configuration.
	 * @param {string=} configuration.bucket
	 * @param {string=} configuration.folder
	 * @param {S3ProviderOptions=} options - The AWS SDK client configuration.
	 */
	constructor(configuration = { }, options) {
		super();

		assert.argumentIsRequired(configuration, 'configuration', Object);
		assert.argumentIsOptional(configuration.bucket, 'configuration.bucket', String);
		assert.argumentIsOptional(configuration.folder, 'configuration.folder', String);

		assert.argumentIsOptional(options, 'options', Object);

		this.#s3 = null;

		this.#configuration = configuration;
		this.#options = { ...AwsOptions.instance.options, ...options };

		this.#started = false;
	}

	/**
	 * Connects to Amazon. Must be called once before using other instance
	 * functions.
	 *
	 * @public
	 * @async
	 * @returns {Promise<boolean>}
	 */
	async start() {
		if (this.disposed) {
			throw 'Unable to start, the S3 provider has been disposed.';
		}

		if (!this.#started) {
			try {
				this.#s3 = new S3Client(this.#options);

				logger.info('The S3 provider has started');

				this.#started = true;
			} catch (e) {
				logger.error('The S3 provider failed to start', e);

				throw e;
			}
		}

		return this.#started;
	}

	/**
	 * Returns a clone of the S3 configuration data used to make requests.
	 *
	 * @public
	 * @returns {*}
	 */
	getConfiguration() {
		if (this.disposed) {
			throw new Error('The S3 provider has been disposed.');
		}

		return object.clone(this.#configuration);
	}

	/**
	 * Retrieves the contents of a bucket.
	 *
	 * @public
	 * @async
	 * @param {string=} prefix
	 * @param {string=} bucket
	 * @param {number=} maximum
	 * @param {string=} start
	 * @returns {Promise<object[]>}
	 */
	async getBucketContents(prefix, bucket, maximum, start) {
		assert.argumentIsOptional(prefix, 'prefix', String);
		assert.argumentIsOptional(bucket, 'bucket', String);
		assert.argumentIsOptional(maximum, 'maximum', Number);
		assert.argumentIsOptional(start, 'start', String);

		this.#checkReady();

		const getBucketContentsRecursive = async (continuationToken) => {
			const payload = { };

			if (bucket) {
				payload.Bucket = bucket;
			} else {
				payload.Bucket = this.#configuration.bucket;
			}

			if (prefix) {
				payload.Prefix = prefix;
			}

			if (start) {
				payload.StartAfter = start;
			}

			if (continuationToken) {
				payload.ContinuationToken = continuationToken;
			}

			try {
				const data = await this.#s3.send(new ListObjectsV2Command(payload));

				const results = data.Contents.map((item) => {
					const transformed = { };

					transformed.key = item.Key;
					transformed.size = item.Size;

					return transformed;
				});

				if (data.IsTruncated === true) {
					const more = await getBucketContentsRecursive(data.NextContinuationToken);

					return results.concat(more);
				}

				return results;
			} catch (e) {
				logger.error('S3 failed to retrieve bucket contents', e);

				throw e;
			}
		};

		return getBucketContentsRecursive();
	}

	/**
	 * Gets a signed url.
	 *
	 * @public
	 * @async
	 * @param {string} operation
	 * @param {string} key
	 * @param {number=} expires
	 * @returns {Promise<string>}
	 */
	async getSignedUrl(operation, key, expires) {
		assert.argumentIsRequired(operation, 'operation', String);
		assert.argumentIsRequired(key, 'key', String);
		assert.argumentIsOptional(expires, 'expires', Number);

		this.#checkReady();

		const payload = { };

		payload.Bucket = this.#configuration.bucket;
		payload.Key = key;

		const options = { };

		if (is.number(expires)) {
			options.expiresIn = expires;
		}

		try {
			return await getS3SignedUrl(this.#s3, getSignedUrlCommand(operation, payload), options);
		} catch (e) {
			logger.error('S3 failed to get signed url', e);

			throw e;
		}
	}

	/**
	 * Uploads an object, using the bucket (and folder) specified
	 * in the provider's configuration.
	 *
	 * @public
	 * @async
	 * @param {string} filename
	 * @param {string|Buffer|object} content - The content to upload
	 * @param {string=} mimeType - Defaults to "text/plain"
	 * @param {boolean=} secure - Indicates if the "private" ACL applies to the object
	 * @returns {Promise<object>}
	 */
	async upload(filename, content, mimeType, secure) {
		return this.uploadObject(this.#configuration.bucket, S3Provider.getQualifiedFilename(this.#configuration.folder, filename), content, mimeType, secure);
	}

	/**
	 * Uploads an object.
	 *
	 * @public
	 * @async
	 * @param {string} bucket
	 * @param {string} filename
	 * @param {string|Buffer|object} content - The content to upload
	 * @param {string=} mimeType - Defaults to "text/plain"
	 * @param {boolean|string=} secure - Indicates if the "private" ACL applies to the object
	 * @returns {Promise<object>}
	 */
	async uploadObject(bucket, filename, content, mimeType, secure) {
		this.#checkReady();

		let acl;

		if (is.boolean(secure) && secure) {
			acl = 'private';
		} else {
			acl = 'public-read';
		}

		let mimeTypeToUse;

		if (is.string(mimeType)) {
			mimeTypeToUse = mimeType;
		} else if (is.string(content)) {
			mimeTypeToUse = mimeTypes.text;
		} else if (is.object(content)) {
			mimeTypeToUse = mimeTypes.json;
		} else {
			throw new Error('Unable to automatically determine MIME type for file.');
		}

		const params = getParameters(bucket, filename, {
			ACL: acl,
			Body: ContentHandler.getHandlerFor(mimeTypeToUse).toBuffer(content),
			ContentType: mimeTypeToUse
		});

		if (is.string(secure) && secure === 'none') {
			delete params.ACL;
		}

		const options = {
			partSize: 10 * 1024 * 1024,
			queueSize: 1
		};

		const upload = new Upload({
			client: this.#s3,
			params,
			partSize: options.partSize,
			queueSize: options.queueSize
		});

		try {
			const data = await upload.done();

			return { data: data };
		} catch (e) {
			logger.error('S3 failed to upload object', e);

			throw e;
		}
	}

	/**
	 * Uploads an object through the stream.
	 *
	 * @public
	 * @async
	 * @param {string} bucket
	 * @param {string} key
	 * @param {Readable} reader
	 * @returns {Promise<object>}
	 */
	async uploadStream(bucket, key, reader) {
		this.#checkReady();

		return new Upload({
			client: this.#s3,
			params: { Bucket: bucket, Key: key, Body: reader }
		}).done();
	}

	/**
	 * Downloads an object, using the bucket (and folder) specified
	 * in the provider's configuration.
	 *
	 * @public
	 * @async
	 * @param {string} filename
	 * @returns {Promise<object>}
	 */
	async download(filename) {
		return this.downloadObject(this.#configuration.bucket, S3Provider.getQualifiedFilename(this.#configuration.folder, filename));
	}

	/**
	 * Downloads an object.
	 *
	 * @public
	 * @async
	 * @param {string} bucket
	 * @param {string} filename
	 * @returns {Promise<object>}
	 */
	async downloadObject(bucket, filename) {
		this.#checkReady();

		try {
			const data = await this.#s3.send(new GetObjectCommand(getParameters(bucket, filename)));
			const buffer = await data.Body.transformToByteArray();

			return ContentHandler.getHandlerFor(data.ContentType).fromBuffer(Buffer.from(buffer));
		} catch (e) {
			logger.error('S3 failed to get object', e);

			throw e;
		}
	}

	/**
	 * Creates a readable stream for s3 object.
	 *
	 * @public
	 * @async
	 * @param {string} bucket
	 * @param {string} key
	 * @returns {Promise<Readable>}
	 */
	async createReadStream(bucket, key) {
		this.#checkReady();

		const data = await this.#s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

		return data.Body;
	}

	/**
	 * Deletes an object from a bucket.
	 *
	 * @public
	 * @async
	 * @param {string} bucket
	 * @param {string} filename
	 * @returns {Promise<object>}
	 */
	async deleteObject(bucket, filename) {
		this.#checkReady();

		try {
			const data = await this.#s3.send(new DeleteObjectCommand(getParameters(bucket, filename)));

			return { data: data };
		} catch (e) {
			logger.error('S3 failed to delete object', e);

			throw e;
		}
	}

	/**
	 * Returns metadata regarding an object, using the bucket (and folder) specified
	 * in the provider's configuration.
	 *
	 * @public
	 * @async
	 * @param {string} filename
	 * @returns {Promise<object>}
	 */
	async getMetadata(filename) {
		return this.getMetadataObject(this.#configuration.bucket, S3Provider.getQualifiedFilename(this.#configuration.folder, filename));
	}

	/**
	 * Returns metadata regarding an object.
	 *
	 * @public
	 * @async
	 * @param {string} bucket
	 * @param {string} filename
	 * @returns {Promise<object>}
	 */
	async getMetadataObject(bucket, filename) {
		this.#checkReady();

		assert.argumentIsRequired(bucket, 'bucket', String);
		assert.argumentIsRequired(filename, 'filename', String);

		try {
			const data = await this.#s3.send(new HeadObjectCommand(getParameters(bucket, filename)));

			return { data: data };
		} catch (e) {
			logger.error('S3 failed to delete object', e);

			throw e;
		}
	}

	/**
	 * Creates a filename that uses a folder.
	 *
	 * @public
	 * @static
	 * @param {...string|string[]} components
	 * @returns {string}
	 */
	static getQualifiedFilename() {
		const a = arguments;

		return Array.from(arguments).reduce((components, value) => {
			let next = [ ];

			if (is.array(value)) {
				next = value;
			} else if (is.string(value)) {
				next = [ value ];
			}

			return components.concat(
				next
					.join('/')
					.split(/[\\/]/g)
					.filter((component) => {
						return is.string(component) && component.length > 0;
					})
			);
		}, [ ]).join('/');
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[S3Provider]';
	}

	#checkReady() {
		if (this.disposed) {
			throw new Error('The S3 provider has been disposed.');
		}

		if (!this.#started) {
			throw new Error('The S3 provider has not been started.');
		}
	}
}

function getParameters(bucket, filename, additional) {
	return Object.assign(additional || { }, {
		Bucket: bucket,
		Key: S3Provider.getQualifiedFilename(filename)
	});
}

function getSignedUrlCommand(operation, payload) {
	switch (operation) {
		case 'getObject':
			return new GetObjectCommand(payload);
		case 'putObject':
			return new PutObjectCommand(payload);
		case 'deleteObject':
			return new DeleteObjectCommand(payload);
		case 'headObject':
			return new HeadObjectCommand(payload);
		default:
			throw new Error(`Unsupported S3 signed URL operation [ ${operation} ]`);
	}
}

const contentHandlers = [ ];

/**
 * Handles content content.
 */
class ContentHandler {
	constructor() {

	}

	/**
	 * Indicates if the process can be performed.
	 *
	 * @public
	 * @param {string} mimeType - The mime type.
	 * @returns {boolean}
	 */
	canProcess(mimeType) {
		return true;
	}

	/**
	 * Runs the to buffer operation.
	 *
	 * @public
	 * @param {*} content - The content.
	 * @returns {*}
	 */
	toBuffer(content) {
		return Buffer.from(content);
	}

	/**
	 * Runs the from buffer operation.
	 *
	 * @public
	 * @param {Buffer} buffer - The buffer.
	 * @returns {*}
	 */
	fromBuffer(buffer) {
		return buffer;
	}

	/**
	 * Returns the handler for.
	 *
	 * @public
	 * @static
	 * @param {string} mimeType - The mime type.
	 * @returns {*}
	 */
	static getHandlerFor(mimeType) {
		if (contentHandlers.length === 0) {
			contentHandlers.push(new JsonContentHandler());
			contentHandlers.push(new TextContentHandler());
			contentHandlers.push(new DefaultContentHandler());
		}

		return contentHandlers.find(handler => handler.canProcess(mimeType));
	}
}

/**
 * Handles text content content.
 */
class TextContentHandler extends ContentHandler {
	constructor() {
		super();
	}

	/**
	 * Indicates if the process can be performed.
	 *
	 * @public
	 * @param {string} mimeType - The mime type.
	 * @returns {boolean}
	 */
	canProcess(mimeType) {
		return mimeType.startsWith('text');
	}

	/**
	 * Runs the to buffer operation.
	 *
	 * @public
	 * @param {*} content - The content.
	 * @returns {*}
	 */
	toBuffer(content) {
		if (is.string(content)) {
			return Buffer.from(content, encodingTypes.utf8);
		} else {
			return Buffer.from(content);
		}
	}

	/**
	 * Runs the from buffer operation.
	 *
	 * @public
	 * @param {Buffer} buffer - The buffer.
	 * @returns {*}
	 */
	fromBuffer(buffer) {
		return buffer.toString(encodingTypes.utf8);
	}
}

/**
 * Handles json content content.
 */
class JsonContentHandler extends TextContentHandler {
	constructor() {
		super();
	}

	/**
	 * Indicates if the process can be performed.
	 *
	 * @public
	 * @param {string} mimeType - The mime type.
	 * @returns {boolean}
	 */
	canProcess(mimeType) {
		return mimeType === mimeTypes.json;
	}

	/**
	 * Runs the to buffer operation.
	 *
	 * @public
	 * @param {*} content - The content.
	 * @returns {*}
	 */
	toBuffer(content) {
		if (is.object(content)) {
			return super.toBuffer(JSON.stringify(content));
		} else {
			return super.toBuffer(content);
		}
	}

	/**
	 * Runs the from buffer operation.
	 *
	 * @public
	 * @param {Buffer} buffer - The buffer.
	 * @returns {*}
	 */
	fromBuffer(buffer) {
		return JSON.parse(super.fromBuffer(buffer));
	}
}

/**
 * Handles default content content.
 */
class DefaultContentHandler extends ContentHandler {
	constructor() {
		super();
	}
}
