var _ = require('lodash');

var collections = require('./collections/index');
var lang = require('./lang/index');

module.exports = function() {
    'use strict';

    var namespaces = {
        Collections: collections
    };

    return _.merge(lang, namespaces);
}();