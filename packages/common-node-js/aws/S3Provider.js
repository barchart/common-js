import * as assert from '@barchart/common-js/lang/assert.js';
import * as is from '@barchart/common-js/lang/is.js';
import * as object from '@barchart/common-js/lang/object.js';

import Disposable from '@barchart/common-js/lang/Disposable.js';

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
 * Wrapper for Amazon's S3 SDK.
 *
 * @public
 * @extends Disposable
 * @param {object} configuration
 * @param {string} configuration.region
 * @param {string=} configuration.apiVersion
 * @param {string=} configuration.bucket
 * @param {string=} configuration.folder
 */
export default class S3Provider extends Disposable {
	constructor(configuration) {
		super();

		assert.argumentIsRequired(configuration, 'configuration');
		assert.argumentIsRequired(configuration.region, 'configuration.region', String);
		assert.argumentIsOptional(configuration.apiVersion, 'configuration.apiVersion', String);
		assert.argumentIsOptional(configuration.bucket, 'configuration.bucket', String);
		assert.argumentIsOptional(configuration.folder, 'configuration.folder', String);

		this._configuration = configuration;

		this._s3 = null;

		this._startPromise = null;
		this._started = false;
	}

	/**
	 * Connects to Amazon. Must be called once before using other instance
	 * functions.
	 *
	 * @public
	 * @async
	 * @returns {Promise<Boolean>}
	 */
	async start() {
		if (this.disposed) {
			return Promise.reject('Unable to start, the S3 provider has been disposed.');
		}

		if (this._startPromise === null) {
			this._startPromise = (async () => {
				try {
					this._s3 = new S3Client({ apiVersion: this._configuration.apiVersion || '2006-03-01', region: this._configuration.region });

					logger.info('The S3 provider has started');

					this._started = true;

					return this._started;
				} catch (e) {
					logger.error('The S3 provider failed to start', e);

					throw e;
				}
			})();
		}

		return this._startPromise;
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

		return object.clone(this._configuration);
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
	 * @returns {Promise<Object[]>}
	 */
	async getBucketContents(prefix, bucket, maximum, start) {
		assert.argumentIsOptional(prefix, 'prefix', String);
		assert.argumentIsOptional(bucket, 'bucket', String);
		assert.argumentIsOptional(maximum, 'maximum', Number);
		assert.argumentIsOptional(start, 'start', String);

		checkReady.call(this);

		const getBucketContentsRecursive = async (continuationToken) => {
			const payload = { };

			if (bucket) {
				payload.Bucket = bucket;
			} else {
				payload.Bucket = this._configuration.bucket;
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
				const data = await this._s3.send(new ListObjectsV2Command(payload));

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
	 * @param {Number=} expires
	 * @returns {Promise<string>}
	 */
	async getSignedUrl(operation, key, expires) {
		assert.argumentIsRequired(operation, 'operation', String);
		assert.argumentIsRequired(key, 'key', String);
		assert.argumentIsOptional(expires, 'expires', Number);

		checkReady.call(this);

		const payload = { };

		payload.Bucket = this._configuration.bucket;
		payload.Key = key;

		const options = { };

		if (is.number(expires)) {
			options.expiresIn = expires;
		}

		try {
			return await getS3SignedUrl(this._s3, getSignedUrlCommand(operation, payload), options);
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
	 * @param {string|Buffer|Object} content - The content to upload
	 * @param {string=} mimeType - Defaults to "text/plain"
	 * @param {boolean=} secure - Indicates if the "private" ACL applies to the object
	 * @returns {Promise<Object>}
	 */
	async upload(filename, content, mimeType, secure) {
		return this.uploadObject(this._configuration.bucket, S3Provider.getQualifiedFilename(this._configuration.folder, filename), content, mimeType, secure);
	}

	/**
	 * Uploads an object.
	 *
	 * @public
	 * @async
	 * @param {string} bucket
	 * @param {string} filename
	 * @param {string|Buffer|Object} content - The content to upload
	 * @param {string=} mimeType - Defaults to "text/plain"
	 * @param {boolean|string=} secure - Indicates if the "private" ACL applies to the object
	 * @returns {Promise<Object>}
	 */
	async uploadObject(bucket, filename, content, mimeType, secure) {
		checkReady.call(this);

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
		} else if (is.object) {
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
			client: this._s3,
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
	 * @param {stream} reader
	 * @return {Promise<Object>}
	 */
	async uploadStream(bucket, key, reader) {
		checkReady.call(this);

		return new Upload({
			client: this._s3,
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
	 * @returns {Promise<Object>}
	 */
	async download(filename) {
		return this.downloadObject(this._configuration.bucket, S3Provider.getQualifiedFilename(this._configuration.folder, filename));
	}

	/**
	 * Downloads an object.
	 *
	 * @public
	 * @async
	 * @param {string} bucket
	 * @param {string} filename
	 * @returns {Promise<Object>}
	 */
	async downloadObject(bucket, filename) {
		checkReady.call(this);

		try {
			const data = await this._s3.send(new GetObjectCommand(getParameters(bucket, filename)));
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
	 * @return {Promise<stream.Readable>}
	 */
	async createReadStream(bucket, key) {
		checkReady.call(this);

		const data = await this._s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));

		return data.Body;
	}

	/**
	 * Deletes an object from a bucket.
	 *
	 * @public
	 * @async
	 * @param {string} bucket
	 * @param {string} filename
	 * @returns {Promise<Object>}
	 */
	async deleteObject(bucket, filename) {
		checkReady.call(this);

		try {
			const data = await this._s3.send(new DeleteObjectCommand(getParameters(bucket, filename)));

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
	 * @returns {Promise<Object>}
	 */
	async getMetadata(filename) {
		return this.getMetadataObject(this._configuration.bucket, S3Provider.getQualifiedFilename(this._configuration.folder, filename));
	}

	/**
	 * Returns metadata regarding an object.
	 *
	 * @public
	 * @async
	 * @param {string} bucket
	 * @param {string} filename
	 * @returns {Promise<Object>}
	 */
	async getMetadataObject(bucket, filename) {
		checkReady.call(this);

		assert.argumentIsRequired(bucket, 'bucket', String);
		assert.argumentIsRequired(filename, 'filename', String);

		try {
			const data = await this._s3.send(new HeadObjectCommand(getParameters(bucket, filename)));

			return { data: data };
		} catch (e) {
			logger.error('S3 failed to delete object', e);

			throw e;
		}
	}

	/**
	 * Creates a filename that uses a folder.
	 *
	 * @static
	 * @public
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
					.split(/[\\\/]/g)
					.filter((component) => {
						return is.string(component) && component.length > 0;
					})
			);
		}, [ ]).join('/');
	}

	toString() {
		return '[S3Provider]';
	}
}

function checkReady() {
	if (this.disposed) {
		throw new Error('The S3 provider has been disposed.');
	}

	if (!this._started) {
		throw new Error('The S3 provider has not been started.');
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

class ContentHandler {
	constructor() {

	}

	canProcess(mimeType) {
		return true;
	}

	toBuffer(content) {
		return Buffer.from(content);
	}

	fromBuffer(buffer) {
		return buffer;
	}

	static getHandlerFor(mimeType) {
		if (contentHandlers.length === 0) {
			contentHandlers.push(new JsonContentHandler());
			contentHandlers.push(new TextContentHandler());
			contentHandlers.push(new DefaultContentHandler());
		}

		return contentHandlers.find(handler => handler.canProcess(mimeType));
	}
}

class TextContentHandler extends ContentHandler {
	constructor() {
		super();
	}

	canProcess(mimeType) {
		return mimeType.startsWith('text');
	}

	toBuffer(content) {
		if (is.string(content)) {
			return Buffer.from(content, encodingTypes.utf8);
		} else {
			return Buffer.from(content);
		}
	}

	fromBuffer(buffer) {
		return buffer.toString(encodingTypes.utf8);
	}
}

class JsonContentHandler extends TextContentHandler {
	constructor() {
		super();
	}

	canProcess(mimeType) {
		return mimeType === mimeTypes.json;
	}

	toBuffer(content) {
		if (is.object(content)) {
			return super.toBuffer(JSON.stringify(content));
		} else {
			return super.toBuffer(content);
		}
	}

	fromBuffer(buffer) {
		return JSON.parse(super.fromBuffer(buffer));
	}
}

class DefaultContentHandler extends ContentHandler {
	constructor() {
		super();
	}
}
