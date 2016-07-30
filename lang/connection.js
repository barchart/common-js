module.exports = (() => {
	'use strict';

	const connection = {
		getIsSecure(secure) {
			return typeof(secure) === 'boolean' && secure;
		}
	};

	return connection;
})();