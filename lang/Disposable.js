var Class = require('class.extend');

var assert = require('./assert');

module.exports = function() {
    'use strict';

    var Disposable = Class.extend({
        init: function() {
			this._super();

            this._disposed = false;
        },

        dispose: function() {
            if (this._disposed) {
                return;
            }

            this._disposed = true;

            this._onDispose();
        },

        _onDispose: function() {
            return;
        },

        getIsDisposed: function() {
            return this._disposed || false;
        }
    });

    var DisposableAction = Disposable.extend({
        init: function(disposeAction) {
            this._disposeAction = disposeAction;
        },

        _onDispose: function() {
            this._disposeAction();
            this._disposeAction = null;
        }
    });

    Disposable.fromAction = function(disposeAction) {
        assert.argumentIsRequired(disposeAction, 'disposeAction', Function);

        return new DisposableAction(disposeAction);
    };

    return Disposable;
}();