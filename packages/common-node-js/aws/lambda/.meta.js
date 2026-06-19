
/**
 * @typedef {import('./LambdaEventParser.js').default} LambdaEventParser
 */

/**
 * @typedef {import('./LambdaResponder.js').default} LambdaResponder
 */
/**
 * A meta namespace containing signatures of anonymous functions.
 *
 * @namespace Callbacks
 */

/**
 * A callback used to execute the Lambda Function's work.
 *
 * @public
 * @callback LambdaProcessorCallback
 * @memberOf Callbacks
 * @param {LambdaEventParser} parser
 * @param {LambdaResponder} responder
 * @returns {Promise<*>|*}
 */