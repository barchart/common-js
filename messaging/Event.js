var _ = require('lodash');

var assert = require('./../lang/assert');
var Disposable = require('./../lang/Disposable');

module.exports = function() {
    'use strict';

    var Event = Disposable.extend({
        init: function(sender) {
            this._sender = sender || null;

            this._observers = [ ];
        },

        register: function(handler) {
            assert.argumentIsRequired(handler, 'handler', Function);

            if (this.getIsDisposed()) {
                throw new Error('The event has been disposed.');
            }

            var that = this;

            addRegistration.call(that, handler);

            return Disposable.fromAction(function() {
                if (that._disposed) {
                    return;
                }

                removeRegistration.call(that, handler);
            });
        },

        fire: function(data) {
            if (this.getIsDisposed()) {
                throw new Error('The event has been disposed.');
            }

            var observers = this._observers;

            for (var i = 0; i < observers.length; i++) {
                var observer = observers[i];

                observer(data, this._sender);
            }
        },

        _onDispose: function() {
            this._observers = null;
        }
    });

    function addRegistration(handler) {
        var copiedObservers = this._observers.slice();

        copiedObservers.push(handler);

        this._observers = copiedObservers;
    }

    function removeRegistration(handler) {
        for (var i = 0; i < this._observers.length; i++) {
            var candidate = this._observers[i];

            if (candidate === handler) {
                var copiedObservers = this._observers.slice();

                copiedObservers.splice(i, 1);

                this._observers = copiedObservers;

                break;
            }
        }
    }

    return Event;
}();