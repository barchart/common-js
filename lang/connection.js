module.exports = (() => {
	'use strict';

	const connection = {
		getIsSecure: function(secure) {
			return typeof(secure) === 'boolean' && secure;
		}
	};

	return connection;
})();