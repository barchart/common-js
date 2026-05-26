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