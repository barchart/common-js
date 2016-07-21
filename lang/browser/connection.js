var assert = require('./../assert');

module.exports = (() => {
	'use strict';

	const connection = {
		getIsSecure: (secure) => {
			let returnVal;

			if (typeof (secure) === 'boolean') {
				returnVal = secure;
			} else {
				let protocol;

				if (window && window.location && typeof(window.location.protocol) === 'string') {
					protocol = window.location.protocol;
				} else if (document && document.location && typeof(document.location.protocol) === 'string') {
					protocol = document.location.protocol;
				} else {
					protocol = '';
				}

				returnVal = protocol.startsWith('https');
			}

			return returnVal;
		}
	};

	return connection;
})();