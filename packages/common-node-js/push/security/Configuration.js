/**
 * Static configuration data.
 *
 * @public
 * @ignore
 */
export default class Configuration {
	constructor() {

	}

	/**
	 * The hostname of the REST API for the staging environment (public use allowed).
	 *
	 * @public
	 * @static
	 * @returns {string}
	 */
	static get stagingHost() {
		return 'push-notifications-stage.aws.barchart.com';
	}

	/**
	 * The hostname of the REST API for the production environment (public use allowed).
	 *
	 * @public
	 * @static
	 * @returns {string}
	 */
	static get productionHost() {
		return 'push-notifications.aws.barchart.com';
	}

	/**
	 * The hostname of REST API which generates impersonation tokens for non-secure
	 * test and demo environments.
	 *
	 * @public
	 * @static
	 * @returns {string}
	 */
	static get getJwtImpersonationHost() {
		return 'jwt-public-stage.aws.barchart.com';
	}

	/**
	 * Returns a string representation.
	 *
	 * @public
	 * @returns {string}
	 */
	toString() {
		return '[Configuration]';
	}
}
