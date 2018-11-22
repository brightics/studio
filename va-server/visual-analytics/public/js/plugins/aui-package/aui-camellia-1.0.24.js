/*aui-camellia-v1.0.24 built on 2017-11-03, 2:34:25 PM */

/**
 * @author Sangjin Nam <sangjiny.nam@samsung.com>
 * @author Sewon Park <sewoni.park@samsung.com>
 * @author Sunjoong Kim <sunjoong.kim@samsung.com>
 * @author Sujeong Kim <sujeong0521.kim@samsung.com>
 * @author Sangwoo Kang <swoo.kang@samsung.com>
 */

/* End User License Agreement

Samsung SDS CamelliaJS 1.0.0

Copyright (C) 2015 Samsung SDS Co., Ltd. All Rights Reserved

IMPORTANT- READ CAREFULLY:
This license agreement governs Samsung SDS CamelliaJS 1.0.0 ("Software").  By installing Software, you enter into the terms of this binding contract between you ("you" or "User") and Samsung SDS Co., Ltd.
If you do not agree with the terms of this license, exit the installation of Software.
Installation of the Software constitutes acceptance of the terms of this License Agreement.

DEFINITIONS

In this End User License Agreement, unless the contrary intention appears:

"EULA" means this End User License Agreement.
"Licensor" means Samsung SDS Co., Ltd.
"Licensee" means YOU, or the organization (if any) on whose behalf YOU are taking the EULA.
"SOFTWARE PRODUCT" or "SOFTWARE" means Samsung SDS CamelliaJS 1.0.0 which includes computer software and associated media and printed materials, and may include online or electronic documentation.

GRANT OF LICENSE

Subject to the terms and conditions of this Agreement, Licensor hereby grants you a limited, nonexclusive license to install and use the object code version of the Software, a copy of which is provided herewith, on a single personal computer.

ADDITIONAL RIGHTS AND LIMITATIONS

You must retain all copyright and related notices of Licensor's ownership and other rights in the Software in the product, labeling and documentation provided.
you may not modify, translate, de-compile, reverse engineer, disassemble or otherwise decode the Software.
you may not copy any of the Software other than as reasonably required for your own personal use of the Software in accordance with this Agreement.
you may not sublicense, sell, rent, lend, transfer, post, transmit, distribute or otherwise make the Software available to anyone else, except that you may permanently transfer the Software and accompanying materials provided you retain no copies and the recipient agrees to the terms of this Agreement.

ASSIGNMENT

YOU may only assign all your rights and obligations under this EULA to another party if YOU supply to the transferee a copy of this EULA and all other documentation including proof of ownership. Your license is then terminated.

TERMINATION

Without prejudice to any other rights, Licensor may terminate this EULA if YOU fail to comply with the terms and conditions. Upon termination YOU or YOUR representative shall destroy all copies of the SOFTWARE PRODUCT and all of its component parts or otherwise return or dispose of such material in the manner directed by Licensor.


LIMITATION OF LIABILITY
IN NO EVENT WILL LICENSOR BE LIABLE FOR ANY DAMAGES, INCLUDING LOSS OF DATA, LOST OPPORTUNITY OR PROFITS, COST OF COVER OR ANY SPECIAL, INCIDENTAL, CONSEQUENTIAL, DIRECT OR INDIRECT DAMAGES ARISING FROM OR RELATING TO THE USE OF THE SOFTWARE, HOWEVER CAUSED ON ANY THEORY OF LIABILITY.  THIS LIMITATION WILL APPLY EVEN IF LICENSOR HAS BEEN ADVISED OR GIVEN NOTICE OF THE POSSIBILITY OF SUCH DAMAGE.  THE ENTIRE RISK AS TO THE USE OF THE SOFTWARE IS ASSUMED BY THE USER. BECAUSE SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CERTAIN INCIDENTAL, CONSEQUENTIAL OR OTHER DAMAGES, THIS LIMITATION MAY NOT APPLY TO YOU.


DISCLAIMER OF WARRANTY
TO THE EXTENT PERMITTED BY APPLICABLE LAW ALL LICENSOR SOFTWARE, INCLUDING THE IMAGES AND/OR COMPONENTS, IS PROVIDED "AS IS" AND WITHOUT EXPRESS OR IMPLIED WARRANTY OF ANY KIND BY EITHER LICENSOR OR ANYONE ELSE WHO HAS BEEN INVOLVED IN THE CREATION, PRODUCTION OR DELIVERY OF SUCH SOFTWARE, INCLUDING BUT NOT LIMITED TO ANY IMPLIED WARRANTY OF MERCHANTABILITY, NONINFRINGEMENT OR FITNESS FOR A PARTICULAR PURPOSE.  NO COVENANTS, WARRANTIES OR INDEMNITIES OF ANY KIND ARE GRANTED BY LICENSOR TO THE USER.

TRADEMARKS

All names of products and companies used in this EULA, the SOFTWARE PRODUCT, or the enclosed documentation may be trademarks of their corresponding owners. Their use in this EULA is intended to be in compliance with the respective guidelines and licenses.

 */


(function() {
    "use strict";
    function lib$rsvp$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$rsvp$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$rsvp$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$rsvp$utils$$_isArray;
    if (!Array.isArray) {
      lib$rsvp$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$rsvp$utils$$_isArray = Array.isArray;
    }

    var lib$rsvp$utils$$isArray = lib$rsvp$utils$$_isArray;

    var lib$rsvp$utils$$now = Date.now || function() { return new Date().getTime(); };

    function lib$rsvp$utils$$F() { }

    var lib$rsvp$utils$$o_create = (Object.create || function (o) {
      if (arguments.length > 1) {
        throw new Error('Second argument not supported');
      }
      if (typeof o !== 'object') {
        throw new TypeError('Argument must be an object');
      }
      lib$rsvp$utils$$F.prototype = o;
      return new lib$rsvp$utils$$F();
    });
    function lib$rsvp$events$$indexOf(callbacks, callback) {
      for (var i=0, l=callbacks.length; i<l; i++) {
        if (callbacks[i] === callback) { return i; }
      }

          return -1;
    }

    function lib$rsvp$events$$callbacksFor(object) {
      var callbacks = object._promiseCallbacks;

          if (!callbacks) {
        callbacks = object._promiseCallbacks = {};
      }

          return callbacks;
    }

    var lib$rsvp$events$$default = {

      'mixin': function(object) {
        object['on']      = this['on'];
        object['off']     = this['off'];
        object['trigger'] = this['trigger'];
        object._promiseCallbacks = undefined;
        return object;
      },

      'on': function(eventName, callback) {
        if (typeof callback !== 'function') {
          throw new TypeError('Callback must be a function');
        }

            var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks;

            callbacks = allCallbacks[eventName];

            if (!callbacks) {
          callbacks = allCallbacks[eventName] = [];
        }

            if (lib$rsvp$events$$indexOf(callbacks, callback) === -1) {
          callbacks.push(callback);
        }
      },

      'off': function(eventName, callback) {
        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks, index;

            if (!callback) {
          allCallbacks[eventName] = [];
          return;
        }

            callbacks = allCallbacks[eventName];

            index = lib$rsvp$events$$indexOf(callbacks, callback);

            if (index !== -1) { callbacks.splice(index, 1); }
      },

      'trigger': function(eventName, options, label) {
        var allCallbacks = lib$rsvp$events$$callbacksFor(this), callbacks, callback;

            if (callbacks = allCallbacks[eventName]) {
          for (var i=0; i<callbacks.length; i++) {
            callback = callbacks[i];

                callback(options, label);
          }
        }
      }
    };

    var lib$rsvp$config$$config = {
      instrument: false
    };

    lib$rsvp$events$$default['mixin'](lib$rsvp$config$$config);

    function lib$rsvp$config$$configure(name, value) {
      if (name === 'onerror') {
        lib$rsvp$config$$config['on']('error', value);
        return;
      }

          if (arguments.length === 2) {
        lib$rsvp$config$$config[name] = value;
      } else {
        return lib$rsvp$config$$config[name];
      }
    }

    var lib$rsvp$instrument$$queue = [];

    function lib$rsvp$instrument$$scheduleFlush() {
      setTimeout(function() {
        var entry;
        for (var i = 0; i < lib$rsvp$instrument$$queue.length; i++) {
          entry = lib$rsvp$instrument$$queue[i];

              var payload = entry.payload;

              payload.guid = payload.key + payload.id;
          payload.childGuid = payload.key + payload.childId;
          if (payload.error) {
            payload.stack = payload.error.stack;
          }

              lib$rsvp$config$$config['trigger'](entry.name, entry.payload);
        }
        lib$rsvp$instrument$$queue.length = 0;
      }, 50);
    }

    function lib$rsvp$instrument$$instrument(eventName, promise, child) {
      if (1 === lib$rsvp$instrument$$queue.push({
        name: eventName,
        payload: {
          key: promise._guidKey,
          id:  promise._id,
          eventName: eventName,
          detail: promise._result,
          childId: child && child._id,
          label: promise._label,
          timeStamp: lib$rsvp$utils$$now(),
          error: lib$rsvp$config$$config["instrument-with-stack"] ? new Error(promise._label) : null
        }})) {
          lib$rsvp$instrument$$scheduleFlush();
        }
      }
    var lib$rsvp$instrument$$default = lib$rsvp$instrument$$instrument;
    function lib$rsvp$then$$then(onFulfillment, onRejection, label) {
      var parent = this;
      var state = parent._state;

          if (state === lib$rsvp$$internal$$FULFILLED && !onFulfillment || state === lib$rsvp$$internal$$REJECTED && !onRejection) {
        lib$rsvp$config$$config.instrument && lib$rsvp$instrument$$default('chained', parent, parent);
        return parent;
      }

          parent._onError = null;

          var child = new parent.constructor(lib$rsvp$$internal$$noop, label);
      var result = parent._result;

          lib$rsvp$config$$config.instrument && lib$rsvp$instrument$$default('chained', parent, child);

          if (state) {
        var callback = arguments[state - 1];
        lib$rsvp$config$$config.async(function(){
          lib$rsvp$$internal$$invokeCallback(state, child, callback, result);
        });
      } else {
        lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection);
      }

          return child;
    }
    var lib$rsvp$then$$default = lib$rsvp$then$$then;
    function lib$rsvp$promise$resolve$$resolve(object, label) {
      var Constructor = this;

          if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

          var promise = new Constructor(lib$rsvp$$internal$$noop, label);
      lib$rsvp$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$rsvp$promise$resolve$$default = lib$rsvp$promise$resolve$$resolve;
    function lib$rsvp$enumerator$$makeSettledResult(state, position, value) {
      if (state === lib$rsvp$$internal$$FULFILLED) {
        return {
          state: 'fulfilled',
          value: value
        };
      } else {
         return {
          state: 'rejected',
          reason: value
        };
      }
    }

    function lib$rsvp$enumerator$$Enumerator(Constructor, input, abortOnReject, label) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(lib$rsvp$$internal$$noop, label);
      this._abortOnReject = abortOnReject;

          if (this._validateInput(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

            this._init();

            if (this.length === 0) {
          lib$rsvp$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            lib$rsvp$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        lib$rsvp$$internal$$reject(this.promise, this._validationError());
      }
    }

    var lib$rsvp$enumerator$$default = lib$rsvp$enumerator$$Enumerator;

    lib$rsvp$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$rsvp$utils$$isArray(input);
    };

    lib$rsvp$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$rsvp$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    lib$rsvp$enumerator$$Enumerator.prototype._enumerate = function() {
      var length     = this.length;
      var promise    = this.promise;
      var input      = this._input;

          for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._settleMaybeThenable = function(entry, i) {
      var c = this._instanceConstructor;
      var resolve = c.resolve;

          if (resolve === lib$rsvp$promise$resolve$$default) {
        var then = lib$rsvp$$internal$$getThen(entry);

            if (then === lib$rsvp$then$$default &&
            entry._state !== lib$rsvp$$internal$$PENDING) {
          entry._onError = null;
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof then !== 'function') {
          this._remaining--;
          this._result[i] = this._makeResult(lib$rsvp$$internal$$FULFILLED, i, entry);
        } else if (c === lib$rsvp$promise$$default) {
          var promise = new c(lib$rsvp$$internal$$noop);
          lib$rsvp$$internal$$handleMaybeThenable(promise, entry, then);
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function(resolve) { resolve(entry); }), i);
        }
      } else {
        this._willSettleAt(resolve(entry), i);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      if (lib$rsvp$utils$$isMaybeThenable(entry)) {
        this._settleMaybeThenable(entry, i);
      } else {
        this._remaining--;
        this._result[i] = this._makeResult(lib$rsvp$$internal$$FULFILLED, i, entry);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

          if (promise._state === lib$rsvp$$internal$$PENDING) {
        this._remaining--;

            if (this._abortOnReject && state === lib$rsvp$$internal$$REJECTED) {
          lib$rsvp$$internal$$reject(promise, value);
        } else {
          this._result[i] = this._makeResult(state, i, value);
        }
      }

          if (this._remaining === 0) {
        lib$rsvp$$internal$$fulfill(promise, this._result);
      }
    };

    lib$rsvp$enumerator$$Enumerator.prototype._makeResult = function(state, i, value) {
      return value;
    };

    lib$rsvp$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

          lib$rsvp$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$rsvp$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$rsvp$$internal$$REJECTED, i, reason);
      });
    };
    function lib$rsvp$promise$all$$all(entries, label) {
      return new lib$rsvp$enumerator$$default(this, entries, true , label).promise;
    }
    var lib$rsvp$promise$all$$default = lib$rsvp$promise$all$$all;
    function lib$rsvp$promise$race$$race(entries, label) {
      var Constructor = this;

          var promise = new Constructor(lib$rsvp$$internal$$noop, label);

          if (!lib$rsvp$utils$$isArray(entries)) {
        lib$rsvp$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

          var length = entries.length;

          function onFulfillment(value) {
        lib$rsvp$$internal$$resolve(promise, value);
      }

          function onRejection(reason) {
        lib$rsvp$$internal$$reject(promise, reason);
      }

          for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        lib$rsvp$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

          return promise;
    }
    var lib$rsvp$promise$race$$default = lib$rsvp$promise$race$$race;
    function lib$rsvp$promise$reject$$reject(reason, label) {
      var Constructor = this;
      var promise = new Constructor(lib$rsvp$$internal$$noop, label);
      lib$rsvp$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$rsvp$promise$reject$$default = lib$rsvp$promise$reject$$reject;

    var lib$rsvp$promise$$guidKey = 'rsvp_' + lib$rsvp$utils$$now() + '-';
    var lib$rsvp$promise$$counter = 0;

    function lib$rsvp$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$rsvp$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    function lib$rsvp$promise$$Promise(resolver, label) {
      this._id = lib$rsvp$promise$$counter++;
      this._label = label;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

          lib$rsvp$config$$config.instrument && lib$rsvp$instrument$$default('created', this);

          if (lib$rsvp$$internal$$noop !== resolver) {
        typeof resolver !== 'function' && lib$rsvp$promise$$needsResolver();
        this instanceof lib$rsvp$promise$$Promise ? lib$rsvp$$internal$$initializePromise(this, resolver) : lib$rsvp$promise$$needsNew();
      }
    }

    var lib$rsvp$promise$$default = lib$rsvp$promise$$Promise;

    lib$rsvp$promise$$Promise.cast = lib$rsvp$promise$resolve$$default;
    lib$rsvp$promise$$Promise.all = lib$rsvp$promise$all$$default;
    lib$rsvp$promise$$Promise.race = lib$rsvp$promise$race$$default;
    lib$rsvp$promise$$Promise.resolve = lib$rsvp$promise$resolve$$default;
    lib$rsvp$promise$$Promise.reject = lib$rsvp$promise$reject$$default;

    lib$rsvp$promise$$Promise.prototype = {
      constructor: lib$rsvp$promise$$Promise,

          _guidKey: lib$rsvp$promise$$guidKey,

          _onError: function (reason) {
        var promise = this;
        lib$rsvp$config$$config.after(function() {
          if (promise._onError) {
            lib$rsvp$config$$config['trigger']('error', reason, promise._label);
          }
        });
      },

      then: lib$rsvp$then$$default,

      'catch': function(onRejection, label) {
        return this.then(undefined, onRejection, label);
      },

      'finally': function(callback, label) {
        var promise = this;
        var constructor = promise.constructor;

            return promise.then(function(value) {
          return constructor.resolve(callback()).then(function() {
            return value;
          });
        }, function(reason) {
          return constructor.resolve(callback()).then(function() {
            return constructor.reject(reason);
          });
        }, label);
      }
    };
    function  lib$rsvp$$internal$$withOwnPromise() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$rsvp$$internal$$noop() {}

    var lib$rsvp$$internal$$PENDING   = void 0;
    var lib$rsvp$$internal$$FULFILLED = 1;
    var lib$rsvp$$internal$$REJECTED  = 2;

    var lib$rsvp$$internal$$GET_THEN_ERROR = new lib$rsvp$$internal$$ErrorObject();

    function lib$rsvp$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$rsvp$$internal$$GET_THEN_ERROR.error = error;
        return lib$rsvp$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$rsvp$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$rsvp$$internal$$handleForeignThenable(promise, thenable, then) {
      lib$rsvp$config$$config.async(function(promise) {
        var sealed = false;
        var error = lib$rsvp$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$rsvp$$internal$$resolve(promise, value, undefined);
          } else {
            lib$rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

              lib$rsvp$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

            if (!sealed && error) {
          sealed = true;
          lib$rsvp$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$rsvp$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$rsvp$$internal$$FULFILLED) {
        lib$rsvp$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$rsvp$$internal$$REJECTED) {
        thenable._onError = null;
        lib$rsvp$$internal$$reject(promise, thenable._result);
      } else {
        lib$rsvp$$internal$$subscribe(thenable, undefined, function(value) {
          if (thenable !== value) {
            lib$rsvp$$internal$$resolve(promise, value, undefined);
          } else {
            lib$rsvp$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          lib$rsvp$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$rsvp$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
      if (maybeThenable.constructor === promise.constructor &&
          then === lib$rsvp$then$$default &&
          constructor.resolve === lib$rsvp$promise$resolve$$default) {
        lib$rsvp$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        if (then === lib$rsvp$$internal$$GET_THEN_ERROR) {
          lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$rsvp$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$rsvp$utils$$isFunction(then)) {
          lib$rsvp$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$rsvp$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$rsvp$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$rsvp$$internal$$fulfill(promise, value);
      } else if (lib$rsvp$utils$$objectOrFunction(value)) {
        lib$rsvp$$internal$$handleMaybeThenable(promise, value, lib$rsvp$$internal$$getThen(value));
      } else {
        lib$rsvp$$internal$$fulfill(promise, value);
      }
    }

    function lib$rsvp$$internal$$publishRejection(promise) {
      if (promise._onError) {
        promise._onError(promise._result);
      }

          lib$rsvp$$internal$$publish(promise);
    }

    function lib$rsvp$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$rsvp$$internal$$PENDING) { return; }

          promise._result = value;
      promise._state = lib$rsvp$$internal$$FULFILLED;

          if (promise._subscribers.length === 0) {
        if (lib$rsvp$config$$config.instrument) {
          lib$rsvp$instrument$$default('fulfilled', promise);
        }
      } else {
        lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, promise);
      }
    }

    function lib$rsvp$$internal$$reject(promise, reason) {
      if (promise._state !== lib$rsvp$$internal$$PENDING) { return; }
      promise._state = lib$rsvp$$internal$$REJECTED;
      promise._result = reason;
      lib$rsvp$config$$config.async(lib$rsvp$$internal$$publishRejection, promise);
    }

    function lib$rsvp$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

          parent._onError = null;

          subscribers[length] = child;
      subscribers[length + lib$rsvp$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$rsvp$$internal$$REJECTED]  = onRejection;

          if (length === 0 && parent._state) {
        lib$rsvp$config$$config.async(lib$rsvp$$internal$$publish, parent);
      }
    }

    function lib$rsvp$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

          if (lib$rsvp$config$$config.instrument) {
        lib$rsvp$instrument$$default(settled === lib$rsvp$$internal$$FULFILLED ? 'fulfilled' : 'rejected', promise);
      }

          if (subscribers.length === 0) { return; }

          var child, callback, detail = promise._result;

          for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

            if (child) {
          lib$rsvp$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

          promise._subscribers.length = 0;
    }

    function lib$rsvp$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$rsvp$$internal$$TRY_CATCH_ERROR = new lib$rsvp$$internal$$ErrorObject();

    function lib$rsvp$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$rsvp$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$rsvp$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$rsvp$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$rsvp$utils$$isFunction(callback),
          value, error, succeeded, failed;

          if (hasCallback) {
        value = lib$rsvp$$internal$$tryCatch(callback, detail);

            if (value === lib$rsvp$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

            if (promise === value) {
          lib$rsvp$$internal$$reject(promise, lib$rsvp$$internal$$withOwnPromise());
          return;
        }

          } else {
        value = detail;
        succeeded = true;
      }

          if (promise._state !== lib$rsvp$$internal$$PENDING) {
      } else if (hasCallback && succeeded) {
        lib$rsvp$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$rsvp$$internal$$reject(promise, error);
      } else if (settled === lib$rsvp$$internal$$FULFILLED) {
        lib$rsvp$$internal$$fulfill(promise, value);
      } else if (settled === lib$rsvp$$internal$$REJECTED) {
        lib$rsvp$$internal$$reject(promise, value);
      }
    }

    function lib$rsvp$$internal$$initializePromise(promise, resolver) {
      var resolved = false;
      try {
        resolver(function resolvePromise(value){
          if (resolved) { return; }
          resolved = true;
          lib$rsvp$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          if (resolved) { return; }
          resolved = true;
          lib$rsvp$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$rsvp$$internal$$reject(promise, e);
      }
    }

    function lib$rsvp$all$settled$$AllSettled(Constructor, entries, label) {
      this._superConstructor(Constructor, entries, false , label);
    }

    lib$rsvp$all$settled$$AllSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
    lib$rsvp$all$settled$$AllSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$all$settled$$AllSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;
    lib$rsvp$all$settled$$AllSettled.prototype._validationError = function() {
      return new Error('allSettled must be called with an array');
    };

    function lib$rsvp$all$settled$$allSettled(entries, label) {
      return new lib$rsvp$all$settled$$AllSettled(lib$rsvp$promise$$default, entries, label).promise;
    }
    var lib$rsvp$all$settled$$default = lib$rsvp$all$settled$$allSettled;
    function lib$rsvp$all$$all(array, label) {
      return lib$rsvp$promise$$default.all(array, label);
    }
    var lib$rsvp$all$$default = lib$rsvp$all$$all;
    var lib$rsvp$asap$$len = 0;
    var lib$rsvp$asap$$toString = {}.toString;
    var lib$rsvp$asap$$vertxNext;
    function lib$rsvp$asap$$asap(callback, arg) {
      lib$rsvp$asap$$queue[lib$rsvp$asap$$len] = callback;
      lib$rsvp$asap$$queue[lib$rsvp$asap$$len + 1] = arg;
      lib$rsvp$asap$$len += 2;
      if (lib$rsvp$asap$$len === 2) {
        lib$rsvp$asap$$scheduleFlush();
      }
    }

    var lib$rsvp$asap$$default = lib$rsvp$asap$$asap;

    var lib$rsvp$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$rsvp$asap$$browserGlobal = lib$rsvp$asap$$browserWindow || {};
    var lib$rsvp$asap$$BrowserMutationObserver = lib$rsvp$asap$$browserGlobal.MutationObserver || lib$rsvp$asap$$browserGlobal.WebKitMutationObserver;
    var lib$rsvp$asap$$isNode = typeof self === 'undefined' &&
      typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    var lib$rsvp$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    function lib$rsvp$asap$$useNextTick() {
      var nextTick = process.nextTick;
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$rsvp$asap$$flush);
      };
    }

    function lib$rsvp$asap$$useVertxTimer() {
      return function() {
        lib$rsvp$asap$$vertxNext(lib$rsvp$asap$$flush);
      };
    }

    function lib$rsvp$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$rsvp$asap$$BrowserMutationObserver(lib$rsvp$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

          return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    function lib$rsvp$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$rsvp$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$rsvp$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$rsvp$asap$$flush, 1);
      };
    }

    var lib$rsvp$asap$$queue = new Array(1000);
    function lib$rsvp$asap$$flush() {
      for (var i = 0; i < lib$rsvp$asap$$len; i+=2) {
        var callback = lib$rsvp$asap$$queue[i];
        var arg = lib$rsvp$asap$$queue[i+1];

            callback(arg);

            lib$rsvp$asap$$queue[i] = undefined;
        lib$rsvp$asap$$queue[i+1] = undefined;
      }

          lib$rsvp$asap$$len = 0;
    }

    function lib$rsvp$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$rsvp$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$rsvp$asap$$useVertxTimer();
      } catch(e) {
        return lib$rsvp$asap$$useSetTimeout();
      }
    }

    var lib$rsvp$asap$$scheduleFlush;
    if (lib$rsvp$asap$$isNode) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useNextTick();
    } else if (lib$rsvp$asap$$BrowserMutationObserver) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMutationObserver();
    } else if (lib$rsvp$asap$$isWorker) {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useMessageChannel();
    } else if (lib$rsvp$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$attemptVertex();
    } else {
      lib$rsvp$asap$$scheduleFlush = lib$rsvp$asap$$useSetTimeout();
    }
    function lib$rsvp$defer$$defer(label) {
      var deferred = {};

          deferred['promise'] = new lib$rsvp$promise$$default(function(resolve, reject) {
        deferred['resolve'] = resolve;
        deferred['reject'] = reject;
      }, label);

          return deferred;
    }
    var lib$rsvp$defer$$default = lib$rsvp$defer$$defer;


    function lib$rsvp$filter$$resolveAll(promises, label) {
      return lib$rsvp$promise$$default.all(promises, label);
    }

    function lib$rsvp$filter$$resolveSingle(promise, label) {
      return lib$rsvp$promise$$default.resolve(promise, label).then(function(promises){
        return lib$rsvp$filter$$resolveAll(promises, label);
      });
    }

    function lib$rsvp$filter$$filter(promises, filterFn, label) {
      var promise = lib$rsvp$utils$$isArray(promises) ? lib$rsvp$filter$$resolveAll(promises, label) : lib$rsvp$filter$$resolveSingle(promises, label);
      return promise.then(function(values) {
        if (!lib$rsvp$utils$$isFunction(filterFn)) {
          throw new TypeError("You must pass a function as filter's second argument.");
        }

            var length = values.length;
        var filtered = new Array(length);

            for (var i = 0; i < length; i++) {
          filtered[i] = filterFn(values[i]);
        }

            return lib$rsvp$filter$$resolveAll(filtered, label).then(function(filtered) {
          var results = new Array(length);
          var newLength = 0;

              for (var i = 0; i < length; i++) {
            if (filtered[i]) {
              results[newLength] = values[i];
              newLength++;
            }
          }

              results.length = newLength;

              return results;
        });
      });
    }
    var lib$rsvp$filter$$default = lib$rsvp$filter$$filter;

    function lib$rsvp$promise$hash$$PromiseHash(Constructor, object, label) {
      this._superConstructor(Constructor, object, true, label);
    }

    var lib$rsvp$promise$hash$$default = lib$rsvp$promise$hash$$PromiseHash;

    lib$rsvp$promise$hash$$PromiseHash.prototype = lib$rsvp$utils$$o_create(lib$rsvp$enumerator$$default.prototype);
    lib$rsvp$promise$hash$$PromiseHash.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$promise$hash$$PromiseHash.prototype._init = function() {
      this._result = {};
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._validateInput = function(input) {
      return input && typeof input === 'object';
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._validationError = function() {
      return new Error('Promise.hash must be called with an object');
    };

    lib$rsvp$promise$hash$$PromiseHash.prototype._enumerate = function() {
      var enumerator = this;
      var promise    = enumerator.promise;
      var input      = enumerator._input;
      var results    = [];

          for (var key in input) {
        if (promise._state === lib$rsvp$$internal$$PENDING && Object.prototype.hasOwnProperty.call(input, key)) {
          results.push({
            position: key,
            entry: input[key]
          });
        }
      }

          var length = results.length;
      enumerator._remaining = length;
      var result;

          for (var i = 0; promise._state === lib$rsvp$$internal$$PENDING && i < length; i++) {
        result = results[i];
        enumerator._eachEntry(result.entry, result.position);
      }
    };

    function lib$rsvp$hash$settled$$HashSettled(Constructor, object, label) {
      this._superConstructor(Constructor, object, false, label);
    }

    lib$rsvp$hash$settled$$HashSettled.prototype = lib$rsvp$utils$$o_create(lib$rsvp$promise$hash$$default.prototype);
    lib$rsvp$hash$settled$$HashSettled.prototype._superConstructor = lib$rsvp$enumerator$$default;
    lib$rsvp$hash$settled$$HashSettled.prototype._makeResult = lib$rsvp$enumerator$$makeSettledResult;

    lib$rsvp$hash$settled$$HashSettled.prototype._validationError = function() {
      return new Error('hashSettled must be called with an object');
    };

    function lib$rsvp$hash$settled$$hashSettled(object, label) {
      return new lib$rsvp$hash$settled$$HashSettled(lib$rsvp$promise$$default, object, label).promise;
    }
    var lib$rsvp$hash$settled$$default = lib$rsvp$hash$settled$$hashSettled;
    function lib$rsvp$hash$$hash(object, label) {
      return new lib$rsvp$promise$hash$$default(lib$rsvp$promise$$default, object, label).promise;
    }
    var lib$rsvp$hash$$default = lib$rsvp$hash$$hash;
    function lib$rsvp$map$$map(promises, mapFn, label) {
      return lib$rsvp$promise$$default.all(promises, label).then(function(values) {
        if (!lib$rsvp$utils$$isFunction(mapFn)) {
          throw new TypeError("You must pass a function as map's second argument.");
        }

            var length = values.length;
        var results = new Array(length);

            for (var i = 0; i < length; i++) {
          results[i] = mapFn(values[i]);
        }

            return lib$rsvp$promise$$default.all(results, label);
      });
    }
    var lib$rsvp$map$$default = lib$rsvp$map$$map;

    function lib$rsvp$node$$Result() {
      this.value = undefined;
    }

    var lib$rsvp$node$$ERROR = new lib$rsvp$node$$Result();
    var lib$rsvp$node$$GET_THEN_ERROR = new lib$rsvp$node$$Result();

    function lib$rsvp$node$$getThen(obj) {
      try {
       return obj.then;
      } catch(error) {
        lib$rsvp$node$$ERROR.value= error;
        return lib$rsvp$node$$ERROR;
      }
    }


    function lib$rsvp$node$$tryApply(f, s, a) {
      try {
        f.apply(s, a);
      } catch(error) {
        lib$rsvp$node$$ERROR.value = error;
        return lib$rsvp$node$$ERROR;
      }
    }

    function lib$rsvp$node$$makeObject(_, argumentNames) {
      var obj = {};
      var name;
      var i;
      var length = _.length;
      var args = new Array(length);

          for (var x = 0; x < length; x++) {
        args[x] = _[x];
      }

          for (i = 0; i < argumentNames.length; i++) {
        name = argumentNames[i];
        obj[name] = args[i + 1];
      }

          return obj;
    }

    function lib$rsvp$node$$arrayResult(_) {
      var length = _.length;
      var args = new Array(length - 1);

          for (var i = 1; i < length; i++) {
        args[i - 1] = _[i];
      }

          return args;
    }

    function lib$rsvp$node$$wrapThenable(then, promise) {
      return {
        then: function(onFulFillment, onRejection) {
          return then.call(promise, onFulFillment, onRejection);
        }
      };
    }

    function lib$rsvp$node$$denodeify(nodeFunc, options) {
      var fn = function() {
        var self = this;
        var l = arguments.length;
        var args = new Array(l + 1);
        var arg;
        var promiseInput = false;

            for (var i = 0; i < l; ++i) {
          arg = arguments[i];

              if (!promiseInput) {
            promiseInput = lib$rsvp$node$$needsPromiseInput(arg);
            if (promiseInput === lib$rsvp$node$$GET_THEN_ERROR) {
              var p = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);
              lib$rsvp$$internal$$reject(p, lib$rsvp$node$$GET_THEN_ERROR.value);
              return p;
            } else if (promiseInput && promiseInput !== true) {
              arg = lib$rsvp$node$$wrapThenable(promiseInput, arg);
            }
          }
          args[i] = arg;
        }

            var promise = new lib$rsvp$promise$$default(lib$rsvp$$internal$$noop);

            args[l] = function(err, val) {
          if (err)
            lib$rsvp$$internal$$reject(promise, err);
          else if (options === undefined)
            lib$rsvp$$internal$$resolve(promise, val);
          else if (options === true)
            lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$arrayResult(arguments));
          else if (lib$rsvp$utils$$isArray(options))
            lib$rsvp$$internal$$resolve(promise, lib$rsvp$node$$makeObject(arguments, options));
          else
            lib$rsvp$$internal$$resolve(promise, val);
        };

            if (promiseInput) {
          return lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self);
        } else {
          return lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self);
        }
      };

          fn.__proto__ = nodeFunc;

          return fn;
    }

    var lib$rsvp$node$$default = lib$rsvp$node$$denodeify;

    function lib$rsvp$node$$handleValueInput(promise, args, nodeFunc, self) {
      var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
      if (result === lib$rsvp$node$$ERROR) {
        lib$rsvp$$internal$$reject(promise, result.value);
      }
      return promise;
    }

    function lib$rsvp$node$$handlePromiseInput(promise, args, nodeFunc, self){
      return lib$rsvp$promise$$default.all(args).then(function(args){
        var result = lib$rsvp$node$$tryApply(nodeFunc, self, args);
        if (result === lib$rsvp$node$$ERROR) {
          lib$rsvp$$internal$$reject(promise, result.value);
        }
        return promise;
      });
    }

    function lib$rsvp$node$$needsPromiseInput(arg) {
      if (arg && typeof arg === 'object') {
        if (arg.constructor === lib$rsvp$promise$$default) {
          return true;
        } else {
          return lib$rsvp$node$$getThen(arg);
        }
      } else {
        return false;
      }
    }
    var lib$rsvp$platform$$platform;

    if (typeof self === 'object') {
      lib$rsvp$platform$$platform = self;

    } else if (typeof global === 'object') {
      lib$rsvp$platform$$platform = global;
    } else {
      throw new Error('no global: `self` or `global` found');
    }

    var lib$rsvp$platform$$default = lib$rsvp$platform$$platform;
    function lib$rsvp$race$$race(array, label) {
      return lib$rsvp$promise$$default.race(array, label);
    }
    var lib$rsvp$race$$default = lib$rsvp$race$$race;
    function lib$rsvp$reject$$reject(reason, label) {
      return lib$rsvp$promise$$default.reject(reason, label);
    }
    var lib$rsvp$reject$$default = lib$rsvp$reject$$reject;
    function lib$rsvp$resolve$$resolve(value, label) {
      return lib$rsvp$promise$$default.resolve(value, label);
    }
    var lib$rsvp$resolve$$default = lib$rsvp$resolve$$resolve;
    function lib$rsvp$rethrow$$rethrow(reason) {
      setTimeout(function() {
        throw reason;
      });
      throw reason;
    }
    var lib$rsvp$rethrow$$default = lib$rsvp$rethrow$$rethrow;

    lib$rsvp$config$$config.async = lib$rsvp$asap$$default;
    lib$rsvp$config$$config.after = function(cb) {
      setTimeout(cb, 0);
    };
    var lib$rsvp$$cast = lib$rsvp$resolve$$default;
    function lib$rsvp$$async(callback, arg) {
      lib$rsvp$config$$config.async(callback, arg);
    }

    function lib$rsvp$$on() {
      lib$rsvp$config$$config['on'].apply(lib$rsvp$config$$config, arguments);
    }

    function lib$rsvp$$off() {
      lib$rsvp$config$$config['off'].apply(lib$rsvp$config$$config, arguments);
    }

    if (typeof window !== 'undefined' && typeof window['__PROMISE_INSTRUMENTATION__'] === 'object') {
      var lib$rsvp$$callbacks = window['__PROMISE_INSTRUMENTATION__'];
      lib$rsvp$config$$configure('instrument', true);
      for (var lib$rsvp$$eventName in lib$rsvp$$callbacks) {
        if (lib$rsvp$$callbacks.hasOwnProperty(lib$rsvp$$eventName)) {
          lib$rsvp$$on(lib$rsvp$$eventName, lib$rsvp$$callbacks[lib$rsvp$$eventName]);
        }
      }
    }

    var lib$rsvp$umd$$RSVP = {
      'race': lib$rsvp$race$$default,
      'Promise': lib$rsvp$promise$$default,
      'allSettled': lib$rsvp$all$settled$$default,
      'hash': lib$rsvp$hash$$default,
      'hashSettled': lib$rsvp$hash$settled$$default,
      'denodeify': lib$rsvp$node$$default,
      'on': lib$rsvp$$on,
      'off': lib$rsvp$$off,
      'map': lib$rsvp$map$$default,
      'filter': lib$rsvp$filter$$default,
      'resolve': lib$rsvp$resolve$$default,
      'reject': lib$rsvp$reject$$default,
      'all': lib$rsvp$all$$default,
      'rethrow': lib$rsvp$rethrow$$default,
      'defer': lib$rsvp$defer$$default,
      'EventTarget': lib$rsvp$events$$default,
      'configure': lib$rsvp$config$$configure,
      'async': lib$rsvp$$async
    };

    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$rsvp$umd$$RSVP; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$rsvp$umd$$RSVP;
    } else if (typeof lib$rsvp$platform$$default !== 'undefined') {
      lib$rsvp$platform$$default['RSVP'] = lib$rsvp$umd$$RSVP;
    }
}).call(this);



(function(w, $) {

    "use strict";

    var
        Camellia = null,
        _op_toString = Object.prototype.toString,
        _op_hasOwn = Object.prototype.hasOwnProperty,

        _browser = _getBrowser(),

        _runtime_shared = {},		        
        _modules = {                        
            modulearry: [],
            addmodule: function() {

            },
            delmodule: function() {

            },
            isExist: function() {

            }
        }
        ;


    function _getBrowser() {
        var nv, ua, match, ret = {
            browser: "undefined",
            version: "undefined",
            platform: "undefined",
            language: "undefined"
        };

        if ( !w.navigator ) {
            return ret;
        }

        nv = w.navigator;
        ua = nv.userAgent.toLowerCase();
        match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            /(edge)[ \/]([\d.]+)/.exec(ua) ||       
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        if (ua.indexOf("trident/7.0") >= 0 &&  ua.indexOf(".net4.0c")) {

            ret.browser = "msie";

            if(ua.indexOf("rv:11.0") >= 0 ){
                ret.version = 11;
            } else {
                ret.version = parseInt(ua.split('msie')[1]);
            }
        }
        else {
            ret.browser = match[ 1 ] || ret.browser;
            ret.version = parseInt( match[ 2 ] || ret.version );
        }

        ret.platform = nv.platform || "undefined";

        ret.language = nv.language || nv.userLanguage || "undefined";

        return ret;
    }

    function _isType(src, comp) {
        if ( src === undefined ) {
            return undefined;
        }
        else if ( src === null ) {
            return null;
        }

        return ( _op_toString.call(src).toLowerCase() === comp );
    }

    Camellia =
    {

        $: $,

        _getwindow: function() {
            return window;
        },

        browser: _browser.browser,

        browser_version: _browser.version,

        platform: _browser.platform,

        language: _browser.language,

        extendif: function(pdest, psrc, extendMode, confirm) {         

            var mode = extendMode || "OE",
                exData = {},
                dest = pdest || {}, src = psrc || {},
                _confirm = confirm || false,
                srcProp;

            for ( var name in src ) {
                srcProp = src[ name ];

                if ( !src.hasOwnProperty(name) ) {    
                    continue;
                }


                if ( mode === "OE" && dest[ name ] === undefined ) {
                    dest[ name ] = this.copyObject(src[ name ]);
                }
                else if ( mode === "OMC" && dest[ name ] !== undefined ) {
                    dest[ name ] = this.copyObject(src[ name ]);
                }
                else if ( mode === "OEMC" ) {  
                    if ( _confirm && dest[ name ] && this.hasOwnProp(dest, name) ) {
                        console.log('already exists... ', name);                
                    }
                    dest[ name ] = this.copyObject(src[ name ]);
                }
            }

            return dest;
        },

        copyObject: function(src) {
            var dest
                , funcToString = Function.prototype.toString
                ;

            if ( this.isArray(src) ) {
                dest = this.extendif([], src);
            }
            else if ( this.isDate(src) ) {
                dest = new Date(src.getTime());
            }
            else if ( this.isPlainObject(src) ) {
                dest = this.extendif({}, src);
            }
            else {
                dest = src;
            }

            return dest;
        },

        hasOwnProp: function(obj, prop) {
            return _op_hasOwn.call(obj, prop);
        },

        isFunction: function(obj) {
            return _isType(obj, "[object function]");
        },

        isObject: function(obj) {
            var type = typeof obj;
            return !!obj && (type == 'object' || type == 'function');
        },



        isArray: function(obj) {
            return _isType(obj, "[object array]");
        },

        isString: function(obj) {
            return _isType(obj, "[object string]");
        },

        isNumber: function(obj) {
            return _isType(obj, "[object number]");
        },

        isBoolean: function(obj) {
            return _isType(obj, "[object boolean]");
        },

        isDate: function(obj) {
            return _isType(obj, "[object date]");
        },

        isRegExp: function(obj) {
            return _isType(obj, "[object regexp]");
        },

        isNil: function(value) {
            return value == null;
        },

        isNull: function(obj) {
            return obj === null;
        },

        isUndefined: function(obj) {
            return obj === undefined;
        },

        isPlainObject: function(obj) {
            var funcToString = Function.prototype.toString;

            if ( this.isNil(obj) || !_isType(obj, "[object object]") ) {
                return false;
            }

            if ( obj.constructor && this.isFunction(obj.constructor) ) {
                return funcToString.call(obj.constructor) == funcToString.call(Object);
            }
            else {
                return false;
            }
        },

        isModule: function(obj, modname) {    
            var mod = this.getModule(modname);
            if ( mod === undefined ) {
                return false;
            }

            return ( obj instanceof mod );
        },

        isUndefinedOrNull: function(obj) {
            return ( obj === undefined || obj === null );
        },

        getFunctionName: function(obj) {
            var regResult = obj.toString().match(/^function\s*([^\(\s]*)\s*\(/);

            if ( !regResult ) {
                return null;
            }
            else {
                return regResult[ 1 ];
            }
        },

        getFunctionParameterNames:  function(func) {
            var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
            var ARGUMENT_NAMES = /([^\s,]+)/g;
            var fnStr = func.toString().replace(STRIP_COMMENTS, '');
            var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
            if(result === null)
                result = [];
            return result;
        },

        json2string: function(obj) {
            return JSON.stringify(obj);
        },

        string2json: function(str) {
            return JSON.parse(str);
        },


        object2array: function(obj, arryMappingKey) {

            var ret = [],
                bChangeOrder = ( typeof(arryMappingKey) !== "undefined" );

            this.assert(this.isPlainObject(obj), "not a plain object");

            if ( bChangeOrder ) {
                for ( var kx = 0, klen = arryMappingKey.length; kx < klen; kx++ ) {
                    ret.push(obj[ arryMappingKey[ kx ] ]);
                }
            }
            else {
                for ( var key in obj ) {
                    ret.push(obj[ key ]);
                }
            }

            return ret;
        },

        array2object: function(arry, arryObjectKeys) {
            var ret = {},
                ax = 0,
                alen = 0;

            this.assert(this.isArray(arry), "not a array");
            this.assert(arryObjectKeys, "undefined object keys");

            alen = arry.length;
            this.assert(alen === arryObjectKeys.length, "invalid key length");

            for ( ; ax < alen; ax++ ) {
                ret[ arryObjectKeys[ ax ] ] = arry[ ax ];
            }

            return ret;
        },

        extractKeys: function(obj) {
            var ret = null;

            this.assert(this.isPlainObject(obj), "not a plain object");

            if ( Object.keys ) {
                return Object.keys(obj);
            }
            else {
                ret = [];
                for ( var key in obj ) {
                    ret.push(key);
                }
                return ret;
            }
        },

        _defineUserModule : function(moduleName, definition, inheritedModuleName) {
            function UserModule(options) {
                if ( !(this instanceof UserModule) ) {
                    return new UserModule(options);
                }

                if ( UserModule._super_proto_ !== undefined ) {
                    UserModule._super_constructor(this, arguments);
                }

                for(var propertyName in definition) {
                    if(!A.isFunction(definition[propertyName])) {
                        this[propertyName] = definition[propertyName];
                    }
                }
            }

            UserModule.prototype = {
                construct: function() {}
            };

            for(var propertyName in definition) {
                if(A.isFunction(definition[propertyName])) {
                    UserModule.prototype[propertyName] = definition[propertyName];
                }
            }

            if(A.isString(inheritedModuleName)) {
                if(A.isNil(A.getModule(inheritedModuleName))) {
                    throw new Error('it does not exist module named "' + inheritedModuleName + '"');
                }

                A.inherit(UserModule, A.getModule(inheritedModuleName));
            }

            A.extendModule(UserModule, moduleName);
        },

        extendModule: function(obj, alias) {
            var funcName = "",
                rexpInvalidModuleName = /[^a-zA-Z0-9\.\_]|^\.|^\_/,     
                keyName = "";

            if ( !this.isFunction(obj) ) {
                throw new Error("invalid object type. only function type.");
            }

            funcName = this.getFunctionName(obj);
            keyName = alias || funcName;

            if ( !keyName || rexpInvalidModuleName.test(keyName) ) {
                throw new Error("invalid module name");
            }

            if ( _op_hasOwn.call(_modules, keyName) ) {
                throw new Error("object with same name exists");
            }
            else {
                _modules[ keyName ] = obj;
            }
        },

        createModule: function(name, options) {
            var newmod = null, args = null;

            if ( !_op_hasOwn.call(_modules, name) ) {
                throw new Error("the module was not found : " + name);
            }
            if ( _modules[ name ].prototype.construct ) {               
                args = Array.prototype.slice.call(arguments);
                args.shift();

                newmod = new (_modules[ name ])(options);
                _modules[ name ].prototype.construct.apply(newmod, args);

                return newmod;
            }
            else {
                return new (_modules[ name ])(options);                
            }
        },

        getModule: function(name) {
            return this.module(name);
        },

        module: function(name) {
            return (_modules[ name ]);
        },

        inheritModule: function(Child, Parent) {
            this.inherit(Child, Parent);
        },

        inherit: function(Child, Parent) {
            var proxy = function() {
                },
                thisCml = Camellia,
                child_proto = thisCml.extendif({}, Child.prototype);    

            proxy.prototype = Parent.prototype;
            Child.prototype = new proxy();
            thisCml.extendif(Child.prototype, child_proto, "OEMC");

            Child.prototype.constructor = Child;
            Child._super_proto_ = Parent.prototype;
            Child._super_proto_.constructor = Parent;
            Child._super_constructor = function(thisArg, arryArgs) {        
                Child._super_proto_.constructor.apply(thisArg, arryArgs);
                thisArg._super = Parent.prototype;                  

                thisArg.superc = function(pParent, method) {                 
                    var args = (arguments.length > 2) ? Array.prototype.slice.call(arguments, 2) : [];
                    if ( thisCml.hasOwnProp(pParent.prototype, method) ) {
                        return pParent.prototype[ method ].apply(thisArg, args);
                    }
                    else {
                        throw new Error("unknown method : " + method);
                    }
                };
            };

            Parent._const_children_ = Parent._const_children_ || [];
            Parent._const_children_.push(Child);
            Parent._findInstance = function(thisArg) {              
                var chk = false;
                for ( var cx = 0, clen = Parent._const_children_.length; cx < clen; cx++ ) {
                    if ( thisArg instanceof Parent._const_children_[ cx ] ) {
                        chk = true;
                        break;
                    }
                }
                return chk;
            };
        },

        querySelectorAll: function(selectors, baseElm) {
            return (baseElm === undefined) ? window.document.querySelectorAll(selectors) : baseElm.querySelectorAll(selectors);
        },

        assert: function(condition, msg) {
            var _msg = msg || "message is undefined";

            if ( !condition ) {
                throw new Error("Assert failed" + (": " + _msg));
            }
        },

        assertNot: function(condition, msg) {
            var _msg = msg || "message is undefined";

            if ( condition ) {
                throw new Error("Assert failed" + (": " + _msg));
            }
        },

        clearObject: function(obj, deep) {
            var o, prop;

            if ( obj === undefined || obj === null ) {
                return;
            }

            this.assert(this.isPlainObject(obj), "not a plain object");

            if ( deep !== undefined ) {
                for ( prop in obj ) {
                    o = obj[ prop ];

                    if ( deep && this.isPlainObject(o) ) {
                        this.clearObject(o, deep);
                    }
                    else if ( deep && this.isArray(o) ) {
                        this.clearArray(o, deep);
                    }

                    obj[ prop ] = null;
                }
            }
            else {
                for ( prop in obj ) {
                    obj[ prop ] = null;
                }
            }
        },

        clearArray: function(obj, deep) {
            var o, ax, len;

            if ( obj === undefined || obj === null ) {
                return;
            }
            this.assert(this.isArray(obj), "No Array Type");

            if ( deep !== undefined ) {
                for ( ax = 0, len = obj.length; ax < len; ax++ ) {
                    o = obj[ ax ];

                    if ( deep && this.isPlainObject(o) ) {
                        this.clearObject(o, deep);
                    }
                    else if ( deep && this.isArray(o) ) {
                        this.clearArray(o, deep);
                    }

                    obj[ ax ] = null;
                }
            }
            else {
                for ( ax = 0, len = obj.length; ax < len; ax++ ) {
                    obj[ ax ] = null;
                }
            }

            obj.splice(0, obj.length);
        },

        generateUUID: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = (c === 'x') ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },

        equalObject: function(o1, o2) {
            var bret = true,
                v1, v2, o1len = 0, o2arry;

            this.assert(arguments.length === 2 &&
                this.isPlainObject(o1) &&
                this.isPlainObject(o2), "invalid arguments count or type (must be a plain object and two argument");

            if ( o1 === o2 ) {
                return true;
            }

            for ( var key in o1 ) {
                o1len += 1;

                if ( !o2[ key ] ) {
                    bret = false;
                    break;
                }

                v1 = o1[ key ];
                v2 = o2[ key ];

                if ( v1 === v2 ) {
                    continue;
                }
                else if ( this.isPlainObject(v1) && this.isPlainObject(v2) ) {
                    bret = this.equalObject(v1, v2);
                }
                else if ( this.isArray(v1) && this.isArray(v2) ) {
                    bret = this.equalArray(v1, v2);
                }
                else {
                    bret = false;
                }

                if ( !bret ) {
                    break;
                }
            }

            if ( bret ) {
                o2arry = this.object2array(o2);
                bret = ( o1len === o2arry.length );
            }

            return bret;
        },

        equalArray: function(a1, a2) {
            var bret = true,
                v1, v2;

            this.assert(arguments.length === 2 &&
                this.isArray(a1) &&
                this.isArray(a2), "invalid arguments count or type (must be a array object and two argument");

            if ( a1 === a2 ) {
                return true;
            }
            if ( a1.length !== a2.length ) {
                return false;
            }

            for ( var ax = 0, alen = a1.length; ax < alen; ax++ ) {
                v1 = a1[ ax ];
                v2 = a2[ ax ];

                if ( v1 === v2 ) {
                    continue;
                }
                else if ( this.isPlainObject(v1) && this.isPlainObject(v2) ) {
                    bret = this.equalObject(v1, v2);
                }
                else if ( this.isArray(v1) && this.isArray(v2) ) {
                    bret = this.equalArray(v1, v2);
                }
                else {
                    bret = false;
                }

                if ( !bret ) {
                    break;
                }
            }

            return bret;
        },

        equal: function(op1, op2) {
            var bret = false;

            if ( op1 === op2 ) {
                bret = true;
            }
            else if ( this.isPlainObject(op1) && this.isPlainObject(op2) ) {
                bret = this.equalObject(op1, op2);
            }
            else if ( this.isArray(op1) && this.isArray(op2) ) {
                bret = this.equalArray(op1, op2);
            } else if ( this.isDate(op1) && this.isDate(op2) ) {
                bret = op1.getTime() == op2.getTime();
            }

            return bret;
        },

        setWritable: function(obj, key, isWritable) {
            var defprop = {},
                _isWritable = isWritable === undefined ? true : isWritable;


            defprop[ key ] = { writable: _isWritable };
            Object.defineProperties(obj, defprop);

            return true;
        },

        setWritableAll: function(obj, isWritable) {
            var keys = this.extractKeys(obj);


            for ( var i = 0, max = keys.length; i < max; i++ ) {
                this.setWritable(obj, keys[ i ], isWritable);
            }
        },

        debug: function() {
            if ( Camellia.runAttributes.debug && console && console.log ) {
                console.log.apply(console, Array.prototype.slice.call(arguments));
            }
        }
    };

    Camellia.assert($, "jQuery library not found. please download from http://jquery.com and include it before.");
    Camellia.assert(w._, "lodash library not found. please, download from https://lodash.com/ and include it before.");     

    Camellia.assertNot((Camellia.browser == "msie" && Camellia.browser_version < 9), "It dosen't support under Internet Explorer 9");

    if ( true ) {

        var overwriting_keys = [ 'isFunction', 'isObject', 'isArray', 'isString', 'isNumber', 'isBoolean', 'isDate', 'isRegExp', 'isNil', 'isNull', 'isUndefined', 'isPlainObject' ],
            excepted_keys = [ 'VERSION' ];

        var _lodash = w._;
        for ( var _key_ in _lodash ) {
            if ( !_lodash.hasOwnProperty(_key_) ) {
                continue;
            }
            if ( excepted_keys.indexOf(_key_) >= 0 ) {
                continue;
            }

            if ( !Camellia[ _key_ ] || overwriting_keys.indexOf(_key_) >= 0 ) {
                Camellia[ _key_ ] = _lodash[ _key_ ];
            }
            else if ( !Camellia.hasOwnProperty(_key_) ) {
                Camellia[ _key_ ] = _lodash[ _key_ ];
            }
            else if ( !Camellia[ 'conflict_lodash' ] ) {
                Camellia[ 'conflict_lodash' ] = true;  
            }
        }



        var _runAttributes = {
            debug: false,
            noframework: false,
            uselegacydatakey: false
        };

        _runAttributes.debug = $("script[data-camellia-run-debug]").length > 0 ? true : false;
        _runAttributes.noframework = $("script[data-camellia-run-noframework]").length > 0 ? true : false;
        _runAttributes.uselegacydatakey = $("script[data-camellia-run-uselegacydatakey]").length > 0 ? true : false;

        Camellia.setWritable(_runAttributes, "noframework", false);
        Camellia.setWritable(_runAttributes, "uselegacydatakey", false);

        Object.defineProperty(Camellia, 'runAttributes', {
            get: function() {
                return _runAttributes;
            }
        });
    }


    w.A = w.Camellia = Camellia;

    if ( typeof(exports) !== 'undefined' ) {
        exports = this.Camellia;
    }

})(typeof window !== "undefined" ? window : this, typeof jQuery !== "undefined" ? jQuery : undefined);



(function (A) {

    "use strict";

    var _ASYNC_TIMEOUT = 30;   
    var STRICT_MODE = true;

    function events(predefined) {

        if ( !(this instanceof events) ) {
            return new events(predefined);
        }

        if ( !predefined ) {
            STRICT_MODE = false;
            predefined = {};
        }

        this.etypes = {};

        this._init(predefined);
    }

    events.prototype = {

        _init: function (predefined) {
            for ( var prop in predefined ) {
                this.etypes[ predefined[ prop ] ] = [];
            }
        },

        _create: function (evtFullName, evtname, evtns, evtfunc, ctx, async, once) {
            var nobj = {};

            nobj[ "fullName" ] = evtFullName;
            nobj[ "name" ] = evtname;
            nobj[ "func" ] = evtfunc;
            nobj[ "ctx" ] = ctx;
            nobj[ "async" ] = async || false;
            nobj[ "ns" ] = evtns || [];
            nobj[ "once" ] = once || false;
            return nobj;
        },

        _find: function (evtname, evtns, evtfunc, ctx) {
            var evtarry = this.etypes[ evtname ],
                evtobj;

            if ( evtarry === undefined ) {
                throw new Error("it can't find the event : " + evtname);
            }

            for ( var ex = 0, len = evtarry.length; ex < len; ex++ ) {
                evtobj = evtarry[ ex ];

                if ( evtobj.ns.join(".") === evtns.join(".") &&
                    evtobj.func === evtfunc &&
                    evtobj.ctx === ctx ) {
                    return ex;
                }
            }

            return -1;
        },

        destroy: function () {
            this.etypes = null;
        },

        parseOption: function (opt, baseCtx) {
            var evtobj;

            if ( opt.events !== undefined && A.isArray(opt.events) ) {

                for ( var ex = 0, len = opt.events.length; ex < len; ex++ ) {
                    evtobj = opt.events[ ex ];

                    A.assert(evtobj.ename, "undefined event-name (ename)");
                    A.assert(evtobj.efunc, "undefined event-func (efunc)");

                    this.on(
                        evtobj.ename + ((evtobj.epath && baseCtx && baseCtx._getNs && A.isFunction(baseCtx._getNs)) ? "." + baseCtx._getNs(evtobj.epath) : ''),
                        evtobj.efunc,
                        ( evtobj.econtext ? evtobj.econtext : baseCtx),
                        evtobj.async
                    );
                }
            }
        },

        on: function (evtFullName, evtfunc, ctx, async, once) {
            var evtns = [],
                evtname = '';

            if ( evtFullName.indexOf(".") >= 0 ) {
                evtns = evtFullName.split(".");
                evtname = evtns.shift();
            } else {
                evtname = evtFullName;
            }
            this._attach(evtFullName, evtname, evtns, evtfunc, ctx, async, once);
        },
        once: function (evtname, evtfunc, ctx, async) {
            this.on(evtname, evtfunc, ctx, async, true);
        },
        off: function (evtname, evtfunc, ctx) {
            var evtns = [];
            if ( evtname.indexOf(".") >= 0 ) {
                evtns = evtname.split(".");
                evtname = evtns.shift();
            }

            this._detach(evtname, evtns, evtfunc, ctx);
        },

        fire: function () {
            this._execute.apply(this, arguments);
        },

        _attach: function (evtFullName, evtname, evtns, evtfunc, ctx, async, once) {
            ctx = ctx || this;
            A.assert((evtname !== undefined && evtfunc !== undefined && ctx !== undefined), "events.attach have invalid arguments [eventname: {0}, eventfunc: {1}, context: {2}".format(evtname, evtfunc, ctx));


            if ( this.etypes[ evtname ] == undefined ) {
                if ( STRICT_MODE ) {
                    return;
                } else {
                    this.etypes[ evtname ] = [];
                }
            }


            if ( this._find(evtname, evtns, evtfunc, ctx) >= 0 ) {
                return;
            }
            this.etypes[ evtname ].push(this._create(evtFullName, evtname, evtns, evtfunc, ctx, async, once));
        },

        _detach: function (evtname, evtns, evtfunc, ctx) {

            var evtarry = this.etypes[ evtname ],
                evtobj;

            if ( evtarry === undefined ) {
                throw new Error("it can't find the event : " + evtname);
            }

            for ( var ex = evtarry.length - 1; ex >= 0; ex-- ) {
                evtobj = evtarry[ ex ];

                if ( evtobj.ns.length < evtns.length || evtobj.ns.slice(0, evtns.length).join(".") !== evtns.join(".") ) {
                    continue;
                }

                if ( (evtfunc === undefined || evtobj.func === evtfunc) &&
                    (ctx === undefined || evtobj.ctx === ctx) ) {
                    evtarry.splice(ex, 1);
                }
            }
        },

        _execute: function () {
            var that = this,
                evtfullname = arguments[ 0 ],
                evtname = '',
                evtns,
                arry,
                args = Array.prototype.slice.call(arguments, 1),
                _c_func = null,
                _c_ctx = null,
                _async = false,
                _once = false,
                _onceSyncList = [],

                evtns = evtfullname.split(".");
            evtname = evtns.shift();
            arry = this.etypes[ evtname ];


            if ( !STRICT_MODE && !arry ) {
                return;
            }
            try {
                for ( var ex = 0, len = arry.length; ex < len; ex++ ) {
                    if ( arry[ ex ].ns.length < evtns.length || arry[ ex ].ns.slice(0, evtns.length).join(".") !== evtns.join(".") ) {
                        continue;
                    }

                    _async = arry[ ex ].async;
                    _c_func = arry[ ex ].func;
                    _c_ctx = arry[ ex ].ctx;
                    _once = arry[ ex ].once;

                    if ( _async ) {
                        _runasync(_c_func, _c_ctx, args, arry[ ex ].fullName, _once);
                    }
                    else {

                        if ( _once ) {
                            _onceSyncList.push({
                                evtFullName: arry[ ex ].fullName,
                                func: _c_func,
                                ctx: _c_ctx
                            });
                        }

                        (_c_func).apply(_c_ctx, args);
                    }
                }
            } finally {
                if ( _onceSyncList.length > 0 ) {
                    A.forEach(_onceSyncList, function (target, key) {
                        that.off(target.evtFullName, target.func, target.ctx);
                    });
                }
            }

            function _runasync(f, c, a, evtFullName, once) {

                setTimeout(_asyncall_event, _ASYNC_TIMEOUT);

                function _asyncall_event() {
                    try {
                        (f).apply(c, a);
                    } finally {
                        if ( once ) {
                            that.off(evtFullName, f, c);
                        }
                    }
                }
            }


        }

    };

    A.extendModule(events);

})(Camellia);



(function(A) {

    "use strict";

    var _PROTOCOL_ID = "__AUI_DATA_PROTOCOL__",
        _PROTOCOL_VERSION = "1.0.0";

    if ( A === undefined || A === null ) {
        throw new Error("Camellia is undefined or null");
    }

    function comm(options) {

        if ( !(this instanceof comm) ) {
            return new comm(options);
        }

        options = options || {};

        this._options = options;
        this.url = options.url || "";
        this._userCallbackSuccess = options.callbackSucc || null;       
        this._userCallbackError = options.callbackError || null;
        this._dataset = null;

        this._requestPayload = undefined;
        this._responseData = undefined;

        this._settings = {
            url: this.url,
            type: "POST",
            contentType: "application/json",          
            async: true,
            success: this._success,
            error: this._error,
            headers: {},
            context: this              
        };

        A.extendif(this._settings, options || {}, "OEMC");

        A.extendif(this._settings.headers,
            {
                protocol_id: _PROTOCOL_ID,
                protocol_version: _PROTOCOL_VERSION,
                protocol_type: this.__getProtocolType()
            }, "OEMC");

    }

    comm.prototype = {

        protocol_id: _PROTOCOL_ID,
        protocol_version: _PROTOCOL_VERSION,

        __getProtocolType: function() {
            return 'reserved';
        },

        __preprocessSetting: function(settings) {
            return settings;
        },

        __preprocessSendData: function(data, json) {
            return data;
        },

        __preprocessReceiveData: function(data) {
            return data;
        },

        send: function(dataset) {
            this._dataset = dataset;

            this._requestPayload = {};
            this._requestPayload[ "protocol_id" ] = this.protocol_id;
            this._requestPayload[ "protocol_version" ] = this.protocol_version;
            this._requestPayload[ "protocol_type" ] = this.__getProtocolType();
            this._requestPayload[ "request_id" ] = A.generateUUID();
            this._requestPayload[ "querydata" ] = this._settings.data || {};

            A.extendif(this._requestPayload, this._dataset.buildRequest(this._options) || {});  


            this._settings[ "data" ] = this.__preprocessSendData(A.json2string(this._requestPayload), A.copyObject(this._requestPayload));

            A.$.ajax(this._settings);
        },

        _success: function() {
            var data = arguments[ 0 ];

            data = this.__preprocessReceiveData(data);

            if ( !A.isPlainObject(data)) {
                try {
                    if(typeof data === "string") {
                        data = A.string2json(data);
                    } else {
                        if ( this._userCallbackError ) {
                            this._userCallbackError.call(this, 'Transaction data is invalid. data:', data);
                        }
                        return;
                    }
                }
                catch ( e ) {
                    if ( this._userCallbackError ) {
                        this._userCallbackError.call(this, e.message);
                    }
                    return;
                }
            }

            if ( this._verify(data) && this._dataset.verify(data) ) {
                this._responseData = this._dataset.buildResponse(data);

                if ( (data.errorcode + "").trim() === "0" && this._userCallbackSuccess ) {
                    this._userCallbackSuccess.call(this, this._responseData, this._requestPayload, this._options);
                }
                else if ( this._userCallbackError ) {
                    this._userCallbackError.call(this, this._responseData);
                }
            }
        },

        _error: function() {
            if ( this._userCallbackError ) {
                this._userCallbackError.call(this, arguments[ 2 ], arguments);
            }       
        },

        _verify: function(data) {
            if ( data[ "protocol_id" ] === undefined || data[ "protocol_id" ] === null ) {
                throw new Error("Invalid Protocol Spec - undefined or null protocol_id");
            }
            else if ( data[ "protocol_version" ] === undefined || data[ "protocol_version" ] === null ) {
                throw new Error("Invalid Protocol Spec - undefined or null protocol_version");
            }
            else if ( data[ "protocol_type" ] === undefined || data[ "protocol_type" ] === null ) {
                throw new Error("Invalid Protocol Spec - undefined or null protocol_type");
            }
            else if ( data[ "errorcode" ] === undefined || data[ "errorcode" ] === null ) {
                throw new Error("Invalid Protocol Spec - undefined or null errorcode");
            }
            else if ( data[ "protocol_id" ] !== this.protocol_id ) {
                throw new Error("Invalid Protocol Spec - mismatched protocol_id (" + data[ "protocol_id" ] + "/" + this.protocol_id + ")");
            }
            else if ( data[ "protocol_version" ] !== this.protocol_version ) {
                throw new Error("Invalid Protocol Spec - mismatched protocol_version (" + data[ "protocol_version" ] + "/" + this.protocol_version + ")");
            }
            else if ( data[ "response_id" ] === undefined ) {
                throw new Error("Invalid Protocol Spec - undefined response_id");
            }

            return true;
        }
    };


    A.extendModule(comm);

})(Camellia);

;(function(A) {

    var const_protocol_type = "__PROTOCOL_TYPE_ENCRYPT__";

    function encryptcomm() {
        if ( encryptcomm._super_proto_ !== undefined ) {
            encryptcomm._super_constructor(this, arguments);
        }


    }


    encryptcomm.prototype.construct = function(options, params) {
        A.debug('comm construct:', options, params);
    };







    encryptcomm.prototype.__getProtocolType = function() {
        return const_protocol_type;
    };

    encryptcomm.prototype.__preprocessSendData = function(data, json) {
        A.debug('comm.encrypt.__preprocessSendData>\n', data);

        return data;
    };

    encryptcomm.prototype.__preprocessReceiveData = function(data) {
        A.debug('comm.encrypt.__preprocessReceivedData>', data);

        return data;
    };


    A.inherit(encryptcomm, A.module("comm"));
    A.extendModule(encryptcomm, "comm.encrypt");

})(Camellia);


(function(A) {

    function dataBinder(options) {

        if ( !(this instanceof dataBinder) ) {
            return new dataBinder(options);
        }

        this._bindmodel = options.bindmodel;
        this._uipp = A.createModule("uipp").UIPP;

        this._callbackFuncs = [];

        this._bindType = options.bindType || null;
        this._loadControl = A.isNil(options.loadControl) ? false: options.loadControl;

        this.events = A.createModule("events", this.EVENTS);

        this.init();
    }

    dataBinder.prototype = {
        EVENTS: {
            LOAD_BEGIN: "evtLoadBegin",
            LOAD_END: "evtLoadEnd",
            DATA_BIND: "evtDataBind",
            DATA_UNBIND: 'evtDataUnbind',
            DESTROY: 'evtDestroy'
        },

        init: function() {
            A.assert(this._bindmodel, "bindmodel is null");

            this._registerUIPP();
        },

        destroy: function() {
            if ( this._bindmodel ) {
                this._unregisterUIPP();
                this._bindmodel = null;
            }
            this.event_fire(this.EVENTS.DATA_UNBIND, { 'bindType': this._bindType });

            this._uipp = null;
            this._callbackFuncs = null;

            this.event_fire(this.EVENTS.DESTROY, { 'bindType': this._bindType });

            if (this.events) {
                this.events.destroy();
            }
        },

        on: function() {
            var ename = arguments[ 0 ],
                efunc = arguments[ 1 ],
                ctx = arguments[ 2 ] || this,
                async = arguments[ 3 ] || false;

            this.events.on(ename, efunc, ctx, async);
        },

        off: function(){
            var ename = arguments[ 0 ],
                efunc = arguments[ 1 ],
                ctx = arguments[ 2 ] || this;

            this.events.off(ename, efunc, ctx);
        },

        event_fire: function() {
            this.events.fire.apply(this.events, arguments);
        },

        dataBind: function() {
            this._registerUIPP();

            this._bindmodel.uiproxy_run(this._uipp.LOAD);
            this.event_fire(this.EVENTS.DATA_BIND, { 'bindType': this._bindType });
        },

        unbindDataBind: function() {
            this._bindmodel.uiproxy_run(this._uipp.UNBIND);
        },

        _registerUIPP: function() {

            this._bindmodel.uiproxy_register(this._uipp.LOAD, this, this._uipp_load_in, this._uipp_load_out);
            this._bindmodel.uiproxy_register(this._uipp.UPDATE, this, this._uipp_update_in, this._uipp_update_out);
            this._bindmodel.uiproxy_register(this._uipp.SELECT, this, this._uipp_select_in, this._uipp_select_out);
            this._bindmodel.uiproxy_register(this._uipp.DELETE, this, this._uipp_delete_in, this._uipp_delete_out);
            this._bindmodel.uiproxy_register(this._uipp.RESET, this, this._uipp_reset_in, this._uipp_reset_out);
            this._bindmodel.uiproxy_register(this._uipp.BEGINLOAD, this, this._uipp_beginload_in, this._uipp_beginload_out);
            this._bindmodel.uiproxy_register(this._uipp.ENDLOAD, this, this._uipp_endload_in, this._uipp_endload_out);
            this._bindmodel.uiproxy_register(this._uipp.LOADERROR, this, this._uipp_loaderror_in, this._uipp_loaderror_out);
            this._bindmodel.uiproxy_register(this._uipp.LOADRANGE, this, this._uipp_loadrange_in, this._uipp_loadrange_out);

            this._bindmodel.uiproxy_register(this._uipp.INSERT, this, this._uipp_insert_in, this._uipp_insert_out);
            this._bindmodel.uiproxy_register(this._uipp.MOVE, this, this._uipp_move_in, this._uipp_move_out);

            this._bindmodel.uiproxy_register(this._uipp.UNBIND, this, this._uipp_unbind_in, this._uipp_unbind_out);
        },

        _unregisterUIPP: function() {
            this._bindmodel.uiproxy_unregister(this._uipp.LOAD);
            this._bindmodel.uiproxy_unregister(this._uipp.UPDATE);
            this._bindmodel.uiproxy_unregister(this._uipp.SELECT);
            this._bindmodel.uiproxy_unregister(this._uipp.DELETE);
            this._bindmodel.uiproxy_unregister(this._uipp.RESET);
            this._bindmodel.uiproxy_unregister(this._uipp.BEGINLOAD);
            this._bindmodel.uiproxy_unregister(this._uipp.ENDLOAD);
            this._bindmodel.uiproxy_unregister(this._uipp.LOADERROR);
            this._bindmodel.uiproxy_unregister(this._uipp.LOADRANGE);
            this._bindmodel.uiproxy_unregister(this._uipp.INSERT);
            this._bindmodel.uiproxy_unregister(this._uipp.MOVE);
            this._bindmodel.uiproxy_unregister(this._uipp.UNBIND);
        },

        unbindCallbackFunc: function(id) {
            for ( var i = 0; i < this._callbackFuncs.length; i++ ) {
                if ( this._callbackFuncs[ i ].id == id ) {
                    this._callbackFuncs[ i ].func = null;
                    this._callbackFuncs.splice(i, 1);
                    break;
                }
            }
        },

        bindCallbackFunc: function(id, func) {
            this._callbackFuncs[ this._callbackFuncs.length ] = { id: id, func: func };
        },

        applyCallbackFunc: function() {
            var args = Array.prototype.slice.call(arguments, 0);
            for ( var idx = 0; idx < this._callbackFuncs.length; idx++ ) {
                var loadingEndFunc = this._callbackFuncs[ idx ];
                if ( loadingEndFunc.func != null ) {
                    loadingEndFunc.func.apply(loadingEndFunc, args);
                }
            }
        },

        clear: function() {
            this._bindmodel.uiproxy_run(this._uipp.RESET);
        },

        updateItem: function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.splice(0, 0, this._uipp.UPDATE);

            this._bindmodel.uiproxy_run.apply(this._bindmodel, args);
        },

        addItem: function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.splice(0, 0, this._uipp.INSERT);

            this._bindmodel.uiproxy_run.apply(this._bindmodel, args);
        },

        deleteItem: function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.splice(0, 0, this._uipp.DELETE);

            this._bindmodel.uiproxy_run.apply(this._bindmodel, args);
        },

        selectItem: function() {
            var args = Array.prototype.slice.call(arguments, 0);
            args.splice(0, 0, this._uipp.SELECT);

            this._bindmodel.uiproxy_run.apply(this._bindmodel, args);
        },

        changeItemPosition: function(fromItem, toItem, before) {
            this._bindmodel.uiproxy_run(this._uipp.MOVE, { fromItem: fromItem, toItem: toItem, before: before });
        },

        loadRange: function(readindex, readcount, reqparam){
            this._bindmodel.uiproxy_run(this._uipp.LOADRANGE, readindex, readcount, reqparam);
        }
    };

    A.extendif(dataBinder.prototype, {
        _uipp_load_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_load_out: function() {
            var args = arguments[0],
                retArgs = {
                    bindType: this._bindType,
                    isLoaded: args['isLoaded'],
                    originalArgs: args
                };

            if ( this._loadControl ) {
                this.event_fire(this.EVENTS.LOAD_END, retArgs);
            } else {
                this.applyCallbackFunc('load', arguments[ 0 ]);
            }
        },

        _uipp_beginload_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_beginload_out: function() {
            this.applyCallbackFunc('beginload', arguments[ 0 ]);
        },

        _uipp_endload_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_endload_out: function() {
        },

        _uipp_loaderror_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_loaderror_out: function() {
            this.applyCallbackFunc('loaderror', arguments[ 0 ]);
        },

        _uipp_loadrange_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_loadrange_out: function() {
            this.applyCallbackFunc('loadrange', arguments[ 0 ]);
        },

        _uipp_reset_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_reset_out: function() {
            this.applyCallbackFunc('reset', arguments[ 0 ]);
        },

        _uipp_select_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_select_out: function() {
            this.applyCallbackFunc('select', arguments[ 0 ]);
        },

        _uipp_insert_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_insert_out: function() {
            this.applyCallbackFunc('insert', arguments[ 0 ]);
        },

        _uipp_update_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_update_out: function() {
            this.applyCallbackFunc('update', arguments[ 0 ]);
        },

        _uipp_delete_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_delete_out: function() {
            this.applyCallbackFunc('delete', arguments[ 0 ]);
        },

        _uipp_move_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_move_out: function() {
            this.applyCallbackFunc('move', arguments[ 0 ]);
        },

        _uipp_unbind_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_unbind_out: function() {
            this.destroy();
        }
    });

    A.extendModule(dataBinder);

})(Camellia);

(function (A) {

    "use strict";

    var _BINDKEY = ( !A.runAttributes.uselegacydatakey ? "data-camellia-bind" : "data-aui-bind" );

    var BINDER_WAY = {
        NONE: "bndway_none",
        ONE: "bndway_one",
        TWO: "bndway_two"
    };

    function bindmodel (options) {

        if (!(this instanceof bindmodel)) {
            return new bindmodel(options);
        }

        options = options || {};

        try {
            this.bi = options;
        }
        catch (e) {
            throw new Error("bindmodel exception: invalid initial parameters");
        }

        this.bindway = this.bi.bindway || A.BINDER_WAY.TWO;
        this.bindkey = this.bi.bindkey || _BINDKEY;
        this.src = this.bi.src;                            
        this.dataBindKey = this.bi.dataBindKey;            
        this.target = this.bi.target;                      
        this.targets = this.bi.targets || [];              
        this.items = [];
        this.oldBindSize = 0;
        this.bindSeparator = this.bi.bindSeparator || '/'; 


        if (this.target) {
            var nodeList = A.querySelectorAll(this.target);
            for (var nx = 0, len = nodeList.length; nx < len; nx++) {
                this.targets.push(nodeList.item(nx));
            }
        }

        this.attrBindInfo = this.bi.attrBindingInfo || null;   
        this._isI18n = A.isNil(this.bi.isI18n) ? false: this.bi.isI18n;

        this.uiproxy = A.createModule("funcroutetable");
        this.uipp = A.createModule("uipp").UIPP;
    }

    bindmodel.prototype = {

        construct: function () {
        },

        destroy: function () {
            this._unbindDatasetEvents();

            if ( this.uiproxy ) {
                this.uiproxy.destroy();
                this.uiproxy = null;
            }

            this.bi = null;
            this.src = null;

            this._resetitems();
        },

        getBindType: function() {
            return this.bindType;
        },

        clear: function () {
            this.src = null;
            this._resetitems();
        },

        init: function () {
            A.assert(this.src !== undefined, "source dataset is undefined");

            this._build(this.src, this.targets);

            this._bindDatasetEvents();
        },

        pop: function () {
            var item;
            for (var ix = 0, len = this.items.length; ix < len; ix++) {
                item = this.items[ix];
                this.__popData(item);
            }
        },

        push: function () {
            var item;
            for (var ix = 0, len = this.items.length; ix < len; ix++) {
                item = this.items[ix];
                this.__pushData(item);
            }
        },

        bindsize: function () {
            return this.items.length;
        },

        refresh: function () {
            this._resetitems();
            this._build(this.src, this.targets);
        }
    };

    A.extendif(bindmodel.prototype,
        {

            uiproxy_register: function (key, ctx, fin, fout) {
                this.uiproxy.addleft(key, ctx, fin, fout);
            },

            uiproxy_run: function () {
                var args = Array.prototype.slice.call(arguments, 0);

                this.uiproxy.runleft.apply(this.uiproxy, args);
            },

            uiproxy_unregister: function (key) {
                this.uiproxy.removeleft(key);
            }

        }
    );


    A.extendif(bindmodel.prototype,
        {
            _event_dsloadcomplete: function () {
                this.__evtloadcomplete.apply(this, arguments);
            },

            _event_dschangeddata: function () {
                this.__evtchangeddata.apply(this, arguments);
            },

            _event_dsreset: function () {
                this.__evtreset.apply(this, arguments);
            },

            _event_transactionbegin: function () {
                this.__evttransactionbegin.apply(this, arguments);
            },

            _event_transactionend: function () {
                this.__evttransactionend.apply(this, arguments);
            },

            _event_transactionerror: function () {
                this.__evttransactionerror.apply(this, arguments);
            },

            _event_dsdeleteddata: function () {
                this.__evtdeleteddata.apply(this, arguments);
            },

            _event_dsinserteddata: function () {
                this.__evtinserteddata.apply(this, arguments);
            },

            _event_dsselecteddata: function () {
                this.__evtselecteddata.apply(this, arguments);
            },

            _event_dsdestroy: function() {
                this.__evtdestroy.apply(this, arguments);
            },

            _event_dschnagedpositon: function() {
                this.__evtchangedposition.apply(this, arguments);
            }
        }
    );

    A.extendif(bindmodel.prototype, {
        _bindDatasetEvents: function () {
            if (A.isNull(this.src)) {
                return;
            }

            var path = undefined;

            if (A.isModule(this.src, "dataset.simple")) {
                var bindKey = this._getBindKey();
                path = this._getPathAsArray(bindKey);
            }

            this.src.eventOn(A.DS_EVENT.LOADCOMPLETE, this._event_dsloadcomplete, this, false, path);
            this.src.eventOn(A.DS_EVENT.RESETDATASET, this._event_dsreset, this, false, path);
            this.src.eventOn(A.DS_EVENT.TRANSACTION_BEGIN, this._event_transactionbegin, this, false, path);
            this.src.eventOn(A.DS_EVENT.TRANSACTION_END, this._event_transactionend, this, false, path);
            this.src.eventOn(A.DS_EVENT.TRANSACTION_ERROR, this._event_transactionerror, this, false, path);
            this.src.eventOn(A.DS_EVENT.CHANGED_ROWDATA, this._event_dschangeddata, this, false, path);
            this.src.eventOn(A.DS_EVENT.DELETED_ROWDATA, this._event_dsdeleteddata, this, false, path);
            this.src.eventOn(A.DS_EVENT.ADDED_ROWDATA, this._event_dsinserteddata, this, false, path);
            this.src.eventOn(A.DS_EVENT.SELECTED_ROWDATA, this._event_dsselecteddata, this, false, path);
            this.src.eventOn(A.DS_EVENT.DESTROY, this._event_dsdestroy, this, false, path);
            this.src.eventOn(A.DS_EVENT.CHANGED_POSITION, this._event_dschnagedpositon, this, false, path);
        },

        _unbindDatasetEvents: function () {
            if (A.isNull(this.src)) {
                return;
            }

            var path = undefined;

            if (A.isModule(this.src, "dataset.simple")) {
                var bindKey = this._getBindKey();
                path = this._getPathAsArray(bindKey);
            }

            this.src.eventOff(A.DS_EVENT.LOADCOMPLETE, this._event_dsloadcomplete, this, path);
            this.src.eventOff(A.DS_EVENT.RESETDATASET, this._event_dsreset, this, path);
            this.src.eventOff(A.DS_EVENT.TRANSACTION_BEGIN, this._event_transactionbegin, path);
            this.src.eventOff(A.DS_EVENT.TRANSACTION_END, this._event_transactionend, this, path);
            this.src.eventOff(A.DS_EVENT.TRANSACTION_ERROR, this._event_transactionerror, this, path);

            this.src.eventOff(A.DS_EVENT.CHANGED_ROWDATA, this._event_dschangeddata, this, path);
            this.src.eventOff(A.DS_EVENT.DELETED_ROWDATA, this._event_dsdeleteddata, this, path);
            this.src.eventOff(A.DS_EVENT.ADDED_ROWDATA, this._event_dsinserteddata, this, path);
            this.src.eventOff(A.DS_EVENT.SELECTED_ROWDATA, this._event_dsselecteddata, this, path);
            this.src.eventOff(A.DS_EVENT.DESTROY, this._event_dsdestroy, this, path);
            this.src.eventOff(A.DS_EVENT.CHANGED_POSITION, this._event_dschnagedpositon, this, path);
        },

        _getBindKey: function () {
            return this.dataBindKey;
        },

        _build: function (src, targets) {
            var bsize;

            this.__build(src, targets);

            if ((bsize = this.bindsize()) !== this.oldBindSize) {
                this.pop();
            }
            this.oldBindSize = bsize;
        },

        _additem: function (item) {
            if (!this.__existitem(item)) {
                this.items.push(item);

                if (this.bindway === A.BINDER_WAY.TWO) {
                    this.__addBindEvents(item);
                }

                return item;
            }
        },

        _removeitem: function (idx) {
            this.__removeBindEvents(this.items[idx]);

            if (A.isFunction(this.items[idx].ui_attrVal)) {
                this._removeEvent(this.items[idx]);
            }

            this.items.splice(idx, 1);
            this.oldBindSize = this.bindsize();
        },

        _resetitems: function () {

            for (var idx = this.items.length; (--idx) >= 0;) {
                this.__removeBindEvents(this.items[idx]);
            }

            for (var idx = 0; idx < this.items.length; idx++) {
                var item = this.items[idx];

                if (A.isFunction(item.ui_attrVal)) {
                    this._removeEvent(item);
                }
            }

            this.items.splice(0, this.items.length);
            this.oldBindSize = 0;
        },

        _removeEvent: function (item) {
            var elm = item.ui_element,
                eventName = item.ui_attrName,
                eventHandler = item.ui_attrVal;

            if (eventName.substring(0, 2) == 'on') {
                if (elm.removeEventListener) {
                    elm.removeEventListener(eventName.slice(2), eventHandler, false);
                } else {
                    elm.detachEvent(eventName, eventHandler);
                }
            }
        },

        _addEvent: function (item) {
            var elm = item.ui_element,
                eventName = item.ui_attrName,
                eventHandler = item.ui_attrVal;

            if (eventName.substring(0, 2) == 'on') {
                if (elm.addEventListener) {
                    elm.addEventListener(eventName.slice(2), eventHandler, false);
                } else {
                    elm.attachEvent(eventName, eventHandler);
                }
            }
        },

        _getPathAsArray: function(path) {
            return this.__getPathAsArray(path);
        },

        _convertToBindPathArray: function (strPath) {
            var SPLIT_CHAR = this.bindSeparator,
                START_PATTERN = "^/" + SPLIT_CHAR,
                END_PATTERN = "/" + SPLIT_CHAR + "$",
                strRe, endRe,
                returnPath = [];

            strPath = strPath.replace(/\s/gi, "");

            strRe = new RegExp(START_PATTERN, "g");
            strPath = strPath.replace(strRe, '');

            endRe = new RegExp(END_PATTERN, "g");
            strPath = strPath.replace(endRe, '');

            returnPath = strPath.split(SPLIT_CHAR);
            for (var i = 0; i < returnPath.length; i++) {
                if (!isNaN(returnPath[i])) {
                    returnPath[i] = parseInt(returnPath[i]);
                }
            }

            return returnPath;
        }
    });

    A.extendif(bindmodel.prototype, {
        __build: function (src, targets) {
            return null;
        },

        __popData: function (item) {
        },

        __pushData: function (item) {
        },

        __createitem: function () {
            return null;
        },

        __finditem: function (elem) {
            return -1;
        },

        __existitem: function (item) {
            return false;
        },

        __addBindEvents: function (item) {
        },

        __removeBindEvents: function (item) {
        }
    });


    A.extendif(Camellia, {
        setAttribute: function (element, attributeName, value) {
            var EVENT_NAME = 'auiAttributeChanged';

            if (jQuery && A.isString(element) && $(element).length > 0) {
                element = $(element)[0];
            }
            else if (jQuery && element instanceof jQuery) {
                element = element[0];
            }
            else if (!A.isFunction(element.setAttribute)) {
                throw new Error('element is invalid type.');
            }

            if (arguments.length < 2) {
                throw new Error('invalid arguments:', arguments);
            }

            if (arguments.length == 2) {
                return element.getAttribute(attributeName);
            }

            var oldValue = element.getAttribute(attributeName);
            var returned = element.setAttribute(attributeName, value);
            var event = null;

            if (A.browser == 'msie') {
                event = document.createEvent('Event');
                event.initEvent(EVENT_NAME, true, true);
                event.args = event.args || {};
                event.args.changedAttributeName = attributeName;
            } else {
                var event = new Event(EVENT_NAME, {
                    target: element,
                    srcElement: element
                });
                event.args = event.args || {};
                event.args.changedAttributeName = attributeName;
            }

            if (oldValue !== value) {
                element.dispatchEvent(event);
            }
            return returned;
        },

        getAttribute: function (element, attributeName) {
            if (jQuery && A.isString(element) && $(element).length > 0) {
                element = $(element)[0];
            }
            else if (jQuery && element instanceof jQuery) {
                element = element[0];
            }
            else if (!A.isFunction(element.getAttribute)) {
                throw new Error('element is invalid type.');
            }

            if (arguments.length < 2) {
                throw new Error('invalid arguments:', arguments);
            }

            return element.getAttribute(attributeName);
        },

        attr: function (element, attributeName, value) {
            return this.setAttribute.apply(this, arguments);
        }
    });

    A.extendModule(bindmodel);
    A.BINDER_WAY = A.copyObject(BINDER_WAY);

})(Camellia);

(function(A) {

    "use strict";

    function bindmodelsimple(options) {

        if ( !(this instanceof bindmodelsimple) ) {
            return new bindmodelsimple(options);
        }

        if ( bindmodelsimple._super_proto_ !== undefined ) {
            bindmodelsimple._super_constructor(this, arguments);
        }

        this._last_running_uipp = "";

        this.uiproxy.addright(this.uipp.LOAD, this, this._uipp_load_in, this._uipp_load_out);
        this.uiproxy.addright(this.uipp.UPDATE, this, this._uipp_update_in, this._uipp_update_out);
        this.uiproxy.addright(this.uipp.DELETE, this, this._uipp_delete_in, this._uipp_delete_out);
        this.uiproxy.addright(this.uipp.SELECT, this, this._uipp_select_in, this._uipp_select_out);
        this.uiproxy.addright(this.uipp.RESET, this, this._uipp_reset_in, this._uipp_reset_out);
        this.uiproxy.addright(this.uipp.INSERT, this, this._uipp_insert_in, this._uipp_insert_out);
        this.uiproxy.addright(this.uipp.UNBIND, this, this._uipp_unbind_in, this._uipp_unbind_out);

        this.uiproxy.runright_before = this._callback_runright_before;
        this.uiproxy.runleft_before = this._callback_runleft_before;
        this.uiproxy.runright_after = this._callback_runright_after;
        this.uiproxy.runleft_after = this._callback_runleft_after;

        this.bindType = options.bindType || 'value';
    }

    bindmodelsimple.prototype = {

        construct: function() {
            this.init();
        },

        init: function() {
            this.superc(A.getModule("bindmodel"), 'init');
        },

        destroy: function() {
            this.superc(A.getModule("bindmodel"), 'destroy');
        },

        _replaceElementTextNode : function($element, oldText, newText) {
            var textNodes = this._getChildTextNodes($element);

            for(var i=0; i < textNodes.length; i++) {
                var textNode = $(textNodes[i]);
                if( $(textNode).text() == oldText) {
                    textNodes[i].replaceWith( document.createTextNode(newText) );
                }
            }
        },

        _isJqxWidget : function($element, widgetName) {
            var isExistJqxWidgetProperty = false;
            var isMatchedWidgetUserSpecified = false;
            var data = $($element).data();

            for(var property in data) {
                if(property.indexOf('jqxWidget') > -1) {
                    isExistJqxWidgetProperty = true;
                }

                if(widgetName && property.indexOf(widgetName) > -1) {
                    isMatchedWidgetUserSpecified = true;
                }

                if(isExistJqxWidgetProperty && widgetName == undefined) {
                    return true;
                }

                if(isExistJqxWidgetProperty && isMatchedWidgetUserSpecified) {
                    return true;
                }
            }
            return false;
        },

        _hasTextNode : function($element) {
            return this._getChildTextNodes($element).length > 0 > 0;
        },

        _getChildTextNodes : function($element) {
            var textNodes = $($element).contents().filter(function() {
                return this.nodeType === 3;
            });
            return textNodes;
        },

        addEventBind: function(eventName, eventHandler) {
            for ( var idx = 0; idx < this.targets.length; idx++ ) {
                this.addbind(this.targets[ idx ], eventName, eventHandler);
            }
        },

        removeEventBind: function(eventName, eventHandler) {
            for ( var idx = 0; idx < this.targets.length; idx++ ) {
                this.removebind(this.targets[ idx ], eventName, eventHandler);
            }
        },

        addbind: function(elem, attrName, bindkey) {
            var item = this._additem(this.__createitem(elem, attrName, bindkey));

            if ( item ) {
                this.__popData(item);
            }
        },

        removebind: function(elem, attrName, attrval) {
            var foundix = this.__finditem(elem, attrName, attrval);
            if ( foundix >= 0 ) {
                this._removeitem(foundix);
                return true;
            }
            else {
                return false;
            }
        },

        _isSrcLoaded: function() {
            var isLoaded = false;

            if ( A.isModule(this.src, "dataset.simple") || A.isModule(this.src, "dataset.simple") || A.isModule(this.src, "dataset.simple") ) {
                isLoaded = (this.src.getDatasetState() == A.DS_STATE.LOADED) ? true : false;
            }

            return isLoaded;
        },

        _parse: function(attrBindKey) {
            var attrBindingInfo = attrBindKey.split(','),
                ret = [];

            for ( var idx = 0, len = attrBindingInfo.length; idx < len; idx++ ) {
                var bindInfo = attrBindingInfo[ idx ].replace(/\s/gi, "").split(":"),
                    propObj = {};

                propObj[ bindInfo[ 0 ] ] = bindInfo[ 1 ];
                ret.push(propObj);
            }

            return ret;
        },

        _getData: function(bindKey) {
            var dataBindKey = "",
                path, selectedIndex;

            if (bindKey == undefined) {
                dataBindKey = this._getBindKey() || "";
            } else {
                dataBindKey = bindKey;
            }

            if (A.isModule(this.src, "dataset.table")) {
                selectedIndex = this.src.getCurrentRowIndex() < 0 ? 0 : this.src.getCurrentRowIndex();
                dataBindKey = selectedIndex + '/' + dataBindKey;

            } else if (A.isModule(this.src, "dataset.tree")) {
                selectedIndex = this.src._getSelectedIndex() < 0 ? 0 : this.src._getSelectedIndex();
                dataBindKey = selectedIndex + '/' + dataBindKey;
            }


            path = this._getPathAsArray(dataBindKey);

            return this.src.get(path);
        },

        __getPathAsArray: function(dataBindKey) {
            if ( A.isNil(dataBindKey)) {
                return [];
            }
            return this._convertToBindPathArray(dataBindKey);
        },

        _callback_runright_before: function(uipp) {
            switch ( uipp ) {
                case this.uipp.UPDATE:
                case this.uipp.DELETE:
                case this.uipp.INSERT:
                    if ( uipp === this._last_running_uipp ) {
                        this._last_running_uipp = "";
                        return false;
                    }
                    this._last_running_uipp = uipp;
                    break;
                default:
                    this._last_running_uipp = uipp;
                    break;
            }
        },

        _callback_runleft_before: function(uipp) {
            switch ( uipp ) {
                case this.uipp.UPDATE:
                    if ( this._last_running_uipp == this.uipp.LOAD || this._last_running_uipp == this.uipp.INSERT ) {
                        this._last_running_uipp = "";
                        return false;
                    }

                    if ( uipp === this._last_running_uipp ) {
                        this._last_running_uipp = "";
                        return false;
                    }

                    this._last_running_uipp = uipp;
                    break;
                case this.uipp.DELETE:
                    if ( uipp === this._last_running_uipp ) {
                        this._last_running_uipp = "";
                        return false;
                    }

                    this._last_running_uipp = uipp;
                    break;
                case this.uipp.INSERT:
                    if ( this._last_running_uipp == this.uipp.LOAD || this._last_running_uipp == this.uipp.UPDATE ) {
                        this._last_running_uipp = "";
                        return false;
                    }

                    if ( uipp === this._last_running_uipp ) {
                        this._last_running_uipp = "";
                        return false;
                    }

                    this._last_running_uipp = uipp;
                    break;
                default:
                    this._last_running_uipp = uipp;
                    break;
            }
        },

        _callback_runleft_after: function() {
            this._last_running_uipp = "";
        },

        _callback_runright_after: function() {
            this._last_running_uipp = "";
        }
    };

    A.extendif(bindmodelsimple.prototype,
        {

            __build: function(src, target) {
                var uiElement, uikey;
                for ( var tx = 0, tlen = target.length; tx < tlen; tx++ ) {
                    uiElement = target[ tx ];

                    if ( (uikey = uiElement.getAttribute(this.bindkey)) === null ) {
                        continue;
                    }

                    var attrBindInfo = [];
                    if ( !this.attrBindInfo ) { 
                        attrBindInfo = this._parse(uikey);
                    } else {
                        attrBindInfo = this.attrBindInfo;
                    }

                    for ( var idx = 0, len = attrBindInfo.length; idx < len; idx++ ) {
                        var attrObj = attrBindInfo[ idx ],
                            objKeys = Object.keys(attrObj);

                        for ( var key = 0, keyLen = objKeys.length; key < keyLen; key++ ) {
                            var attrName = objKeys[ key ];

                            this._additem(this.__createitem(uiElement, attrName, attrObj[ attrName ]));
                        }
                    }
                }

                return this.items.length;
            },

            __createitem: function(uiElement, attrName, bindkey) {
                var item = {};

                item.ui_element = uiElement;
                item.ui_attrName = attrName;
                item.ui_attrVal = bindkey;

                return item;
            },

            __existitem: function(item) {
                var foundix = this.__finditem(item.ui_element, item.ui_attrName, item.ui_attrVal);

                if ( foundix >= 0 ) {
                    return true;
                }
                return false;
            },

            __finditem: function(elem, attrName, attrVal) {
                var founditem;
                for ( var ix = 0, len = this.items.length; ix < len; ix++ ) {
                    founditem = this.items[ ix ];

                    if ( founditem.ui_element === elem && founditem.ui_attrName === attrName && founditem.ui_attrVal === attrVal ) {
                        return ix;
                    }
                }

                return -1;
            },

            __addBindEvents: function(item) {
                var elm = item.ui_element,
                    tagName = elm.tagName.toLowerCase();

                switch ( tagName ) {
                    default:
                        if ( elm.addEventListener ) {   
                            elm.addEventListener('change', this._bievent_onchange, false);
                            elm.addEventListener('auiAttributeChanged', this._bievent_onchange, false);
                        }
                        else {
                            elm.attachEvent('on' + 'change', this._bievent_onchange);
                            elm.attachEvent('on' + 'auiAttributeChanged', this._bievent_onchange);
                        }
                        elm._bm_context = this;         
                        break;
                }
            },

            __removeBindEvents: function(item) {
                var elm = item.ui_element,
                    tagName = elm.tagName.toLowerCase();

                switch ( tagName ) {
                    default:
                        if ( elm.removeEventListener ) {
                            elm.removeEventListener('change', this._bievent_onchange, false);
                            elm.removeEventListener('auiAttributeChanged', this._bievent_onchange, false);
                        }
                        else {
                            elm.detachEvent('on' + 'change', this._bievent_onchange);
                            elm.detachEvent('on' + 'auiAttributeChanged', this._bievent_onchange);
                        }
                        break;
                }
            },

            __popData: function(item) {
                var elm = item.ui_element,
                    attrName = item.ui_attrName,
                    attrVal = item.ui_attrVal;

                if ( A.isFunction(attrVal) ) {
                    this._removeEvent(item);
                    this._addEvent(item);

                } else {
                    var val = this._getData(attrVal);

                    if (this._isI18n) {
                        if( A.isUndefined(val)) {
                            return;
                        }
                    } else {
                        val = A.isUndefined(val) ? '' : val;
                    }

                    if ( attrName == 'text' ) {
                        $(elm).text(val);
                    } else if ( attrName == 'value' || attrName == 'checked' ) {
                        elm[ attrName ] = val;
                    } else {
                        elm.setAttribute(attrName, val);
                    }
                }
            },

            __pushData: function(item) {
                var elm = item.ui_element,
                    attrName = item.ui_attrName,
                    path = this._getPathAsArray(item.ui_attrVal);

                if ( attrName == 'text' ) {
                    this.src.set(path, $(elm).text());
                } else if ( attrName == 'value' || attrName == 'checked' ) {
                    this.src.set(path, elm[ attrName ]);
                } else {
                    this.src.set(path, elm.getAttribute(attrName));
                }
            }
        }
    );

    A.extendif(bindmodelsimple.prototype, {

        __evtloadcomplete: function() {
            this.refresh();
            this.pop(); 

            var retArgs = {
                    records: undefined,
                    dsState: undefined
                };

            if ( this._getBindKey() ) {
                retArgs[ 'records' ] = this._getData();
                retArgs[ 'isLoaded' ] = this._isSrcLoaded();
            }

            this.uiproxy.runright(this.uipp.LOAD, retArgs);
        },

        __evtselecteddata: function() {
            this.pop();

            var args = arguments[ 0 ],
                retArgs = {
                    records: undefined
                };

            retArgs[ "records" ] = this._getData();

            this.uiproxy.runright(this.uipp.SELECT, retArgs);
        },

        __evtchangeddata: function() {
            this.pop();

            var args = arguments[ 0 ],
                extraArgs = args.extraArgs || {},
                retArgs = {
                    value: undefined,
                    oldValue: undefined
                };

            if ( A.isModule(this.src, "dataset.table") || A.isModule(this.src, "dataset.tree") ) {
                retArgs[ 'value' ] = this._getData();
                this.uiproxy.runright(this.uipp.UPDATE, retArgs);
                return;
            }

            if ( A.isPlainObject(args.value) || A.isArray(args.value) ) {
                if ( A.equalArray(args[ 'path' ], extraArgs[ 'changedPath' ]) ) {
                    retArgs = {
                        records: extraArgs[ 'newValue' ],
                        isLoaded: this._isSrcLoaded()
                    };

                    this.uiproxy.runright(this.uipp.LOAD, retArgs);
                } else {
                    retArgs[ 'value' ] = extraArgs[ 'newValue' ];
                    retArgs[ 'oldValue' ] = extraArgs[ 'oldValue' ];

                    this.uiproxy.runright(this.uipp.UPDATE, retArgs);
                }
            } else {
                retArgs[ 'value' ] = args[ 'value' ];
                retArgs[ 'oldValue' ] = extraArgs[ 'oldValue' ];

                this.uiproxy.runright(this.uipp.UPDATE, retArgs);
            }
        },

        __evtreset: function() {
            this.pop();

            this.uiproxy.runright(this.uipp.RESET, {});
        },
        __evttransactionbegin: function() {
            this.uiproxy.runright(this.uipp.BEGINLOAD, arguments);
        },
        __evttransactionend: function() {
            this.uiproxy.runright(this.uipp.ENDLOAD, arguments);
        },
        __evttransactionerror: function() {
            this.uiproxy.runright(this.uipp.LOADERROR, arguments);
        },
        __evtdeleteddata: function() {
            this.pop();

            var args = arguments[ 0 ],
                extraArgs = args.extraArgs || {},
                retArgs = {
                    value: undefined
                };

            if ( A.isModule(this.src, 'dataset.table') || A.isModule(this.src, "dataset.tree")) {
                return;
            }

            if ( A.isPlainObject(args.value) || A.isArray(args.value) || A.isArray(extraArgs[ 'deletedValue' ]) || A.isPlainObject(extraArgs[ 'deletedValue' ]) ) {
                if ( A.equalArray(args[ 'path' ], extraArgs[ 'deletedPath' ]) ) {
                    retArgs = {
                        records: args[ 'value' ],
                        isLoaded: this._isSrcLoaded()
                    };

                    this.uiproxy.runright(this.uipp.LOAD, retArgs);
                    return;
                } else {
                    retArgs[ 'value' ] = extraArgs[ 'deletedValue' ];
                }
            } else {
                retArgs[ 'value' ] = args[ 'value' ];
            }

            this.uiproxy.runright(this.uipp.DELETE, retArgs);
        },

        __evtinserteddata: function() {
            this.pop();

            var args = arguments[ 0 ],
                extraArgs = args.extraArgs || {},
                retArgs = {
                    value: undefined,
                    index: undefined
                };

            if ( A.isModule(this.src, 'dataset.table') || A.isModule(this.src, "dataset.tree")) {
                return;
            }

            if ( A.isPlainObject(args.value) || A.isArray(args.value) || A.isPlainObject(extraArgs[ 'newValue' ]) || A.isArray(extraArgs[ 'newValue' ]) ) {
                if ( A.equalArray(args[ 'path' ], extraArgs[ 'changedPath' ]) ) {
                    retArgs = {
                        records: extraArgs[ 'newValue' ],
                        isLoaded: this._isSrcLoaded()
                    };

                    this.uiproxy.runright(this.uipp.LOAD, retArgs);

                } else {
                    retArgs[ 'value' ] = extraArgs[ 'newValue' ];

                    if ( A.isArray(args[ 'value' ]) ) {
                        var path = extraArgs[ 'changedPath' ] || [];

                        retArgs[ 'index' ] = (path.length == 0) ? undefined : path[ path.length - 1 ];
                    }

                    this.uiproxy.runright(this.uipp.INSERT, retArgs);
                }

            } else {
                retArgs[ 'value' ] = args[ 'value' ];
                this.uiproxy.runright(this.uipp.UPDATE, retArgs);
            }
        },

        __evtdestroy: function() {
            this.uiproxy.runright(this.uipp.UNBIND);
        }
    });

    A.extendif(bindmodelsimple.prototype, {
        _uipp_load_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_load_out: function() {
            var args = {
                records: undefined,
                isLoaded: undefined
            };

            if ( this.src ) {
                args[ 'records' ] = this._getData();
                args[ 'isLoaded' ] = this._isSrcLoaded();
            }

            this.uiproxy.runright(this.uipp.LOAD, args);
        },

        _uipp_reset_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_reset_out: function() {
        },

        _uipp_update_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_update_out: function() {
            var item = arguments[ 0 ],
                index = arguments[ 1 ],
                path = this._getBindKey();

            if ( index != undefined ) {
                path += '/' + index;
            }

            this.src.set(this._getPathAsArray(path), item);
        },

        _uipp_insert_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_insert_out: function() {
            var item = arguments[ 0 ],
                index = arguments[ 1 ],
                path = this._getBindKey();

            if ( index != undefined ) {
                path += '/' + index;
            }

            this.src.add(this._getPathAsArray(path), item);
        },

        _uipp_delete_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_delete_out: function() {
            var index = arguments[ 0 ],
                path = this._getBindKey();

            if ( index != undefined ) {
                path += '/' + index;
            }

            this.src.remove(this._getPathAsArray(path));
        },

        _uipp_select_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_select_out: function() {
        },

        _uipp_unbind_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_unbind_out: function() {
            this.uiproxy.runright(this.uipp.UNBIND);
        }
    });

    A.extendif(bindmodelsimple.prototype, {
        _bievent_onchange: function(evt) {

            function decideAttributeName(evt) {
                var targetElement = evt.target || evt.srcElement;
                var tagName = targetElement.tagName.toLowerCase();

                if ( evt.type == 'change' ) {

                    if ( tagName == 'input' && elm.type == 'checkbox' ) {
                        return 'checked';
                    }

                    return 'value';

                } else {
                    return evt.args.changedAttributeName;
                }
            }

            function applyDataToDS(ctx, elm, attrName) {
                var foundItem;

                for ( var i = 0; i < ctx.items.length; i++ ) {
                    foundItem = ctx.items[ i ];

                    if ( foundItem.ui_element === elm && foundItem.ui_attrName === attrName ) {
                        ctx.__pushData(foundItem);    
                    }
                }

            }

            var elm = evt.target || evt.srcElement, 
                ctx = elm._bm_context,               
                attrName = decideAttributeName(evt); 

            applyDataToDS(ctx, elm, attrName);
        }
    });

    A.inherit(bindmodelsimple, A.getModule("bindmodel"));
    A.extendModule(bindmodelsimple, "bindmodel.simple");

})(Camellia);
(function(A) {

    "use strict";

    function bindmodeltree(options) {

        if ( !(this instanceof bindmodeltree) ) {
            return new bindmodeltree(options);
        }
        if ( bindmodeltree._super_proto_ !== undefined ) {
            bindmodeltree._super_constructor(this, arguments);
        }

        this._last_running_uipp = "";

        this.uiproxy.addright(this.uipp.LOAD, this, this._uipp_load_in, this._uipp_load_out);
        this.uiproxy.addright(this.uipp.BEGINLOAD, this, this._uipp_beginload_in, this._uipp_beginload_out);
        this.uiproxy.addright(this.uipp.ENDLOAD, this, this._uipp_endload_in, this._uipp_endload_out);
        this.uiproxy.addright(this.uipp.LOADERROR, this, this._uipp_loaderror_in, this._uipp_loaderror_out);
        this.uiproxy.addright(this.uipp.INSERT, this, this._uipp_insert_in, this._uipp_insert_out);
        this.uiproxy.addright(this.uipp.UPDATE, this, this._uipp_update_in, this._uipp_update_out);
        this.uiproxy.addright(this.uipp.DELETE, this, this._uipp_delete_in, this._uipp_delete_out);
        this.uiproxy.addright(this.uipp.RESET, this, this._uipp_reset_in, this._uipp_reset_out);
        this.uiproxy.addright(this.uipp.MOVE, this, this._uipp_move_in, this._uipp_move_out);
        this.uiproxy.addright(this.uipp.SELECT, this, this._uipp_select_in, this._uipp_select_out);
        this.uiproxy.addright(this.uipp.UNBIND, this, this._uipp_unbind_in, this._uipp_unbind_out);

        this.uiproxy.runright_before = this._callback_runright_before;
        this.uiproxy.runleft_before = this._callback_runleft_before;

    }

    bindmodeltree.prototype = {

        construct: function() {
            this.init();
        },

        init: function() {
            this.superc(A.getModule("bindmodel"), 'init');
        },

        destroy: function() {
            this.superc(A.getModule("bindmodel"), 'destroy');
        },

        _callback_runright_before: function(uipp) {

            switch ( uipp ) {
                case this.uipp.UPDATE:
                case this.uipp.INSERT:
                case this.uipp.DELETE:
                case this.uipp.MOVE:
                case this.uipp.SELECT:
                    if ( uipp === this._last_running_uipp ) {
                        this._last_running_uipp = "";
                        return false;
                    }
                    this._last_running_uipp = uipp;
                    break;
                default:
                    this._last_running_uipp = "";
                    break;
            }
        },

        _callback_runleft_before: function(uipp) {

            switch ( uipp ) {
                case this.uipp.UPDATE:
                case this.uipp.INSERT:
                case this.uipp.DELETE:
                case this.uipp.MOVE:
                case this.uipp.SELECT:
                    if ( uipp === this._last_running_uipp ) {
                        this._last_running_uipp = "";
                        return false;
                    }
                    this._last_running_uipp = uipp;
                    break;
                default:
                    this._last_running_uipp = "";
                    break;
            }
        }

    };

    A.extendif(bindmodeltree.prototype, {

        __build: function(src, target) {
            var uiElement, uikey;

            for ( var i = 0; i < target.length; i++ ) {
                uiElement = target[ i ];

                if ( (uikey = uiElement.getAttribute(this.bindkey)) === null ) {
                    continue;
                }
                this.__additem(this.__createitem(uiElement));
            }

            return this.items.length;
        },

        __getPathAsArray: function() {
            var path = [];

            if ( A.isModule(this.src, "dataset.simple")) {
                var dataBindKey = this._getBindKey();
                if ( A.isNil(dataBindKey)) {
                    path = [];
                }

                path = this._convertToBindPathArray(dataBindKey);
            }

            return path;
        },

        __createitem: function(uie) {
            var newdata = {};

            newdata.ui_element = uie;
            return newdata;
        },

        __additem: function(item) {
            if ( !this.__existitem(item) ) {
                this.items.push(item);
            }
        },

        __finditem: function(item) {

            var founditem;

            for ( var ix = 0, len = this.items.length; ix < len; ix++ ) {
                founditem = this.items[ ix ];
                if ( founditem.ui_element === item.ui_element ) {   
                    return ix;
                }
            }

            return -1;
        },

        __popData: function(item) {
        },

        __pushData: function(item) {
        }

    });

    A.extendif(bindmodeltree.prototype, {

        __evtloadcomplete: function() {
            var args = arguments[ 0 ],
                records = [],
                retArgs = {
                    records: undefined,
                    isLoaded: undefined
                };

            if ( A.isModule(this.src, "dataset.table") ) {
                var rows = args.rows,
                    cols = args.cols;

                for ( var rx = 0, rlen = rows.length; rx < rlen; rx++ ) {
                    records[ rx ] = A.array2object(rows[ rx ], cols);
                }

                retArgs[ "records" ] = records;
            } else if ( A.isModule(this.src, "dataset.simple") ) {
                records = args[ "data" ];
                retArgs[ "records" ] = records[ this.dataBindKey ];
            } else {
                retArgs[ "records" ] = args[ "data" ] || [];
            }

            retArgs[ 'isLoaded' ] = (this.src.getDatasetState() == A.DS_STATE.LOADED) ? true : false;
            this.uiproxy.runright(this.uipp.LOAD, retArgs);
        },

        __evttransactionbegin: function() {
            this.uiproxy.runright(this.uipp.BEGINLOAD, arguments);
        },

        __evttransactionend: function() {
            this.uiproxy.runright(this.uipp.ENDLOAD, arguments);
        },

        __evttransactionerror: function() {
            this.uiproxy.runright(this.uipp.LOADERROR, arguments);
        },

        __evtreset: function() {
            this.pop();

            this.uiproxy.runright(this.uipp.RESET, {});
        },

        __evtchangedposition: function() {
            this.uiproxy.runright(this.uipp.MOVE, arguments[ 0 ]);
        },

        __evtchangeddata: function() {
            var args = arguments[ 0 ],
                retArgs = {
                    id: undefined,
                    value: undefined
                };

            if ( A.isModule(this.src, "dataset.table") ) {
                retArgs[ "id" ] = args[ "row" ].id;
                retArgs[ "value" ] = args[ "row" ];

            } else if ( A.isModule(this.src, "dataset.simple") ) {
                var extraArgs = args.extraArgs || {};

                if ( A.equalArray(args[ 'path' ], extraArgs[ 'changedPath' ]) ) {
                    retArgs = {
                        records: extraArgs[ 'newValue' ],
                        isLoaded: (this.src.getDatasetState() == A.DS_STATE.LOADED) ? true : false
                    };

                    this.uiproxy.runright(this.uipp.LOAD, retArgs);
                    return;
                } else {
                    retArgs[ 'value' ] = extraArgs[ 'newValue' ];
                    retArgs[ 'id' ] = extraArgs[ 'newValue' ].id;
                }

            } else {
                retArgs[ "id" ] = args[ "id" ];
                retArgs[ "value" ] = args[ "newItem" ];
            }

            this.uiproxy.runright(this.uipp.UPDATE, retArgs);

        },

        __evtdeleteddata: function() {
            var args = arguments[ 0 ],
                retArgs = {
                    id: undefined
                };

            if ( A.isModule(this.src, "dataset.table") ) {
                retArgs[ "id" ] = args[ "row" ].id;

            } else if ( A.isModule(this.src, "dataset.simple") ) {
                var extraArgs = args.extraArgs || {};

                if ( A.equalArray(args[ 'path' ], extraArgs[ 'deletedPath' ]) ) {
                    retArgs = {
                        records: args[ 'value' ],
                        isLoaded: (this.src.getDatasetState() == A.DS_STATE.LOADED) ? true : false
                    };

                    this.uiproxy.runright(this.uipp.LOAD, retArgs);
                    return;
                } else {
                    retArgs[ 'id' ] = extraArgs[ 'deletedValue' ].id;
                }
            } else {
                retArgs[ "id" ] = args[ "id" ];
            }

            this.uiproxy.runright(this.uipp.DELETE, retArgs);
        },

        __evtinserteddata: function() {
            var args = arguments[ 0 ],
                retArgs = {
                    id: undefined,
                    value: undefined
                };

            if ( A.isModule(this.src, "dataset.table") ) {
                retArgs[ "id" ] = args[ "row" ].id;
                retArgs[ "value" ] = args[ "row" ];

            } else if ( A.isModule(this.src, "dataset.simple") ) {
                var extraArgs = args.extraArgs || {};

                if ( A.equalArray(args[ 'path' ], extraArgs[ 'changedPath' ]) ) {
                    retArgs = {
                        records: extraArgs[ 'newValue' ],
                        isLoaded: (this.src.getDatasetState() == A.DS_STATE.LOADED) ? true : false
                    };

                    this.uiproxy.runright(this.uipp.LOAD, retArgs);
                    return;
                } else {
                    retArgs[ 'value' ] = extraArgs[ 'newValue' ];
                    retArgs[ 'id' ] = extraArgs[ 'newValue' ].id;
                }

            } else {
                retArgs[ "id" ] = args[ "id" ];
                retArgs[ "value" ] = args[ "value" ];
            }

            this.uiproxy.runright(this.uipp.INSERT, retArgs);
        },

        __evtselecteddata: function() {
            var args = arguments[ 0 ],
                retArgs = {
                    value: undefined
                };

            if ( A.isModule(this.src, "dataset.table") ) {
                var rowindex = args[ "currow" ];

                retArgs[ "value" ] = this.src.get([ rowindex ]);
            } else if ( A.isModule(this.src, "dataset.tree") ) {
                retArgs[ "value" ] = args[ "value" ];
            }

            this.uiproxy.runright(this.uipp.SELECT, retArgs);
        },

        __evtdestroy: function() {
            this.uiproxy.runright(this.uipp.UNBIND);
        }

    }, "OEMC");


    A.extendif(bindmodeltree.prototype, {
        _uipp_load_in: function() {

            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_load_out: function() {
            var args = {
                records: undefined,
                isLoaded: undefined
            };

            if ( A.isModule(this.src, "dataset.simple") ) {
                var path = this._getPathAsArray(); 
                args[ "records" ] = this.src.get(path);
            } else {
                args[ "records" ] = this.src.get([]);
            }

            args[ 'isLoaded' ] = (this.src.getDatasetState() == A.DS_STATE.LOADED) ? true : false;

            this.uiproxy.runright(this.uipp.LOAD, args);
        },

        _uipp_beginload_in: function() {
        },
        _uipp_beginload_out: function() {
        },

        _uipp_endload_in: function() {
        },
        _uipp_endload_out: function() {
        },

        _uipp_loaderror_in: function() {
        },
        _uipp_loaderror_out: function() {
        },

        _uipp_reset_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },
        _uipp_reset_out: function() {
        },

        _uipp_update_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },
        _uipp_update_out: function() {
            var item = arguments[ 0 ],
                id = arguments[ 1 ],
                newItem = {},
                index = -1, data,
                path = [];

            if ( A.isModule(this.src, "dataset.simple") ) {
                path.push(this.dataBindKey);
                data = this.src.get(path);
            } else {
                data = this.src.get();
            }

            for ( var idx = 0; idx < data.length; idx++ ) {
                if ( id == data[ idx ].id ) {
                    index = idx;
                    newItem = A.copyObject(data[ idx ]);
                    break;
                }
            }

            path.push(index);

            A.extendif(newItem, item, "OMC");

            this.src.set(path, newItem);
        },

        _uipp_insert_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_insert_out: function() {
            var item = arguments[ 0 ],
                targetItems = arguments[ 1 ],
                pos = arguments[ 2 ];

            if ( A.isModule(this.src, "dataset.table") ) {
                this.src.addRow(item);

            } else if ( A.isModule(this.src, "dataset.simple") ) {
                var data = this.src.get([ this.dataBindKey ]);

                this.src.set([ this.dataBindKey, data.length ], item);

            } else {
                if ( targetItems ) {
                    this.src.addNext(item, targetItems, pos);
                } else {
                    this.src.add(item);
                }
            }
        },

        _uipp_delete_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },
        _uipp_delete_out: function() {
            var id = arguments[ 0 ],
                index = -1, data,
                path = [];

            if ( A.isModule(this.src, "dataset.simple") ) {
                path.push(this.dataBindKey);
                data = this.src.get(path);
            } else {
                data = this.src.get();
            }

            for ( var idx = 0; idx < data.length; idx++ ) {
                if ( id == data[ idx ].id ) {
                    index = idx;
                    break;
                }
            }

            path.push(index);
            this.src.remove(path);
        },

        _uipp_move_in: function() {
            var args = Array.prototype.slice.call(arguments, 0),
                arg = args[ 0 ];

            if ( A.isModule(this.src, 'dataset.simple') ) {
                var path = this._getPathAsArray(); 
                args[ 'records' ] = this.src.get(path);
            } else {
                args[ 'records' ] = this.src.get([]);
            }

            return args;
        },

        _uipp_move_out: function() {
            var args = arguments[ 0 ],
                fromItem = args.fromItem,
                toItem = args.toItem,
                before = args.before;

            this.src.move(fromItem, toItem, before);
        },

        _uipp_select_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_select_out: function() {
            var id = arguments[ 0 ],
                selectedIndex,
                data;

            if ( A.isModule(this.src, "dataset.simple") ) {
                data = this.src.get([ this.dataBindKey ]);
            } else {
                data = this.src.get();
            }

            for ( var idx = 0; idx < data.length; idx++ ) {
                if ( id === data[ idx ].id ) {
                    selectedIndex = idx;
                    break;
                }
            }

            if ( A.isModule(this.src, "dataset.table") ) {
                this.src.setCurrentRowIndex(selectedIndex);

            } else if ( A.isModule(this.src, "dataset.tree") ) {
                this.src._setSelectedIndex(selectedIndex);
            }
        },

        _uipp_unbind_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_unbind_out: function() {
            this.uiproxy.runright(this.uipp.UNBIND);
        }

    });

    A.inherit(bindmodeltree, A.getModule("bindmodel"));
    A.extendModule(bindmodeltree, "bindmodel.tree");

})(Camellia);


(function(A) {

    "use strict";

    function bindmodelgrid(options) {

        if ( !(this instanceof bindmodelgrid) ) {
            return new bindmodelgrid(options);
        }
        if ( bindmodelgrid._super_proto_ !== undefined ) {
            bindmodelgrid._super_constructor(this, arguments);
        }

        this._last_running_uipp = "";

        this.uiproxy.addright(this.uipp.LOAD, this, this._uipp_load_in, this._uipp_load_out);
        this.uiproxy.addright(this.uipp.SELECT, this, this._uipp_selectrow_in, this._uipp_selectrow_out);
        this.uiproxy.addright(this.uipp.BEGINLOAD, this, this._uipp_beginload_in, this._uipp_beginload_out);
        this.uiproxy.addright(this.uipp.ENDLOAD, this, this._uipp_endload_in, this._uipp_endload_out);
        this.uiproxy.addright(this.uipp.LOADERROR, this, this._uipp_loaderror_in, this._uipp_loaderror_out);
        this.uiproxy.addright(this.uipp.RESET, this, this._uipp_reset_in, this._uipp_reset_out);
        this.uiproxy.addright(this.uipp.UPDATE, this, this._uipp_updaterow_in, this._uipp_updaterow_out);
        this.uiproxy.addright(this.uipp.INSERT, this, this._uipp_insertrow_in, this._uipp_insertrow_out);
        this.uiproxy.addright(this.uipp.DELETE, this, this._uipp_deleterow_in, this._uipp_deleterow_out);
        this.uiproxy.addright(this.uipp.LOADRANGE, this, this._uipp_loadrange_in, this._uipp_loadrange_out);
        this.uiproxy.addright(this.uipp.UNBIND, this, this._uipp_unbind_in, this._uipp_unbind_out);

        this.uiproxy.runright_before = this._callback_runright_before;
        this.uiproxy.runleft_before = this._callback_runleft_before;

        this._preReceivedInfoBeforeUIReady = null;
    }


    bindmodelgrid.prototype = {
        construct: function() {
            this.init();
        },

        init: function() {
            this.superc(A.getModule("bindmodel"), 'init');
        },

        destroy: function() {
            this.superc(A.getModule("bindmodel"), 'destroy');
        },

        _callback_runright_before: function(uipp) {

            switch ( uipp ) {
                case this.uipp.UPDATE:
                case this.uipp.INSERT:
                case this.uipp.DELETE:
                case this.uipp.SELECT:
                    if ( uipp === this._last_running_uipp ) {
                        this._last_running_uipp = "";
                        return false;
                    }
                    this._last_running_uipp = uipp;
                    break;
                default:
                    this._last_running_uipp = "";
                    break;
            }
        },

        _callback_runleft_before: function(uipp) {

            switch ( uipp ) {
                case this.uipp.UPDATE:
                case this.uipp.INSERT:
                case this.uipp.DELETE:
                case this.uipp.SELECT:
                    if ( uipp === this._last_running_uipp ) {
                        this._last_running_uipp = "";
                        return false;
                    }
                    this._last_running_uipp = uipp;
                    break;
                default:
                    this._last_running_uipp = "";
                    break;
            }
        }

    };

    A.extendif(bindmodelgrid.prototype, {
        __build: function(src, target) {
            var uikey, uiElement;

            for ( var i = 0; i < target.length; i++ ) {
                uiElement = target[ i ];

                if ( (uikey = uiElement.getAttribute(this.bindkey)) === null ) {
                    continue;
                }
                this.__additem(this.__createitem(uiElement, uikey));
            }

            return this.items.length;
        },

        __getPathAsArray: function() {
            var path = [];

            if ( A.isModule(this.src, "dataset.simple")) {
                var dataBindKey = this._getBindKey();
                if (A.isNil(dataBindKey)) {
                    path = [];
                }

                path = this._convertToBindPathArray(dataBindKey);
            }

            return path;
        },

        __createitem: function(uie, uikey) {
            var newdata = {};

            newdata.ui_element = uie;
            newdata.uikey = uikey;
            return newdata;
        },

        __additem: function(item) {
            if ( !this.__existitem(item) ) {
                this.items.push(item);
            }
        },

        __finditem: function(item) {

            var founditem;

            for ( var ix = 0, len = this.items.length; ix < len; ix++ ) {
                founditem = this.items[ ix ];
                if ( founditem.ui_element === item.ui_element ) {   
                    return ix;
                }
            }

            return -1;
        },

        __popData: function(item, rowidx) {
            rowidx = rowidx || 0;

            this.__popRowData(item, rowidx);
        },

        _popRow: function(rowidx) {
            if ( this.src.get().length <= 0 ) {
                return {};
            }
            return this.src.get([ rowidx ]);
        },

        __popRowData: function(item, rowidx) {
            var elm = item.ui_element,
                tagName = elm.tagName.toLowerCase(),
                val = this._popRow(rowidx);

            switch ( tagName ) {
                case "input" :
                case "select" :
                case "textarea" :
                    elm.value = val[ item.uikey ];
                    break;
                default:
                    elm.text = val[ item.uikey ];
                    break;
            }
        },


        __pushData: function(item, rowidx) {
            this.__pushRowData(item, rowidx);
        },

        __pushRowData: function(item, rowidx) {
            var elm = item.ui_element,
                tagName = elm.tagName.toLowerCase(),
                uikey = item.uikey,
                newValue;

            switch ( tagName ) {
                case "input" :
                case "select" :
                case "textarea" :
                    newValue = elm.value;
                    break;
                default:
                    newValue = elm.text;
                    break;
            }

            this.src.set([ rowidx, uikey ], newValue);
        }
    });


    A.extendif(bindmodelgrid.prototype, {

        __evtloadcomplete: function() {
            var evtparams = arguments[ 0 ],
                records = [],
                args = {
                    records: undefined,
                    startindex: evtparams.startindex || 0,
                    readindex: evtparams.readindex,
                    readcount: evtparams.readcount,
                    rowcount: undefined,
                    isLoaded: undefined
                };


            if ( A.isModule(this.src, "dataset.simple") ) {
                var d = evtparams.data;
                records = d[ this.dataBindKey ];
            } else if ( A.isModule(this.src, "dataset.tree") ) {
                records = evtparams.data || [];
            } else {
                var rows = evtparams.rows,
                    cols = evtparams.cols;   

                A.assert(evtparams.rows !== undefined, "invalid response - LOADCOMPLETE");

                for ( var rx = 0, rlen = rows.length; rx < rlen; rx++ ) {
                    records[ rx ] = A.array2object(rows[ rx ], cols);
                }
            }

            args.records = records;
            args.rowcount = ( args.readindex !== undefined &&
            args.readindex >= 0 ? evtparams.rowcount : records.length );
            args[ 'isLoaded' ] = (this.src.getDatasetState() == A.DS_STATE.LOADED) ? true : false;

            this._preReceivedInfoBeforeUIReady = args;

            this.uiproxy.runright(this.uipp.LOAD, args);
        },

        __evttransactionbegin: function() {
            this.uiproxy.runright(this.uipp.BEGINLOAD, arguments);
        },

        __evttransactionend: function() {
            this.uiproxy.runright(this.uipp.ENDLOAD, arguments);
        },

        __evttransactionerror: function() {
            this.uiproxy.runright(this.uipp.LOADERROR, arguments);
        },

        __evtreset: function() {
            this.pop();

            this.uiproxy.runright(this.uipp.RESET, arguments);
        },

        __evtchangedposition: function() {
        },

        __evtselecteddata: function() {
            var args = arguments[ 0 ],
                retArgs = {
                    selectedIndex: -1,
                    records: undefined
                };

            if ( A.isModule(this.src, "dataset.table") ) {
                retArgs[ "selectedIndex" ] = (args[ "currow" ] == undefined) ? -1 : args[ "currow" ];

            } else if ( A.isModule(this.src, "dataset.tree") ) {
                retArgs[ "selectedIndex" ] = (args[ "selectedIndex" ] == undefined) ? -1 : args[ "selectedIndex" ];
            }

            retArgs[ "records" ] = this.src.get(this._getPathAsArray());

            this.uiproxy.runright(this.uipp.SELECT, retArgs);
        },

        __evtchangeddata: function() {
            var args = arguments[ 0 ],
                retArgs = {
                    row: undefined,
                    rowindex: undefined
                };

            if ( A.isModule(this.src, "dataset.tree") ) {
                var newRow = A.object2array(args.newItem);

                retArgs[ "row" ] = newRow;
                retArgs[ "rowindex" ] = this.src._getIndexById(args.id);
            } else {
                retArgs[ "row" ] = args[ "row" ];
                retArgs[ "rowindex" ] = args[ "rowindex" ];
            }

            this.uiproxy.runright(this.uipp.UPDATE, retArgs);
        },

        __evtdeleteddata: function() {
            var args = arguments[ 0 ],
                retArgs = {
                    rowindex: undefined
                };

            if ( A.isModule(this.src, "dataset.tree") ) {
                retArgs[ "rowindex" ] = args[ "deleteItemIndex" ];
            } else {
                retArgs[ "rowindex" ] = args[ "rowindex" ];
            }

            this.uiproxy.runright(this.uipp.DELETE, retArgs);
        },

        __evtinserteddata: function() {
            var args = arguments[ 0 ],
                retArgs = {
                    row: undefined,
                    rowindex: undefined
                };

            if ( A.isModule(this.src, "dataset.tree") ) {
                var newRow = A.object2array(args.value);

                retArgs[ "row" ] = newRow;
                retArgs[ "rowindex" ] = this.src._getIndexById(args.id);
            } else {
                retArgs[ "row" ] = args[ "row" ];
                retArgs[ "rowindex" ] = args[ "rowindex" ];
            }

            this.uiproxy.runright(this.uipp.INSERT, retArgs);
        },

        __evtdestroy: function() {
            this.uiproxy.runright(this.uipp.UNBIND);
        }

    }, "OEMC");


    A.extendif(bindmodelgrid.prototype, {
        _uipp_load_in: function() {

            var args = Array.prototype.slice.call(arguments, 0);
            return args;
        },

        _uipp_load_out: function() {
            var args = {
                    records: undefined,
                    startindex: 0,
                    readindex: undefined,
                    readcount: undefined,
                    rowcount: undefined,
                    isLoaded: undefined
                },
                _ds = this.src;

            if ( _ds ) {
                args.records = _ds.get([]);
                args.rowcount = args.records.length;
                args[ 'isLoaded' ] = (this.src.getDatasetState() == A.DS_STATE.LOADED) ? true : false;

                if ( this._preReceivedInfoBeforeUIReady ) {
                    args.rowcount = ( args.readindex !== undefined &&
                    args.readindex >= 0 ? this._preReceivedInfoBeforeUIReady.rowcount : args.records.length );
                    args.readindex = this._preReceivedInfoBeforeUIReady.readindex;
                    args.readcount = this._preReceivedInfoBeforeUIReady.readcount;
                    this._preReceivedInfoBeforeUIReady = null;
                }
            }

            this.uiproxy.runright(this.uipp.LOAD, args);
        },

        _uipp_selectrow_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },
        _uipp_selectrow_out: function() {
            var _ds = this.src,
                args = arguments[ 0 ];

            if ( A.isModule(_ds, "dataset.table") ) {
                _ds.setCurrentRowIndex(args);

            } else if ( A.isModule(_ds, "dataset.tree") ) {
                _ds._setSelectedIndex(args);
            }
        },

        _uipp_beginload_in: function() {
        },
        _uipp_beginload_out: function() {
        },

        _uipp_endload_in: function() {
        },
        _uipp_endload_out: function() {
        },

        _uipp_loaderror_in: function() {
        },
        _uipp_loaderror_out: function() {
        },

        _uipp_reset_in: function() {
        },
        _uipp_reset_out: function() {
        },

        _uipp_updaterow_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },
        _uipp_updaterow_out: function() {
            var _ds = this.src,
                rowindex = arguments[ 0 ],
                rowdata = arguments[ 1 ];

            _ds.set([ rowindex ], rowdata);
        },

        _uipp_insertrow_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_insertrow_out: function() {
            var _ds = this.src,
                pos = arguments[ 0 ],
                rowdata = arguments[ 1 ];

            if ( A.isModule(_ds, "dataset.table") ) {

                if ( A.isNumber(pos) ) {
                    _ds.insertRow(rowdata, pos);
                }
                else {
                    _ds.addRow(rowdata, pos);
                }
            } else if ( A.isModule(_ds, "dataset.tree") ) {
                _ds.add(rowdata);
            }

        },

        _uipp_deleterow_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },
        _uipp_deleterow_out: function() {
            var _ds = this.src,
                rowindex = arguments[ 0 ];

            _ds.remove([ rowindex ]);
        },

        _uipp_loadrange_in: function() {
        },
        _uipp_loadrange_out: function() {
            var _ds = this.src,
                _dynmode = _ds.dynamicmode(),
                readindex = arguments[ 0 ],
                readcount = arguments[ 1 ],
                _reqparam = arguments[ 2 ],
                _reqObj = {
                    readtype: A.DS_READTYPE.READ_RANGE,
                    readindex: readindex,
                    readcount: readcount,
                    async: true,
                    data: {},
                    headers: {},
                    notrans: false
                };

            if ( _dynmode ) {
                var _dynsize = _ds.getDynamicRowCount(),
                    _realsize = _ds.getRealRowCount(),
                    _reqObj = { notrans: true };

                if ( readindex !== undefined ) {
                    _reqObj[ "readindex" ] = readindex;
                }

                if ( readcount !== undefined ) {
                    _reqObj[ "readcount" ] = readcount;
                }

                if ( _reqparam !== undefined && _reqparam.notrans !== undefined ) {
                    _reqObj.notrans = _reqparam.notrans;
                }

                if ( !_ds.status(A.DS_STATUS.STAT_DYNAMICLOAD_COMPLETED) && _dynsize < _realsize ) {
                    _ds.requestTransaction(_reqObj);
                }

            } else {

                if ( _reqparam !== undefined ) {
                    A.extendif(_reqObj, _reqparam, 'OMC');  

                    _reqObj.readindex = arguments[ 0 ];
                    _reqObj.readcount = arguments[ 1 ];
                }

                _ds.requestTransaction(_reqObj);
            }
        },

        _uipp_unbind_in: function() {
            return Array.prototype.slice.call(arguments, 0);
        },

        _uipp_unbind_out: function() {
            this.uiproxy.runright(this.uipp.UNBIND);
        }
    });

    A.inherit(bindmodelgrid, A.getModule("bindmodel"));
    A.extendModule(bindmodelgrid, "bindmodel.table");

})(Camellia);


(function(A) {

    "use strict";

    var
        DV = 0,
        DK = 1,

        Lctx = 2,
        Lfin = 3,
        Lfout = 4,

        Rctx = 5,
        Rfin = 6,
        Rfout = 7;


    function funcroutetable(options) {

        if ( !(this instanceof funcroutetable) ) {
            return new funcroutetable(options);
        }

        this.table = [];
        this.tablekey = {};

        this.runleft_before = null;      
        this.runleft_after = null;
        this.runright_before = null;    
        this.runright_after = null;     
    }

    funcroutetable.prototype = {

        destroy: function() {
            this._clearData();
            this.table = null;
            this.tablekey = null;
        },

        addleft: function(key, ctx, funcin, funcout) {
            var args = Array.prototype.slice.call(arguments);
            args.push("left");

            this._addData.apply(this, args);
        },

        addright: function(key, ctx, funcin, funcout) {
            var args = Array.prototype.slice.call(arguments);
            args.push("right");

            this._addData.apply(this, args);
        },

        removeleft: function(key) {
            var args = Array.prototype.slice.call(arguments);
            args.push("left");

            this._removeData.apply(this, args);
        },

        removeright: function() {
            var args = Array.prototype.slice.call(arguments);
            args.push("right");

            this._removeData.apply(this, args);
        },

        runleft: function() {
            var key = arguments[ 0 ],
                args = Array.prototype.slice.call(arguments, 1),
                data = this._findData(key),
                retArg;

            if ( data && this._isValid(data) ) {

                if ( this.runleft_before ) {
                    var bret = this.runleft_before.call(data[ Rctx ], key, args);
                    if ( bret === false ) {
                        return;
                    }
                }

                if ( args ) {
                    retArg = data[ Lfin ].apply(data[ Lctx ], args);
                }
                else {
                    retArg = data[ Lfin ].call(data[ Lctx ]);
                }

                if ( A.isArray(retArg) ) {
                    data[ Rfout ].apply(data[ Rctx ], retArg);
                }
                else if ( A.isPlainObject(retArg) ) {
                    data[ Rfout ].call(data[ Rctx ], retArg);
                }
                else {
                    data[ Rfout ].call(data[ Rctx ]);
                }

                if ( this.runleft_after ) {
                    this.runleft_after.call(data[ Rctx ], key);
                }

            }
        },

        runright: function() {
            var key = arguments[ 0 ],
                args = Array.prototype.slice.call(arguments, 1),
                data = this._findData(key),
                retArg;

            if ( data && this._isValid(data) ) {

                if ( this.runright_before ) {
                    var bret = this.runright_before.call(data[ Rctx ], key);
                    if ( bret === false ) {
                        return;
                    }
                }

                if ( args ) {
                    retArg = data[ Rfin ].apply(data[ Rctx ], args);
                }
                else {
                    retArg = data[ Rfin ].call(data[ Rctx ]);
                }

                if ( A.isArray(retArg) ) {
                    data[ Lfout ].apply(data[ Lctx ], retArg);
                }
                else if ( A.isPlainObject(retArg) ) {
                    data[ Lfout ].call(data[ Lctx ], retArg);
                }
                else {
                    data[ Lfout ].call(data[ Lctx ]);
                }

                if ( this.runright_after ) {
                    this.runright_after.call(data[ Rctx ], key);
                }
            }
        },

        _makeEmptyData: function() {
            return [ 0x0000, null, null, null, null, null, null, null ];
        },

        _findData: function(key) {
            var arryindex = this.tablekey[ key ];
            return (arryindex >= 0) ? this.table[ arryindex ] : null;
        },

        _clearData: function() {
            var arry,
                Lidx = this.table.length - 1;

            while ( Lidx-- >= 0 ) {
                arry = this.table.splice(Lidx, 1);
                arry.splice(0, arry.length);
            }
        },

        _isValid: function(key) {
            var d = key;

            if ( A.isArray(d) ) {
                return ( d[ DV ] === 0x0011 );
            }

            d = this._findData(key);
            A.assert((d !== null), "not found data (key = " + key + ")");

            return ( d[ DV ] === 0x0011 );
        },

        _addData: function() {
            A.assert(arguments.length === 5, "when add data into table, it occurs wrong argument");

            var kind = arguments[ arguments.length - 1 ],
                key = arguments[ 0 ],
                ctx = arguments[ 1 ],
                fin = arguments[ 2 ],
                fout = arguments[ 3 ],
                newd = this._findData(key);

            if ( !newd ) {
                newd = this._makeEmptyData();
                newd[ DK ] = key;
                this.tablekey[ key ] = this.table.push(newd) - 1;
            }


            if ( kind === "left" ) {
                newd[ DV ] = newd[ DV ] | 0x0010;
                newd[ Lctx ] = ctx;
                newd[ Lfin ] = fin;
                newd[ Lfout ] = fout;
            }
            else {  
                newd[ DV ] = newd[ DV ] | 0x0001;
                newd[ Rctx ] = ctx;
                newd[ Rfin ] = fin;
                newd[ Rfout ] = fout;
            }

            return this.table.length;
        },

        _removeData: function() {

            var key = arguments[ 0 ],
                kind = arguments[ 1 ];

            var d = this._findData(key);

            if (kind == 'left') {
                d[ DV ] = d [ DV ] & ~(0x0010);
                d[ Lctx ] = null;
                d[ Lfin ] = null;
                d[ Lfout ] = null;
            } else {
                d[ DV ] = d [ DV ] & ~(0x0001);
                d[ Rctx ] = null;
                d[ Rfin ] = null;
                d[ Rfout ] = null;
            }
        }

    };

    A.extendModule(funcroutetable);

})(Camellia);


(function(A) {

    "use strict";

    if ( A === undefined || A === null ) {
        throw new Error("Camellia is undefined or null");
    }

    var DS_STATE = {
        INITIALIZED: "dataInitialized",
        LOADED: "dataLoaded",
        RESET: "dataReset"
    }

    var _hasOwnProperty = Object.prototype.hasOwnProperty;

    function _merge(arr1, arr2) {
        var i, j, exist, result = arr1.slice(0);
        for ( i = 0; i < arr2.length; i++ ) {
            exist = false;
            for ( j = 0; j < result.length; j++ ) {
                if ( arr2[ i ] === result[ j ] ) {
                    exist = true;
                    break;
                }
            }
            if ( !exist ) {
                result.push(arr2[ i ]);
            }
        }
        return result;
    }

    function datasetbase(options) {
        if ( !(this instanceof datasetbase) ) {
            return new datasetbase(options);
        }

        options = options || {};
        this.options = options;

        this.namespaces = [];
        this.events = A.createModule("events", this.EVENTS);
        this._initialDataChanged = false;

        this._state = A.DS_STATE.INITIALIZED;

        this.__createData(options);
    }

    datasetbase.prototype = {

        construct: function() {
        },

        __createData: function(options) {
            this.data = options.data ? options.data : {};

            if (!A.isNil(options.data)) {
                this.setDatasetState(A.DS_STATE.LOADED);
            }
        },

        EVENTS: {
            CHANGED_DATA: "eventChangedData",
            ADDED_DATA: "eventAddedData",
            DELETED_DATA: "eventDeletedData",
            SELECTED_DATA: "eventSelectedData",

            RESETDATASET: "eventResetDataset",
            CHANGED_POSITION: 'eventChangedPosition',

            TRANSACTION_BEGIN: "eventTransactionBegin",
            TRANSACTION_RESPONSE: "eventTransactionResponse",
            LOADCOMPLETE: "eventLoadComplete",
            TRANSACTION_END: "eventTransactionEnd",
            TRANSACTION_ERROR: "eventTransactionError",
            TRANSACTION_REQUEST: 'eventTransactionRequest',
            DESTROY: 'eventDestroyDataset'
        },

        getDatasetState: function() {
            return this._state;
        },

        setDatasetState: function(state) {
            this._state = state;
        },

        destroy: function() {
            this.data = null;

            if ( this.events ) {
                this.events.fire(this.EVENTS.DESTROY);
                this.events.destroy();
                this.events = null;
            }
        },

        clear: function() {
            this.data = {};

            this.events.fire(this.EVENTS.RESETDATASET);
        },

        _hasPath: function(path) {
            var parent = this.data,
                pathLastIndex = path.length;

            for ( var i = 0; i < pathLastIndex; i++ ) {
                if ( !_hasOwnProperty.call(parent, path[ i ]) ) {
                    return false;
                }

                parent = parent[ path[ i ] ];
            }

            return true;
        },

        set: function() {
            var path, newval;

            A.assert(arguments.length <= 2, "invalid arguments");

            if ( arguments.length == 1 ) {
                path = [];
                newval = arguments[ 0 ];
            } else {
                path = arguments[ 0 ];
                newval = arguments[ 1 ];
            }

            if ( path.length == 0 ) {
                A.assert(A.isPlainObject(newval) || A.isArray(newval), "data must be a plain object or a array object");
            }

            var i, parent, target, namespaces, pathLastIndex;
            path = this._normalize(path);

            if ( !this._hasPath(path) ) {
                this.add(path, newval);
            } else {
                parent = this.data;

                pathLastIndex = path.length - 1;
                for ( i = 0; i < pathLastIndex; i++ ) {
                    parent = parent[ path[ i ] ];
                }

                if ( path.length === 0 ) {
                    target = this.data;
                    this.data = newval;

                    if ( target !== newval ) {
                        namespaces = this._findNamespaces();
                        for ( var i = 0; i < namespaces.length; i++ ) {
                            var beforePath = namespaces[ i ].path,
                                newData = newval,
                                isExist = true;

                            for ( var j = 0; j < beforePath.length; j++ ) {
                                if ( !_hasOwnProperty.call(newData, beforePath[ j ]) ) {
                                    var oldValue = this._getRef.call(this, beforePath, A.copyObject(target)),
                                        eventArgs = {
                                            path: A.copyObject(beforePath),
                                            value: this.get(beforePath),
                                            extraArgs: {
                                                changedPath: A.copyObject(beforePath),
                                                newValue: undefined,
                                                oldValue: oldValue
                                            }
                                        };

                                    this.events.fire(this.EVENTS.CHANGED_DATA + "." + namespaces[ i ].ns, eventArgs);
                                    isExist = false;
                                    break;
                                }
                                newData = newData[ beforePath[ j ] ];
                            }

                            if ( isExist ) {
                                this.events.fire(this.EVENTS.LOADCOMPLETE + "." + namespaces[ i ].ns, { data: A.copyObject(newData) });
                                this.setDatasetState(A.DS_STATE.LOADED);
                            }
                        }
                    }
                } else {
                    target = parent[ path[ i ] ];
                    parent[ path[ i ] ] = newval;

                    if ( target !== newval ) {
                        namespaces = this._findNsRelatedTo(path);

                        for ( var i = 0; i < namespaces.length; i++ ) {
                            var eventArgs = {
                                path: A.copyObject(namespaces[ i ].path),
                                value: this.get(namespaces[ i ].path),
                                extraArgs: {
                                    changedPath: A.copyObject(path), 
                                    newValue: A.copyObject(newval),  
                                    oldValue: A.copyObject(target)   
                                }
                            };

                            this.events.fire(this.EVENTS.CHANGED_DATA + "." + namespaces[ i ].ns, eventArgs);
                        }
                    }
                }
            }

            this._initialDataChanged = true;
        },

        remove: function(path) {
            var i, temp, parent, namespaces, deletedItem;

            path = path || [];

            path = this._normalize(path);
            if ( path.length === 0 ) {
                for ( i in this.data ) {
                    delete this.data[ i ];
                }
                return true;
            }

            parent = this._getRef.call(this, path.slice(0, path.length - 1));
            if ( parent === undefined || parent === null ) {
                return false;
            }

            if ( _hasOwnProperty.call(parent, path[ path.length - 1 ]) ) {

                namespaces = this._findNsRelatedTo(path);
                if ( parent instanceof Array ) {
                    deletedItem = parent[ path[ path.length - 1 ] ];
                    parent.splice(path[ path.length - 1 ], 1);
                    for ( i = path[ path.length - 1 ]; i < parent.length; i++ ) {
                        temp = path.slice(0, path.length - 1);
                        temp.push(i);
                        namespaces = _merge(namespaces, this._findNsRelatedTo(temp));
                    }
                } else {
                    deletedItem = parent[ path[ path.length - 1 ] ];
                    delete parent[ path[ path.length - 1 ] ];
                }


                for ( i = 0; i < namespaces.length; i++ ) {
                    var eventArgs = {
                        path: A.copyObject(namespaces[ i ].path),
                        value: this.get(namespaces[ i ].path),
                        extraArgs: {
                            deletedPath: A.copyObject(path),         
                            deletedValue: A.copyObject(deletedItem), 
                        }
                    };

                    this.events.fire(this.EVENTS.DELETED_DATA + "." + namespaces[ i ].ns, eventArgs);
                    this._initialDataChanged = true;
                }
                return true;
            }

            return false;
        },

        get: function(path) {
            path = path || [];

            path = this._normalize(path);
            if ( path === undefined ) {
                return undefined;
            }
            var result = this._getRef.call(this, path);
            return A.copyObject(result);
        },

        length: function(path) {
            path = path || [];

            path = this._normalize(path);
            var result = this._getRef.call(this, path);
            if ( result === null || result === undefined ) {
                return undefined;
            } else {
                return result.length;
            }
        },

        eventOn: function(ename, efunc, ctx, async, path) {
            if( A.isNil(path)) {
                this.on(ename, efunc, ctx, async);
            } else {
                this.on(ename, path, efunc, ctx, async);
            }
        },

        eventOff: function(ename, efunc, ctx, path) {
            if( A.isNil(path)) {
                this.off(ename, efunc, ctx);
            } else {
                this.off(ename, path, efunc, ctx);
            }
        },

        requestTransaction: function(reqObject, optcomm, optcommparam) {
            var localmode = A.isFunction(this.localmode) ? this.localmode() : this.localmode;

            reqObject = reqObject || {};

            if ( reqObject.url ) {
                localmode = false;
            }

            A.assert(reqObject && A.isPlainObject(reqObject), "Parameter of requestTransaction must be object type");
            A.assert(localmode == false, "localmode must be true when using requestTransaction");
            A.assert(((reqObject.url && reqObject.url != "") || this.url != ""), "url is empty");
        },

        buildRequest: function(options) {
            return this.__buildRequest(options);
        },

        buildResponse: function(data) {
            return this.__buildResponse(data);
        },

        __buildRequest: function() {
        },

        __buildResponse: function(data) {
            return data;
        },

        verify: function(data) {
            return this.__verify(data);
        },

        __callbackSuccess: function(response, request, options) {
        },
        __callbackError: function(response, ajaxerroraguments) {
        },

        clearTransaction: function() {
        },

        _normalize: function(path) {
            var i, j, k, idx, result = []
                , parent = this.data;

            for ( i = 0; i < path.length; i++ ) {
                if ( typeof path[ i ] === "object" ) {
                    idx = -1;

                    for ( var j in parent ) {
                        for ( k in path[ i ] ) {
                            if ( parent[ j ][ k ] === path[ i ][ k ] ) {
                                idx = j;
                            } else {
                                idx = -1;
                                break;
                            }
                        }
                        if ( idx >= 0 ) {
                            break;
                        }
                    }
                    if ( idx < 0 ) {
                        return undefined;
                    }
                    result.push(idx);
                    parent = parent[ idx ];
                } else {
                    result.push(path[ i ]);
                    if ( parent && typeof parent === "object" ) {
                        parent = parent[ path[ i ] ];
                    }
                }
            }

            return result;
        },

        _getRef: function(path, srcData) {
            var i, result;

            result = srcData || this.data;
            for ( i = 0; i < path.length; i++ ) {
                if ( result === undefined || result === null ) {
                    return undefined;
                }

                if ( !_hasOwnProperty.call(result, path[ i ]) ) {
                    return undefined;
                }

                result = result[ path[ i ] ];

            }
            return result;
        },

        _getNs: function(path) {
            var i, strPath = JSON.stringify(path);
            for ( i = 0; i < this.namespaces.length; i++ ) {
                if ( JSON.stringify(this.namespaces[ i ].path) === strPath ) {
                    return this.namespaces[ i ].ns;
                }
            }

            this.namespaces.push({
                path: A.copyObject(path),
                ns: "ns" + this.namespaces.length
            });
            return this.namespaces[ this.namespaces.length - 1 ].ns;
        },

        _findNsRelatedTo: function(path) {
            var i, result = []
                , p1, p2
                , strPath = JSON.stringify(path);

            for ( i = 0; i < this.namespaces.length; i++ ) {
                if ( this.namespaces[ i ].path.length < path.length ) {
                    p1 = JSON.stringify(this._normalize(this.namespaces[ i ].path));
                    p2 = JSON.stringify(this._normalize(path.slice(0, this.namespaces[ i ].path.length)));
                } else if ( this.namespaces[ i ].path.length > path.length ) {
                    p1 = JSON.stringify(this._normalize(this.namespaces[ i ].path.slice(0, path.length)));
                    p2 = strPath;
                } else {
                    p1 = JSON.stringify(this._normalize(this.namespaces[ i ].path));
                    p2 = strPath;
                }
                if ( p1 === p2 ) {
                    result.push(this.namespaces[ i ]);
                }
            }
            return result;
        },

        _findNamespaces: function() {
            return this.namespaces;
        }
    };

    A.extendModule(datasetbase);
    A.DS_STATE = A.copyObject(DS_STATE);

})(Camellia);

(function(A) {

    "use strict";

    if ( A === undefined || A === null ) {
        throw new Error("Camellia is undefined or null");
    }

    var REQUEST_DATASET_TYPE = '__AUI_DATASET_SIMPLE__';
    var _hasOwnProperty = Object.prototype.hasOwnProperty;

    function _booleanOr(t, or) {
        if ( A.isBoolean(t) === true ) {
            return t;
        }
        else {
            return or;
        }
    }

    function simpledataset(options) {

        if ( !(this instanceof simpledataset) ) {
            return new simpledataset(options);
        }

        if ( simpledataset._super_proto_ !== undefined ) {
            simpledataset._super_constructor(this, arguments);
        }

        options = options || {};

        this.id = options.id || A.generateUUID();
        this.url = options.url || "";
        this.autoload = options.autoload || false;

        this.localmode = _booleanOr(options.localmode, ((this.url.length > 0) ? false : true));
        this.reqobject = options.reqobject || { readtype: A.DS_READTYPE.READ_ALL };

        this.readtype = (this.reqobject.readtype != undefined) ? this.reqobject.readtype : A.DS_READTYPE.READ_ALL;
        this.events.parseOption(options, this);


    }

    simpledataset.prototype =
    {
        construct: function(options, comm, commparam) {
            this.init(comm, commparam);
        },

        init: function(comm, commparam) {
            if ( this.autoload ) {
                var reqOptions = { url: this.url };

                A.extendif(reqOptions, this.reqobject || {}, "OEMC");
                this.requestTransaction(reqOptions, comm, commparam);
            }
        },

        destroy: function() {
            this.superc(A.getModule("datasetbase"), 'destroy');
        },

        __createData: function(options) {
            this.data = options.data ? options.data : {};

            if (!A.isNil(options.data)) {
                this.setDatasetState(A.DS_STATE.LOADED);
            }
        },

        changeSelectedKey: function(path) {
            var namespaces = this._findNsRelatedTo(path);

            for ( var i = 0; i < namespaces.length; i++ ) {
                this.events.fire(this.EVENTS.SELECTED_DATA + "." + namespaces[ i ].ns, {});
            }
        },

        add: function(path, value) {
            A.assert(arguments.length == 2, "invalid arguments");

            var data = this.data,
                oldData,
                namespaces,
                i,
                pathLastIndex = path.length - 1;

            for ( i = 0; i < pathLastIndex; i++ ) {
                if ( !_hasOwnProperty.call(data, path[ i ]) ) {
                    if ( typeof path[ i + 1 ] === 'number' ) {
                        data[ path[ i ] ] = [];
                    } else {
                        data[ path[ i ] ] = {};
                    }
                }
                data = data[ path[ i ] ];
            }

            if ( path.length == 0 ) {
                oldData = this.data;
                this.data = value;
            } else {
                oldData = data[ path[ i ] ];

                if ( !_hasOwnProperty.call(data, path[ i ]) ) {
                    data[ path[ i ] ] = value;
                } else {

                    if ( A.isArray(data) ) {
                        data.splice(path[ i ], 0, value);
                    } else {
                        data[ path[ i ] ] = value;
                    }
                }
            }

            if ( oldData != value ) {
                namespaces = this._findNsRelatedTo(path);

                for ( var idx = 0, len = namespaces.length; idx < len; idx++ ) {
                    this.events.fire(this.EVENTS.ADDED_DATA + "." + namespaces[ idx ].ns, {
                        path: A.copyObject(namespaces[ idx ].path),
                        value: this.get(namespaces[ idx ].path),
                        extraArgs: {
                            changedPath: A.copyObject(path),
                            oldValue: undefined,
                            newValue: this.get(path)
                        }
                    });

                    this._initialDataChanged = true;
                }
            }
        },

        getDataStatus: function() {
            return this._initialDataChanged ? 'edited' : 'none';
        },

        getType: function(path) {
            path = path || [];

            var item = this.get(path),
                type = typeof item;

            if ( type == 'object' && A.isArray(item) ) {
                type = 'array';
            }

            return type;
        },

        isEqual: function(path, value) {
            path = path || [];

            var d = this.get(path);

            if (A.isPlainObject(d)) {
                return A.equalObject(d, value);
            } else if(A.isArray(d)) {
                return A.equalArray(d, value);
            } else {
                return d == value;
            }
        },

        getCount: function(path) {
            path = path || [];

            var item = this.get(path),
                retLength = 0;

            if ( !item ) {
                return retLength;
            }

            if ( A.isObject(item) ) {
                retLength = Object.keys(item).length;
            } else if ( A.isArray(item) ) {
                retLength = item.length;
            } else {
                retLength = 1;
            }

            return retLength;
        },

        getKeys: function(path) {
            path = A.isNil(path) ? [] : path;

            var data = this.get(path);

            if (A.isNil(data)) {
                return undefined;
            }

            if (!A.isPlainObject(data) && !A.isArray(data)) {
                return undefined
            }

            return Object.keys(data);

        },

        findKeys: function(value) {
            var ret = [];

            this._findKeys([], value, ret);

            return ret;
        },

        _findKeys: function(path, value, ret) {
            var d = this.get(path),
                targetKeys = [];

            if ( d ) {
                targetKeys = Object.keys(d);
            }

            while ( targetKeys.length > 0 ) {
                var key = targetKeys.shift();

                path.push(key);

                if ( this.isEqual(path, value) ) {
                    ret.push(key);
                } else {

                    if ( !A.isObject(d[ key ]) ) {

                        path.pop();
                        continue;
                    }

                    this._findKeys(path, value, ret);
                }

                path.pop();
            }
        },

        isArray: function(path) {
            path = path || [];

            if ( this.get(path) ) {
                return A.isArray(this.get(path));
            } else {
                return undefined;
            }
        },

        isObject: function(path) {
            path = path || [];

            if ( this.get(path) ) {
                return A.isPlainObject(this.get(path));
            } else {
                return undefined;
            }

        },

        each: function(path, func) {
            path = path || [];

            if ( arguments.length == 1 && typeof path == 'function' ) {
                func = path;
                path = [];
            }

            var data = this.get(path);

            if ( typeof func == 'function' ) {
                if ( typeof data == 'object' ) {
                    for ( var i in data ) {
                        func.apply(this, [ data[ i ], A.isArray(data) ? parseInt(i) : i ]);
                    }
                } else {
                    func.apply(this, [ data ]);
                }
            }
        },

        multipleGet: function(path) {
            var ret = [],
                realPath = [];

            if ( !A.isArray(path) ) {
                this._findPath([], path, realPath);

                path = realPath;
            }

            for ( var i = 0; i < path.length; i++ ) {
                ret.push(this.get(path[ i ]));
            }

            return ret;
        },

        multipleSet: function(path, items) {
            path = path || [];

            for ( var i = 0; i < path.length; i++ ) {
                this.set(path[ i ], items[ i ]);
            }
        },

        requestTransaction: function(reqObject, optcomm, optcommparam) {
            this.superc(A.getModule("datasetbase"), 'requestTransaction', reqObject);

            reqObject = reqObject || {};

            var ctx = this,
                url = reqObject.url,
                options = {},
                _commname = optcomm || "comm",
                _commparam = optcommparam;


            if ( reqObject.readtype != undefined ) {
                this.readtype = reqObject.readtype;
            } else {
                this.readtype = A.DS_READTYPE.READ_ALL;
            }

            options = {
                url: url || this.url,
                async: (reqObject.async === undefined ? true : reqObject.async),
                data: reqObject.data || {},
                headers: reqObject.headers || {},
                callbackSucc: function(res, req, opts) {
                    ctx.__callbackSuccess(res, req, opts);
                },
                callbackError: function(res, ajaxerr) {
                    ctx.__callbackError(res, ajaxerr);
                }
            };

            this.events.fire(this.EVENTS.TRANSACTION_BEGIN, options);

            A.createModule(_commname, options, _commparam).send(this);
        },

        clearTransaction: function() {

        },

        on: function(ename, path, efunc, ctx, async) {
            this.events.on(ename + "." + this._getNs(path), efunc, ctx);
        },

        off: function(ename, path, efunc, ctx) {
            this.events.off(ename + "." + this._getNs(path), efunc, ctx);
        },

        _findPath: function(path, propKey, ret) {
            var d = this.get(path),
                targetKeys = [];

            if ( d ) {
                targetKeys = Object.keys(d);
            }

            while ( targetKeys.length > 0 ) {
                var key = targetKeys.shift();

                path.push(key);

                if ( key == propKey ) {
                    ret.push(A.copyObject(path));
                } else {

                    if ( !A.isObject(d[ key ]) ) {

                        path.pop();
                        continue;
                    }

                    this._findPath(path, propKey, ret);
                }

                path.pop();
            }
        },

        __setReadtype: function(readtype) {
            if (readtype != A.DS_READTYPE.READ_NONE && readtype != A.DS_READTYPE.READ_ALL) {
                throw new Error("Invalid Read Type - simple dataset only accepts READ_ALL, READ_NONE.");
            }

            if (A.isNil(this.readtype) || this.readtype == A.DS_READTYPE.READ_ALL) {
                this.readtype = readtype;
            }
        },

        __buildResponse: function(data) {
            return data;
        },

        __buildRequest: function() {
            var returnObj = {};

            returnObj[ 'request_data_id' ] = this.id;
            returnObj[ 'request_data_type' ] = REQUEST_DATASET_TYPE;
            returnObj[ 'request_data_readtype' ] = { readtype: this.readtype };
            returnObj[ 'request_data' ] = A.copyObject(this.data) || {};

            this.events.fire(this.EVENTS.TRANSACTION_REQUEST, returnObj);
            return returnObj;
        },

        __verify: function(data) {
            var ecode = (data[ "errorcode" ] + "").trim();
            if ( ecode !== "0" ) {
                return true;
            }

            if ( this.readtype != A.DS_READTYPE.READ_NONE ) {

                if ( data[ "response_data" ] === undefined || data[ "response_data" ] === null ) {
                    throw new Error("Invalid Protocol Spec - undefined or null response_data");
                }

                if ( data[ "response_data_id" ] === undefined || data[ "response_data_id" ] === null ) {
                    throw new Error("Invalid Protocol Spec - undefined or null response_data_id");
                }

                if ( !A.isPlainObject(data[ "response_data" ]) ) {
                    throw new Error("Invalid Protocol Spec - data must be a plain object");
                }
            }

            if ( data[ "response_data_type" ] === undefined || data[ "response_data_type" ] === null ) {
                throw new Error("Invalid Protocol Spec - undefined or null response_data_type");
            }

            if ( data[ "response_data_type" ] !== REQUEST_DATASET_TYPE ) {
                throw new Error("Invalid Protocol Spec - mismatched response_data_type (" + data[ "response_data_type" ] + "/" + REQUEST_DATASET_TYPE + ")");
            }

            return true;
        },

        __callbackSuccess: function(response, request, options) {
            if(A.isNil(this.events)) {
                return;
            }

            this.events.fire(this.EVENTS.TRANSACTION_RESPONSE, response);

            this.setDatasetState(A.DS_STATE.LOADED);

            var readRequest = request[ "request_data_readtype" ];

            switch ( readRequest[ "readtype" ] ) {
                case A.DS_READTYPE.READ_NONE:
                    break;
                case A.DS_READTYPE.READ_ALL:
                    this.url = options.url; 
                    this.data = A.copyObject(response[ "response_data" ] || {});
                    this.events.fire(this.EVENTS.LOADCOMPLETE, { data: A.copyObject(response[ "response_data" ]) });
                    this._initialDataChanged = false;
                    break;
            }

            this.events.fire(this.EVENTS.TRANSACTION_END, {
                request: A.copyObject(request),
                response: A.copyObject(response)
            });
        },

        __callbackError: function(response, ajaxerroraguments) {
            if(A.isNil(this.events)) {
                return;
            }

            this.events.fire(this.EVENTS.TRANSACTION_ERROR, response, ajaxerroraguments);
        },

        event_fire: function() {
            this.events.fire.apply(this.events, arguments);
        },

        setLocalMode: function(newval) {
            this.localmode = newval;
        }
    };

    A.inherit(simpledataset, A.getModule("datasetbase"));
    A.extendModule(simpledataset, "dataset.simple");

})(Camellia);




(function(A) {

    "use strict";

    if ( A === undefined || A === null ) {
        throw new Error("Camellia is undefined or null");
    }
    var REQUEST_DATASET_TYPE = '__AUI_DATASET_TABLE__';

    function makeColumnProperty(cols, src) {

        A.assert((cols.length === src.length), "column count mismatched");

        var obj = {};

        for ( var cx = 0, clen = src.length; cx < clen; cx++ ) {
            obj[ cols[ cx ] ] = src[ cx ];
        }

        return obj;
    }

    var _COL_S_INDEX = 0,
        _ROW_S_INDEX = 0,
        _COL_NAME_PREFIX = "col",
        _DEFAULT_COL_SIZE = 5,


        _genUID = (function() {
            var prefix = "aui_dataset_id_";
            return function() {
                return (prefix) + ("" + Math.random()).replace(/\D/g, "");
            };
        })(),

        DS_EVENT = {
            LOADCOMPLETE: "eventLoadComplete",
            DYNAMICLOADCOMPLETE: "eventDynamicLoadComplete",

            RESETDATASET: "eventResetDataset",

            FILEDOWNLOAD_SUCCESS: "eventDataDownloadSuccess",
            FILEDOWNLOAD_ERROR: "eventDataDownloadError",


            CHANGED_ROWDATA: "eventChangedData", 
            CHANGED_ROWCOUNT: "eventChangedRowCount",

            CHANGED_POSITION: 'eventChangedPosition',

            ADDED_ROWDATA: "eventAddedData", 
            DELETED_ROWDATA: "eventDeletedData", 
            SELECTED_ROWDATA: "eventSelectedData", 

            TRANSACTION_BEGIN: "eventTransactionBegin",
            TRANSACTION_END: "eventTransactionEnd",
            TRANSACTION_REQUEST: "eventTransactionRequest",
            TRANSACTION_RESPONSE: "eventTransactionResponse",
            TRANSACTION_ERROR: 'eventTransactionError',
            DESTROY: 'eventDestroyDataset'
        },

        DS_READTYPE = {
            READ_ALL: 0x01,
            READ_RANGE: 0x02,
            READ_NONE: 0x04,
            READ_COUNT: 0x08
        },

        DS_TRTYPE = {
            NONE: "dstrt_none",
            ADD: "dstrt_add",
            DELETE: "dstrt_delete",
            UPDATE: "dstrt_update"
        },

        DS_DYNAMICTYPE = {
            DYNAMIC_NONE: 0x00,
            DYNAMIC_APPEND: 0x01,
            DYNAMIC_RANDOM: 0x02
        },

        DS_STATUS = {
            STAT_HASEDIT: 0x01,
            STAT_ROWEDITTYPE: 0x02,
            STAT_COUNTEDIT_ALL: 0x04,
            STAT_COUNTEDIT_ADD: 0x05,
            STAT_COUNTEDIT_DEL: 0x06,
            STAT_COUNTEDIT_UPDATE: 0x07,
            STAT_DYNAMICLOAD_COMPLETED: 0x08
        },

        DS_BUILDTYPE = {
            BUILD_NORMAL: 0x01,
            BUILD_DYNAMIC: 0x02
        };


    function _booleanOr(t, or) {
        if ( A.isBoolean(t) === true ) {
            return t;
        }
        else {
            return or;
        }
    }

    function _makecolname(colcount) {
        var retarry = [];

        for ( var cx = 0; cx < colcount; cx++ ) {
            var colname = _COL_NAME_PREFIX + (cx);
            retarry.push(colname);
        }

        return retarry;
    }

    function _makerowobject(rowobj, colarry) {
        var retrow = [];

        if ( colarry !== undefined && colarry !== null && colarry.length !== undefined && colarry.length > 0 ) {

            for ( var cx = 0, clen = colarry.length; cx < clen; cx++ ) {
                try {
                    retrow.push(rowobj[ colarry[ cx ] ]);
                }
                catch ( e ) {
                    retrow = null;
                    throw new Error("invalid object - column mismatch");
                }
            }
        }
        else {
            for ( var prop in rowobj ) {
                retrow.push(rowobj[ prop ]);
            }
        }

        return retrow;
    }

    function _arraycopy(srcarry) {
        return (srcarry && srcarry.length > 0) ? srcarry.slice(0) : [];
    }

    function _arraycopy2(srcarry, targetarry, doKeepOrg) {

        if ( !doKeepOrg ) {
            A.clearArray(targetarry);
        }

        for ( var sx = 0, slen = srcarry.length; sx < slen; sx++ ) {
            targetarry.push(srcarry[ sx ]);
        }

        return targetarry;
    }

    function _arraycopyval(destarry, srcarry) {

        A.assert(destarry.length === srcarry.length, "invalid operation - not equal to column length");

        for ( var ax = 0, alen = srcarry.length; ax < alen; ax++ ) {
            destarry[ ax ] = srcarry[ ax ];
        }
    }


    function dataTrModel(type, odata, ndata) {

        if ( arguments.length !== 3 ) {
            throw new Error("wrong argument..");
        }

        if ( !(this instanceof dataTrModel) ) {
            return new dataTrModel(type, odata, ndata);
        }

        this.type = type;
        this.orgdata = _arraycopy(odata);       
        this.newdata = _arraycopy(ndata); 
    }


    dataTrModel.prototype = {
        destroy: function() {
            this.type = DS_TRTYPE.NONE;
            this.orgdata = null;
            this.newdata = null;
        }
    };



    function datasettrans() {
        if ( !(this instanceof datasettrans) ) {
            return new datasettrans();
        }

        this.keymap = {};
        this.trarry = [];
    }

    datasettrans.prototype = {

        destroy: function() {
            this._clear();

            this.keymap = null;
            this.trarry = null;
        },

        _clear: function() {
            A.clearObject(this.keymap);
            A.clearArray(this.trarry);

            this.keymap = {};
            this.trarry = [];
        },

        hasTrans: function() {
            return (this.trarry.length > 0);
        },

        countTrans: function() {
            return (this.trarry.length);
        },

        addTrans: function(type, oldrow, newrow) {

            var rid, prevO, prevT, newtrmodel;

            if ( type === DS_TRTYPE.ADD ) {
                rid = newrow.rowid;
                newtrmodel = new dataTrModel(type, newrow, newrow);

                this._addtrdata(rid, newtrmodel);
            }
            else if ( type === DS_TRTYPE.DELETE ) {
                rid = oldrow.rowid;
                prevO = this._findtrdata(rid);
                prevT = (prevO) ? prevO.type : DS_TRTYPE.NONE;

                if ( prevT === DS_TRTYPE.ADD ) {
                    this._removetrdata(rid);
                }
                else if ( prevT === DS_TRTYPE.UPDATE ) {
                    prevO.type = DS_TRTYPE.DELETE;
                }
                else if ( prevT === DS_TRTYPE.NONE ) {
                    newtrmodel = new dataTrModel(type, oldrow, null);
                    this._addtrdata(rid, newtrmodel);
                }
            }
            else if ( type === DS_TRTYPE.UPDATE ) {
                rid = oldrow.rowid;
                prevO = this._findtrdata(rid);
                prevT = (prevO) ? prevO.type : DS_TRTYPE.NONE;

                if ( prevT === DS_TRTYPE.NONE ) {
                    newtrmodel = new dataTrModel(type, oldrow, newrow);
                    this._addtrdata(rid, newtrmodel);
                }
                else if ( prevT === DS_TRTYPE.UPDATE ) {
                    _arraycopy2(newrow, prevO.newdata);
                }
                else if ( prevT === DS_TRTYPE.ADD ) {
                    _arraycopy2(newrow, prevO.newdata);
                }
            }

        },

        requestTrans: function(options) {
            var datasetcomm;

            options[ 'arryTrModel' ] = this.trarry;

            datasetcomm = A.createModule("comm", options);
            datasetcomm.send();
        },

        requestNoTrans: function(options) {
            var datasetcomm;


            datasetcomm = A.createModule("comm", options);
            datasetcomm.send();
        },

        clearTrans: function() {
            this._clear();
        },

        _findtrdata: function(keyval) {
            return ( this.keymap[ keyval ] || null );
        },

        searchRowType: function(row) {
            var trdata = (row.rowid !== undefined) ? this._findtrdata(row.rowid) : null;
            if ( trdata ) {
                return trdata.type;
            }
            else {
                return DS_TRTYPE.NONE;
            }
        },

        getCountByType: function(type) {
            A.assert(((type === DS_TRTYPE.ADD) ||
            (type === DS_TRTYPE.DELETE) ||
            (type === DS_TRTYPE.UPDATE)), "invalid type");

            var type_cnt = 0, tr, tarry = this.trarry;

            for ( var tx = 0, tend = tarry.length; tx < tend; tx++ ) {
                tr = tarry[ tx ];
                if ( tr.type === type ) {
                    type_cnt++;
                }
            }

            return type_cnt;
        },


        _addtrdata: function(keyval, newtrmodel) {
            if ( this.keymap[ keyval ] !== undefined || !(newtrmodel instanceof dataTrModel)
            ) {
                throw new Error("invalid request !");
            }

            this.trarry.push(newtrmodel);
            this.keymap[ keyval ] = newtrmodel;

        },

        _removetrdata: function(keyval) {
            if ( this.keymap[ keyval ] === undefined ) {
                throw new Error("invalid request !");
            }

            var deltrmodel = this.keymap[ keyval ],
                delarryidx = this.trarry.indexOf(deltrmodel);

            deltrmodel.destroy();
            deltrmodel = null;
            this.trarry.splice(delarryidx, 1);


            delete this.keymap[ keyval ];
        },

        _updatetrdata: function(keyval, type, newrow) {

        }

    };


    function dataset(options, uid, dsctx) {
        if ( !(this instanceof dataset) ) {
            return new dataset(options, uid);
        }

        if ( dataset._super_proto_ !== undefined ) {
            dataset._super_constructor(this, arguments);
        }

        this.instanceId = uid;
        this._rowidseq = 0;
        this.row = 0;
        this.col = 0;
        this.dynrow = 0;
        this.realrow = 0;                       
        this.loaded = false;
        this._url = "";
        this.currow = -1;
        this._rowkeymap = {};                   

        this._needclear = false;               
        this._lastreqparams = null;

        this._dynamicmode = false;
        this.dynamicautoload = false;
        this.dynmaicautoloadinterval = 300;     
        this._dynamicloadedindexmap = [];
        this._dynamiclastsindex = -1;
        this._dynamiclasteindex = -1;
        this._dynamicloadcomplete = false;

        options = options || {};
        this.options = options;


        this._url = options.url || "";
        this._id = options.id || this.instanceId || Camellia.generateUUID();                      

        this._localmode = _booleanOr(options.localmode, ((this._url.length <= 0)));
        this.readonly = _booleanOr(options.readonly, false);
        this._fixedcolumnmode = _booleanOr(options.fixedcolumnmode, false);

        this.autoload = options.autoload || false;
        this._dynamicmode = options.dynamicmode || false;

        this._defaultreadcount = options.defaultreadcount || 10;

        if ( options.reqobject ) {
            this._url = options.reqobject.url || this._url;
        }

        this.trans = new datasettrans();

        if ( (this._localmode || this._fixedcolumnmode) && options.colnames && A.isArray(options.colnames) ) { 	
            this.colnames = A.copyObject(options.colnames);
            this.col = this.colnames.length;
        }
        else {
            this.colnames = [];
        }

        this.readRequest = options.reqobject ? this._makeReadRequest(options.reqobject) : { readtype: DS_READTYPE.READ_ALL };
        this.readtype = this.readRequest.readtype;
        this.readindex = this.readRequest.readindex;
        this.readcount = this.readRequest.readcount;


        this.realdata = [];
        this.keys = [];              
        this._cachedrows = null;      

        this.events = A.createModule("events", DS_EVENT);
        this.events.parseOption(options, dsctx);

        this._comm = null;
        this._commparam = null;
    }


    dataset.prototype =
    {
        construct: function(options, comm, commparam) {
            options = options || {};
            var reqobj = options.reqobject || {};

            A.extendif(reqobj, { url: options.url }, "OE");

            if ( options.autoload ) {
                this.requestTransaction(
                    reqobj,
                    comm,
                    commparam
                );
            }
        },

        destroy: function() {
            this._clear();

            this.colnames = null;
            this.keys = null;
            this.realdata = null;

            if ( this.trans ) {
                this.trans.destroy();
                this.trans = null;
            }

            this.superc(A.getModule("datasetbase"), 'destroy');
        },

        _resetConfiguration: function() {
        },

        _clear: function() {

            this._rowidseq = 0;
            this.row = 0;
            this.dynrow = 0;
            this.realrow = 0;
            this.loaded = false;
            this.currow = -1;
            this._needclear = false;
            this._dynamicloadcomplete = false;
            this._dynamiclastsindex = -1;
            this._dynamiclasteindex = -1;

            if ( !this._fixedcolumnmode ) {
                this.col = 0;
                A.clearArray(this.colnames);
            }

            A.clearArray(this.keys);
            A.clearArray(this.realdata, true);
        },

        _updateRowCount: function(dynmode, recvrowsize, readindex, localrowsize, srvrowcount) {
            if ( dynmode ) {
                if ( readindex === 0 ) {
                    this.dynrow = 0;
                }

                this.dynrow += recvrowsize;
                this.row = localrowsize;
                this.realrow = srvrowcount;
            }
            else {
                this.row = recvrowsize;
                this.dynrow = 0;
                this.realrow = recvrowsize;
            }
        },

        _isEqualRow: function(newrow, oldrow) {
            for ( var i in newrow ) {
                if ( newrow.hasOwnProperty && newrow.hasOwnProperty(i) && oldrow.hasOwnProperty && oldrow.hasOwnProperty(i) ) {
                    var isSame = ((newrow[ i ] + "") == (oldrow[ i ] + ""));

                    if ( !isSame ) {
                        return false;
                    }
                }
            }
            return true;
        },

        _rowprop: function() {
            var retval,
                setvalue = arguments[ 0 ];

            if ( setvalue !== undefined && setvalue !== null ) {
                if ( this._dynamicmode ) {
                    this.row = setvalue;
                }
                else {
                    this.row = setvalue;
                }
            }
            else {
                if ( this._dynamicmode ) {
                    retval = this.row;
                }
                else {
                    retval = this.row;
                }

                return retval;
            }
        },


        _getNextKey: function() {
            return this._rowidseq++;
        },

        _setRowKey: function(rowd) {
            rowd.rowid = this._getNextKey();
            this._addRowKey(rowd.rowid, rowd);
            return rowd;
        },

        _addRowKey: function(rowkey, rowd) {
            this._rowkeymap[ rowkey ] = rowd;
        },

        _delRowKey: function(rowkey) {
            var rowd = this._rowkeymap[ rowkey ];

            this._rowkeymap[ rowkey ] = null;
            delete this._rowkeymap[ rowkey ];

            A.clearArray(rowd);
        },

        _searchRowKey: function(rowkey) {
            var rowd;

            if ( A.hasOwnProp(this._rowkeymap, rowkey) ) {
                rowd = this._rowkeymap[ rowkey ];
                A.assert(rowd.rowid === rowkey, "rowkey mismatched. Internal Error.");
                return rowd;
            }
        },

        _makeReadRequest: function(obj) {
            var readRequest = {},
                srcObj = obj || this;


            readRequest[ "readtype" ] = srcObj.readtype || DS_READTYPE.READ_ALL;

            if ( srcObj.readtype && srcObj.readtype == DS_READTYPE.READ_RANGE ) {
                readRequest[ "readindex" ] = srcObj.readindex || 0;
                readRequest[ "readcount" ] = srcObj.readcount || this._defaultreadcount;
            }
            else if ( !srcObj.readtype && this._dynamicmode ) {
                readRequest[ "readtype" ] = DS_READTYPE.READ_RANGE;
                readRequest[ "readindex" ] = (srcObj.readindex === undefined || srcObj.readindex === null) ? (this._dynamiclasteindex + 1) : srcObj.readindex;                
                readRequest[ "readcount" ] = srcObj.readcount || this._defaultreadcount;

                if ( readRequest[ "readindex" ] !== (this._dynamiclasteindex + 1) ) {
                    this._needclear = true;
                }

                if ( !srcObj.notrans && this.trans.hasTrans() ) {           
                    this._needclear = true;
                    readRequest[ "readcount" ] = readRequest[ "readindex" ];
                }

                if ( !this._lastreqparams && srcObj.data ) {
                    this._lastreqparams = A.copyObject(srcObj.data);
                }
                else if ( this._lastreqparams && srcObj.data === undefined ) {             
                    srcObj.data = A.copyObject(this._lastreqparams);
                }
                else if ( this._lastreqparams && srcObj.data !== undefined && !A.equalObject(this._lastreqparams, srcObj.data) ) {             
                    this._needclear = true;

                    A.clearObject(this._lastreqparams);
                    this._lastreqparams = A.copyObject(srcObj.data);
                }

                if ( this._needclear ) {
                    readRequest[ "readindex" ] = 0;   
                }

            }

            if (this._fixedcolumnmode) {
                if ( !A.isArray(this.colnames) || this.colnames.length == 0 ) {
                    throw new Error("colnames property must be set when using fixedcolumnmode");
                }
                readRequest[ "readcols" ] = A.copyObject(this.colnames);
            }

            return readRequest;
        },


        _load: function() {
            var rows = arguments[ 0 ] || [],
                cols = arguments[ 1 ] || [],
                readindex = arguments[ 2 ],
                readcount = arguments[ 3 ],
                rowcount = arguments[ 4 ],
                oldrealrowcnt = this.realrow,
                currowstindex = 0,
                lcevtParam;

            var _backup_colnames = null,
                _postprocessed_rows = rows, _postprocessed_cols = (this._fixedcolumnmode ? this.colnames : cols);     

            A.assert(( !this._fixedcolumnmode || (this._fixedcolumnmode && this.colnames && this.colnames.length > 0) ), "colnames must be predefined when it uses fixedcolumnmode");

            this._cachedrows = rows;

            if ( this.loaded ) {
                if ( this._needclear || !this._dynamicmode ) {
                    if ( this._fixedcolumnmode ) {
                        _backup_colnames = A.copyObject(this.colnames);
                    }

                    this._clear();

                    if ( _backup_colnames ) {
                        this.colnames = _backup_colnames;
                        _postprocessed_cols = _backup_colnames;
                        this.col = _backup_colnames.length;
                    }
                }
            }

            if ( this._dynamicmode ) {
                currowstindex = this.realdata.length;       
                dynamicmode.call(this, rows, cols, readindex, readcount, rowcount);
            }
            else {
                nodynamicload.call(this, rows, cols);
            }

            if ( !this.loaded ) {
                this.loaded = true;
                this._needclear = false;
            }
            else if ( this.realrow !== oldrealrowcnt ) {
                this.event_fire(DS_EVENT.CHANGED_ROWCOUNT, { oldrowcount: oldrealrowcnt, newrowcount: this.realrow });   
            }

            lcevtParam = {
                rows: _postprocessed_rows,
                cols: _postprocessed_cols,
                startindex: currowstindex,
                readindex: readindex,
                readcount: readcount,
                rowcount: rowcount,
                dynamicmode: this._dynamicmode
            };
            if ( this._dynamicmode ) {
                A.extendif(lcevtParam, { dynamicrow: this.dynrow });
            }
            this.event_fire(DS_EVENT.LOADCOMPLETE, lcevtParam);

            if ( !this._dynamicloadcomplete &&
                this._dynamicmode &&
                this.dynrow === this.realrow ) {
                this._dynamicloadcomplete = true;
                this.event_fire(DS_EVENT.DYNAMICLOADCOMPLETE);
            }


            function postprocess_fixedcolumns(rowref, splice_del_arry_backward) {
                var item, delete_index, delete_count;

                for ( var sx = 0, slen = splice_del_arry_backward.length; sx < slen; sx++ ) {
                    item = splice_del_arry_backward[ sx ];
                    delete_index = item[ 0 ];
                    delete_count = item[ 1 ];

                    rowref.splice(delete_index, delete_count);  
                }
            }

            function making_splice_del_set_backward(cols, matchcols) {
                var elapse_count = 0,
                    _cols = cols || [],  
                    compval,
                    backward_set = [];  

                matchcols.forEach(function(elm) {
                    A.assert(cols.indexOf(elm) >= 0, "fixed column {0} is not found in cols data received".format(elm));
                });


                for ( var cx = _cols.length - 1; cx >= 0; cx-- ) {

                    compval = _cols[ cx ];
                    if ( matchcols.indexOf(compval) >= 0 ) {
                        if ( elapse_count > 0 ) {
                            backward_set.push([ cx + 1, elapse_count ]);
                        }
                        elapse_count = 0;
                    }
                    else {
                        elapse_count++;
                    }
                }

                if ( elapse_count > 0 ) {
                    backward_set.push([ 0, elapse_count ]);
                }

                return backward_set;
            }

            function nodynamicload(rows, cols) {

                var _splice_del_arry;

                if ( !this._fixedcolumnmode ) {
                    this.colnames = cols;
                }
                else {
                    _splice_del_arry = making_splice_del_set_backward(cols, this.colnames);
                }


                A.assert((this.colnames.length !== 0),
                    "it can't be zero colnames size.");

                for ( var rx = 0, rlen = rows.length; rx < rlen; rx++ ) {

                    var onerow = rows[ rx ];
                    if ( this._fixedcolumnmode ) {
                        postprocess_fixedcolumns(onerow, _splice_del_arry);
                    }
                    this._setRowKey(onerow);


                    if ( this.colnames.length !== onerow.length ) {
                        throw new Error("the length between colnames and contents in a row is mismatched");
                    }

                    this.realdata.push(onerow);
                }


                this._updateRowCount(this._dynamicmode, this.realdata.length);

                this.col = this.colnames.length;
                this.currow = 0;

            }

            function dynamicmode(rows, cols, readindex, readcount, rowcount) {

                var _splice_del_arry;


                if ( readindex === undefined || readcount === undefined || rowcount === undefined ) {
                    readindex = 0;
                    readcount = rows.length;
                    rowcount = rows.length;
                }

                if ( this._dynamicmode ) {
                    A.assert((this._dynamiclasteindex + 1) === readindex, "invalid readindex {0}, {1}".format(readindex, this._dynamiclasteindex));
                }

                this._dynamiclastsindex = readindex;
                this._dynamiclasteindex = readindex + ( (rows.length !== readcount) ? rows.length : readcount ) - 1;

                if ( !this._fixedcolumnmode && this.colnames.length === 0 ) {   
                    this.colnames = cols;
                }
                else if ( !this._fixedcolumnmode ) {
                    A.assert(this.colnames.length === cols.length,
                        "invalid column info [prev-col-count: {0}], [cur-col-count: {1}]".format(this.colnames.length, cols.length));
                }

                A.assert((this.colnames.length !== 0),
                    "it can't be zero colnames size.");

                if ( this._fixedcolumnmode ) {
                    _splice_del_arry = making_splice_del_set_backward(cols, this.colnames);
                }


                for ( var onerow, rx = 0, rlen = rows.length; rx < rlen; rx++ ) {

                    onerow = rows[ rx ];
                    if ( this._fixedcolumnmode ) {
                        postprocess_fixedcolumns(onerow, _splice_del_arry);
                    }
                    this._setRowKey(onerow);

                    A.assert((this.colnames.length === onerow.length),
                        "the length between colnames and contents in a row is mismatched");


                    this.realdata[ currowstindex + rx ] = onerow;     
                }

                this._updateRowCount(this._dynamicmode, rows.length, readindex, this.realdata.length, rowcount);

                this.col = this.colnames.length;
                this.currow = 0;        
            }
        },


        loadFile: function(url, type, async) {
            type = type || "json";

            switch ( type ) {
                case "json":
                    this._loadJSON(url, async);
                    break;
            }
        },

        _loadJSON: function(url, async) {

            A.assert(url, "Invalid JSON url");      

            A.$.ajax({
                url: url,
                type: "POST",
                async: (async || true),
                context: this,
                success: function(data, textStatus, jqXHR) {
                    var json = A.isString(data) ? A.string2json(data) : data;

                    if ( !this._verifyJSON(json) ) {
                        this.event_fire(DS_EVENT.FILEDOWNLOAD_ERROR, "invalid format");
                    }

                    this.event_fire(DS_EVENT.FILEDOWNLOAD_SUCCESS, { url: url, data: json });
                    this._localmode = true;              

                    this._load(json.rows, json.cols);
                },
                error: function(jqXHR, status, error) {
                    this.event_fire(DS_EVENT.FILEDOWNLOAD_ERROR, { status: status, error: error });
                }
            });

        },

        _verifyJSON: function(json) {
            return !(json.rows === undefined ||
            json.rows === null || !A.isArray(json.rows));
        },

        changeUrl: function(url) {
            if ( url !== undefined &&
                url !== null &&
                this._url.trim() !== url.trim() ) {
                this._url = url;
                this._needclear = true;
            }
        },

        _getUrl: function(url) {
            if ( url !== undefined &&
                url !== null &&
                this._url.trim() !== url.trim() ) {
                return url;
            }
            else {
                return this._url;
            }
        },

        getRow: function(nrow) {

            if ( nrow === undefined ) {
                throw new Error("invalid parameter");
            }

            if ( nrow < 0 || nrow >= this._rowprop() ) {
                throw new Error("error: out of range");
            }

            return ( _arraycopy(this.realdata[ nrow ]) );
        },


        getRowRef: function(nrow) {
            return this.realdata[ nrow ];
        },

        getRowObject: function(nrow) {

            if ( nrow === undefined ) {
                throw new Error("invalid parameter");
            }

            if ( nrow < 0 || nrow >= this._rowprop() ) {
                throw new Error("error: out of range");
            }

            var retobj = {},
                onerow = this.realdata[ nrow ];

            for ( var cx = 0, clen = this.col; cx < clen; cx++ ) {
                retobj[ this.colnames[ cx ] ] = onerow[ cx ];
            }

            return retobj;
        },

        getDataAll: function() {
            var realcopyarry = [], makeonerow;

            for ( var rx = 0, rlen = this.realdata.length; rx < rlen; rx++ ) {
                makeonerow = _arraycopy(this.realdata[ rx ]);
                realcopyarry.push(makeonerow);
            }

            return realcopyarry;
        },

        getDataAllObject: function() {
            var realcopyarry = [], makeoneobject;

            for ( var rx = 0, rlen = this.realdata.length; rx < rlen; rx++ ) {
                makeoneobject = A.array2object(this.realdata[ rx ], this.colnames);
                realcopyarry.push(makeoneobject);
            }

            return realcopyarry;
        },

        getLastCachedDataObject: function() {
            var realcopyarry = [], makeoneobject;

            for ( var rx = 0, rlen = this._cachedrows.length; rx < rlen; rx++ ) {
                makeoneobject = A.array2object(this._cachedrows[ rx ], this.colnames);
                realcopyarry.push(makeoneobject);
            }

            return realcopyarry;
        },

        getDataAllRef: function() {
            return this.realdata;
        },

        getRowTransactionStatus: function(rowNumber) {
            var STATUS = {
                ADD: 'add',
                UPDATE: 'update',
                NONE: 'none'
            };
            var row = this.realdata[ rowNumber ];

            if ( !A.isNil(row) ) {
                var rowid = row.rowid;
                var dataTrModel = this.trans.keymap[ rowid ];

                if ( !A.isNil(dataTrModel) ) {

                    switch ( dataTrModel.type ) {
                        case A.DS_TRTYPE.ADD :
                            return STATUS.ADD;
                            break;
                        case A.DS_TRTYPE.UPDATE :
                            return STATUS.UPDATE;
                            break;
                    }

                }
            }

            return STATUS.NONE;
        },

        getRowAllTransactionStatus: function() {
            var returned = {
                add : [],
                update : []
            };

            var transCount = this.trans.countTrans();
            for(var rowNumber = 0; rowNumber < this.realdata.length; rowNumber++) {
                var row = this.realdata[rowNumber];
                var dataTrModel = this.trans.keymap[ row.rowid ];

                if ( !A.isNil(dataTrModel) ) {
                    switch ( dataTrModel.type ) {
                        case A.DS_TRTYPE.ADD :
                            returned.add.push(rowNumber);
                            break;
                        case A.DS_TRTYPE.UPDATE :
                            returned.update.push(rowNumber);
                            break;
                    }
                }

                if(transCount == (returned.add.length + returned.update.length)) break;
            }

            return returned;
        },

        _checkValueType: function(value, ntype) {

            var varry = [],
                _ctypefns = [],
                ctype;

            if ( value.length ) {
                varry = value;
            }
            else {
                varry.push(value);
            }

            for ( var ax = 1, alen = arguments.length; ax < alen; ax++ ) {
                if ( arguments[ ax ] === "null" ) {
                    _ctypefns.push(_typeNull);
                }
                else if ( arguments[ ax ] === "undefined" ) {
                    _ctypefns.push(_typeUndefined);
                }
                else if ( arguments[ ax ] === "object" ) {
                    _ctypefns.push(_typeObject);
                }
            }

            for ( var vx = 0, vlen = varry.length; vx < vlen; vx++ ) {
                ctype = varry[ vx ];

                for ( var fnx = 0, fnlen = _ctypefns.length; fnx < fnlen; fnx++ ) {
                    if ( _ctypefns[ fnx ].call(this, ctype) ) {
                        return vx;
                    }
                }
            }

            function _typeUndefined(v) {
                return v === undefined;
            }

            function _typeNull(v) {
                return v === null;
            }

            function _typeObject(v) {
                return (
                    v !== null &&
                    v !== undefined &&
                    typeof(v) === "object"
                );
            }

            return -99;
        },

        addRow: function(newrow, ppos) {
            var rowlen,
                extractKeys = null,
                erridx = -99,
                pos = ppos || "last";

            A.assert(newrow, "invalid parameter - newrow");

            if ( !A.isArray(newrow) ) {
                if ( this.colnames.length > 0 ) {
                    newrow = A.object2array(newrow, this.colnames);
                }
                else {
                    extractKeys = A.extractKeys(newrow);
                    newrow = A.object2array(newrow);
                }
            }

            erridx = this._checkValueType(newrow, "undefined");
            A.assert(erridx === -99, "invalid column value (undefined type) [column: {0}]. check the column model !".format(this.colnames[ erridx ]));
            erridx = this._checkValueType(newrow, "object");
            A.assert(erridx === -99, "invalid column value (object type). column: {0}".format(this.colnames[ erridx ]));

            rowlen = newrow.length;

            if ( this._localmode && this.col <= 0 && rowlen > 0 ) {
                this.colnames = extractKeys || _makecolname(rowlen);
                this.col = rowlen;
            }
            A.assert(newrow.length === this.col, "invalid column count");

            var ndatacopy = _arraycopy(newrow);

            this._setRowKey(ndatacopy);


            if ( !this._localmode ) {
                this.trans.addTrans(DS_TRTYPE.ADD, null, ndatacopy);
            }

            if ( A.isString(pos) && pos === "first" ) {
                pos = 0;
            }
            else if ( A.isString(pos) && pos === "last" ) {
                pos = this._rowprop();
            }

            this.realdata.splice(pos, 0, ndatacopy);
            this._rowprop(this.realdata.length);

            if ( this._localmode && !this.loaded ) {
                this.currow = 0;
                this.loaded = true;
            }

            this.event_fire(DS_EVENT.ADDED_ROWDATA, { rowindex: pos, row: _arraycopy(ndatacopy) });

            return this._rowprop();
        },

        removeRow: function(nrow) {
            var deletedRow = A.copyObject(this.realdata[ nrow ]);

            if ( !this._localmode ) {
                this.trans.addTrans(DS_TRTYPE.DELETE, this.realdata[ nrow ]);
            }

            this.realdata[ nrow ] = null;
            this.realdata.splice(nrow, 1);
            this._rowprop(this.realdata.length);

            if ( nrow == this.currow ) {
                this.currow = 0;
            }

            this.event_fire(DS_EVENT.DELETED_ROWDATA, { rowindex: nrow, row: deletedRow });
        },

        updateRow: function(nrow, newrow) {

            if ( nrow === undefined ) {
                throw new Error("invalid parameter");
            }

            if ( nrow < 0 || nrow >= this._rowprop() ) {
                throw new Error("error: out of range");
            }

            var _updateCellIndex = arguments[ 2 ],	
                erridx = -99,
                _oldrow = _arraycopy(this.realdata[ nrow ]);

            if ( !A.isArray(newrow) ) {
                newrow = A.object2array(newrow, this.colnames);
            }

            erridx = this._checkValueType(newrow, "undefined");
            A.assert(erridx === -99, "invalid column value (undefined type) [column: {0}]. check the column model !".format(this.colnames[ erridx ]));
            erridx = this._checkValueType(newrow, "object");
            A.assert(erridx === -99, "invalid column value (object type). column: {0}".format(this.colnames[ erridx ]));

            if ( !this._localmode ) {
                this.trans.addTrans(DS_TRTYPE.UPDATE, this.realdata[ nrow ], newrow);
            }


            _arraycopyval(this.realdata[ nrow ], newrow);
            this.event_fire(DS_EVENT.CHANGED_ROWDATA, { rowindex: nrow, row: newrow, oldrow: _oldrow });
        },

        updateCell: function(nrow, ncol, newval) {

            if ( nrow === undefined || ncol === undefined ) {
                throw new Error("invalid parameter");
            }

            if ( nrow < 0 || nrow >= this._rowprop() ) {
                throw new Error("error: out of range - row index");
            }

            if ( ncol < 0 || ncol >= this.col ) {
                throw new Error("error: out of range - column index");
            }

            var newrow = _arraycopy(this.realdata[ nrow ]);
            newrow[ ncol ] = newval;

            this.updateRow(nrow, newrow, ncol);
        },

        __setReadtype: function(readtype) {

            if (A.isNil(this.readtype) || this.readtype == A.DS_READTYPE.READ_ALL) {
                this.readtype = readtype;
                this.readRequest.readtype = readtype;
            }
        },

        __buildRequest: function(options) {
            var returnObj = {}, tableTransactionTrace;

            if ( !options.notrans ) {
                tableTransactionTrace = A.copyObject(this.trans.trarry) || [];
            }
            else {
                tableTransactionTrace = [];
            }

            returnObj[ 'request_data_id' ] = this._id;
            returnObj[ 'request_data_type' ] = REQUEST_DATASET_TYPE;
            returnObj[ 'request_data_readtype' ] = A.copyObject(this.readRequest);
            returnObj[ 'request_data' ] = {
                tr_add: [],
                tr_delete: [],
                tr_update: []
            };

            for ( var ax = 0, len = tableTransactionTrace.length; ax < len; ax++ ) {
                var refArryItem = tableTransactionTrace[ ax ];

                if ( refArryItem.type === A.DS_TRTYPE.ADD ) {
                    returnObj[ 'request_data' ].tr_add.push(makeColumnProperty(this.colnames, refArryItem.newdata));
                }
                else if ( refArryItem.type === A.DS_TRTYPE.DELETE ) {
                    returnObj[ 'request_data' ].tr_delete.push(makeColumnProperty(this.colnames, refArryItem.orgdata));
                }
                else if ( refArryItem.type === A.DS_TRTYPE.UPDATE ) {
                    returnObj[ 'request_data' ].tr_update.push(makeColumnProperty(this.colnames, refArryItem.newdata));
                }

            }

            if ( this.readRequest.readtype === 2 ) {
                A.assert(this.readRequest.readindex >= 0 &&
                    this.readRequest.readcount >= 0,
                    "invalid request params - readindex({0}), readcount({1}) is undefined or null or negative number".format(this.readRequest.readindex, this.readRequest.readcount));
            }

            this.event_fire(DS_EVENT.TRANSACTION_REQUEST, returnObj);
            return returnObj;
        },

        __verify: function(data) {
            var ecode = (data[ "errorcode" ] + "").trim();

            if ( ecode !== "0" ) {
                return true;
            }    
            var readtype = this.readRequest.readtype;

            if ( readtype != A.DS_READTYPE.READ_NONE ) {
                if ( data[ "response_data" ] === undefined || data[ "response_data" ] === null ) {
                    throw new Error("Invalid Protocol Spec - undefined or null response_data");
                }

                if ( data[ "response_data_id" ] === undefined || data[ "response_data_id" ] === null ) {
                    throw new Error("Invalid Protocol Spec - undefined or null response_data_id");
                }

                if ( data[ "response_data_type" ] === undefined || data[ "response_data_type" ] === null ) {
                    throw new Error("Invalid Protocol Spec - undefined or null response_data_type");
                }

                if ( data[ "response_data_type" ] !== REQUEST_DATASET_TYPE ) {
                    throw new Error("Invalid Protocol Spec - mismatched response_data_type (" + data[ "response_data_type" ] + "/" + REQUEST_DATASET_TYPE + ")");
                }

                if ( !A.isPlainObject(data[ "response_data" ]) ) {
                    throw new Error("Invalid Protocol Spec - response_data must be a plain object type");
                }
            }

            data = data[ "response_data" ];

            switch ( readtype ) {
                case A.DS_READTYPE.READ_RANGE: {
                    A.assert((data[ "rowcount" ] !== undefined && data[ "rowcount" ] !== null), "Invalid Response - undefined or null rowcount");
                }
                    break;
                case A.DS_READTYPE.READ_ALL: {
                    A.assert((data[ "cols" ] !== undefined && data[ "cols" ] !== null), "Invalid Response - undefined or null cols");
                    A.assert((data[ "rows" ] !== undefined && data[ "rows" ] !== null), "Invalid Response - undefined or null rows");
                }
                    break;
                case A.DS_READTYPE.READ_COUNT: {
                    A.assert((data[ "rowcount" ] !== undefined && data[ "rowcount" ] !== null), "Invalid Response - undefined or null rowcount");
                }
                    break;
                case A.DS_READTYPE.READ_NONE:
                    break;
            }

            return true;
        },

        __buildResponse: function(data) {
            return data;
        },

        __callbackSuccess: function(response, request, options) {
            if(A.isNil(this.events)) {
                return;
            }

            var ctx = this,
                readtype = request[ "request_data_readtype" ].readtype;

            A.extendif(response[ "response_data" ], { dynamicmode: ctx._dynamicmode });   
            ctx.event_fire(DS_EVENT.TRANSACTION_RESPONSE, response);

            ctx.setDatasetState(A.DS_STATE.LOADED);

            switch ( readtype ) {
                case DS_READTYPE.READ_NONE:
                    break;
                case DS_READTYPE.READ_COUNT:
                    ctx.row = response[ "response_data" ].rowcount;
                    break;
                case DS_READTYPE.READ_ALL:
                    ctx.changeUrl(options.url); 
                    ctx._load(response[ "response_data" ].rows, response[ "response_data" ].cols);
                    break;
                case DS_READTYPE.READ_RANGE:
                    ctx.changeUrl(options.url); 
                    ctx._load(response[ "response_data" ].rows, response[ "response_data" ].cols, request[ "request_data_readtype" ].readindex, request[ "request_data_readtype" ].readcount, response[ "response_data" ].rowcount);
                    break;
                default:
                    A.assert(false, "invalid read-type");
                    break;
            }

            if ( !options.notrans ) {
                ctx.clearTrans();
            }

            ctx.event_fire(DS_EVENT.TRANSACTION_END, {
                request: A.copyObject(request),
                response: A.copyObject(response)
            });
        },

        __callbackError: function(response, ajaxerroraguments) {
            if(A.isNil(this.events)) {
                return;
            }

            var ctx = this;

            ctx._needclear = false; 

            if ( A.isObject(response) ) {
                A.extendif(response, { dynamicmode: ctx.dynamicmode });   
            }
            ctx.event_fire(DS_EVENT.TRANSACTION_ERROR, response, ajaxerroraguments);
        },

        requestTransaction: function(reqObject, optcomm, optcommparam) {
            reqObject = reqObject || {};

            this.superc(A.getModule("datasetbase"), 'requestTransaction', reqObject);

            this.request(reqObject.url, reqObject, optcomm, optcommparam); 
        },

        request: function(url, readRequest, optcomm, optcommparam) {
            var ctx = this,
                reqOptions = {},
                _commname = optcomm || "comm",
                _commparam = optcommparam || {};


            reqOptions = {
                url: this._getUrl(url),
                async: (readRequest.async === undefined ? true : readRequest.async),
                data: readRequest.data || {},
                headers: readRequest.headers || {},
                notrans: readRequest.notrans || false,      
                callbackSucc: succ,
                callbackError: error,
                id: this._id
            };


            this.readRequest = this._makeReadRequest(readRequest) || { readtype: A.DS_READTYPE.READ_ALL };

            if ( readRequest.dynamicmode ) {
                ctx._dynamicmode = readRequest.dynamicmode;
            }

            if ( ctx.readRequest.readtype == A.DS_READTYPE.READ_RANGE ) {
                if ( !A.isNil(optcomm) ) {
                    this._comm = optcomm;
                    this._commparam = optcommparam;
                }

                _commname = this._comm || 'comm';
                _commparam = this._commparam || {};
            }


            if ( readRequest.data !== undefined ) {
                reqOptions[ 'data' ] = readRequest.data;
            }

            function succ(response, request, options) {
                ctx.__callbackSuccess(response, request, options);
            }

            function error(response, ajaxerroraguments) {
                ctx.__callbackError(response, ajaxerroraguments);
            }

            this.event_fire(DS_EVENT.TRANSACTION_BEGIN, reqOptions);

            var datasetcomm = A.createModule(_commname, reqOptions, _commparam);
            datasetcomm.send(this);
        },

        clearTrans: function() {
            if ( this.trans.hasTrans() ) {
                this.trans.clearTrans();
            }
        },

        clear: function() {
            this.clearTrans();
            this._clear();

            this.event_fire(DS_EVENT.RESETDATASET);
        },

        event_fire: function(evtname) {
            this.events.fire.apply(this.events, arguments);
        },

        setLocalMode: function(bMode) {
            this._localmode = bMode;
        },

        setDefaultReadCount: function(val) {
            A.assert((val >= 10), "defaultreadcount must be over 10");
            this._defaultreadcount = val;
        },

        setCurrentRow: function(idx) {
            A.assert((idx >= 0 || idx < this._rowprop()), "out of range : " + idx);

            this.currow = idx;
            this.event_fire(DS_EVENT.SELECTED_ROWDATA, { currow: idx });
        },

        getStatus: function() {
            var stat_type = arguments[ 0 ],
                arg1 = arguments[ 1 ],
                row,
                rtype,
                ret = null;

            switch ( stat_type ) {
                case DS_STATUS.STAT_HASEDIT: {
                    ret = this.trans.hasTrans();
                }
                    break;
                case DS_STATUS.STAT_ROWEDITTYPE: {
                    A.assert(arg1 !== undefined, "rowindex(2th argument) is missing.");
                    row = this.realdata[ arg1 ];
                    ret = this.trans.searchRowType(row);
                }
                    break;
                case DS_STATUS.STAT_COUNTEDIT_ALL: {
                    ret = this.trans.countTrans();
                }
                    break;
                case DS_STATUS.STAT_COUNTEDIT_ADD: {
                    ret = this.trans.getCountByType(DS_TRTYPE.ADD);
                }
                    break;
                case DS_STATUS.STAT_COUNTEDIT_DEL: {
                    ret = this.trans.getCountByType(DS_TRTYPE.DELETE);
                }
                    break;
                case DS_STATUS.STAT_COUNTEDIT_UPDATE: {
                    ret = this.trans.getCountByType(DS_TRTYPE.UPDATE);
                }
                    break;
                case DS_STATUS.STAT_DYNAMICLOAD_COMPLETED: {
                    ret = this._dynamicloadcomplete;
                }
                    break;

            }

            return ret;
        },

        loadJSON: function(url, async) {
            this.loadFile(url, async);
        },

        id: function() {
            var newval = (arguments.length > 0) ? arguments[ 0 ] : null;

            if ( newval !== null ) {
                this._id = newval;
            }
            else {
                return this._id;
            }
        },

        localmode: function() {
            var newval = (arguments.length > 0) ? arguments[ 0 ] : null;

            if ( newval !== null ) {
                this.setLocalMode(newval);
            }
            else {
                return this._localmode;
            }
        },

        dynamicmode: function() {
            var newval = (arguments.length > 0) ? arguments[ 0 ] : null;

            return this._dynamicmode;
        },

        url: function() {
            var newval = (arguments.length > 0) ? arguments[ 0 ] : null;

            return this._url;
        },

        defaultreadcount: function() {
            var newval = (arguments.length > 0) ? arguments[ 0 ] : null;

            if ( newval != null ) {
                this.setDefaultReadCount(newval);
            }
            else {
                return this._defaultreadcount;
            }
        },

        getRowCount: function() {
            return this.row;
        },

        getDynamicRowCount: function() {
            return this.dynrow;
        },

        getRealRowCount: function() {
            return this.realrow;
        },

        getCurrentRowIndex: function() {
            return this.currow;
        },

        setCurrentRowIndex: function(idx) {
            this.setCurrentRow(idx);
        },

        fixedcolumnmode: function() {
            var newval = (arguments.length > 0) ? arguments[ 0 ] : null;

            if ( newval !== null ) {
                this._fixedcolumnmode = newval;
            }

            return this._fixedcolumnmode;
        },

        getColCount: function() {
            return this.col;
        },

        getColNames: function(ncol) {
            if ( ncol === undefined ) {
                return A.copyObject(this.colnames);
            }
            else {
                A.assert((ncol >= 0 && ncol < this.col), "invalid column index => {0} in {1}".format(ncol, this.col));
                return this.colnames[ ncol ];
            }
        },

        getCols: function() {
            return A.copyObject(this.colnames);
        },

        setColNames: function(cols) {
            A.assert(A.isArray(cols), "invalid type. it must be array-type.");

            if ( this._localmode || this._fixedcolumnmode ) {
                this.colnames = _arraycopy(cols);
                this.col = cols.length;
            }
        },

        getColIndex: function(name) {
            return this.colnames.indexOf(name);
        },

        getRowAll: function() {
            return this.getDataAll();
        },

        getRowAllObject: function() {
            return this.getDataAllObject();
        },

        getCell: function(nrow, ncol) {

            if ( nrow === undefined || ncol === undefined ) {
                throw new Error("invalid parameter");
            }

            if ( nrow < 0 || nrow >= this._rowprop() ) {
                throw new Error("error: out of range - row index");
            }

            if ( ncol < 0 || ncol >= this.col ) {
                throw new Error("error: out of range - column index");
            }

            return this.realdata[ nrow ][ ncol ];
        },

        insertRow: function(newrow, pos) {

            A.assert(newrow, "invalid parameter - newrow");
            A.assert((pos >= 0 && pos <= this._rowprop()), "out of range error - nrow");

            this.addRow(newrow, pos);
        },

        deleteRow: function(nrow) {

            if ( nrow < 0 || nrow >= this._rowprop() ) {
                throw new Error("error: out of range - row index");
            }

            this.removeRow(nrow);
        },

        deleteAllRow: function() {
            var rowlen = this.getRowCount() - 1;
            for ( var i = rowlen; i >= 0; i-- ) {
                this.removeRow(i);
            }
        },

        clearTransaction: function() {
            this.clearTrans();
        },

        hasTransaction: function() {
            return this.trans.hasTrans();
        },

        status: function(type) {
            var args = Array.prototype.slice.call(arguments);

            return this.getStatus.apply(this, args);
        },

        on: function() {
            var ename = arguments[ 0 ],
                efunc = arguments[ 1 ],
                ctx = arguments[ 2 ] || this,
                async = arguments[ 3 ] || false;

            this.events.on(ename, efunc, ctx, async);
        },

        off: function() {
            var ename = arguments[ 0 ],
                efunc = arguments[ 1 ],
                ctx = arguments[ 2 ] || this;

            this.events.off(ename, efunc, ctx);
        },

        get: function(path) {
            var cases = { 
                isAllRowsReturnedCase: function(path) {
                    return path == undefined || path.length == 0;
                },
                isRowReturnedCase: function(path) {
                    return path.length == 1;
                },
                isCellDataReturnedCase: function(path) {
                    return path.length == 2;
                },

                isNumber: function(path) {
                    var ret = true;

                    if ( path.length > 0 ) {

                        if ( isNaN(path[ 0 ]) ) {
                            ret = false;
                        }
                    }

                    return ret;
                }
            };


            if ( cases.isAllRowsReturnedCase(path) ) {

                return this.getRowAllObject();

            }
            else if ( A.isArray(path) ) {

                if ( this.get().length == 0 ) {
                    return undefined;
                }

                if ( !(path[ 0 ] == '@first' || path[ 0 ] == '@last') ) {
                    if ( !cases.isNumber(path) ) {
                        throw new Error("Path first argument must be number.");
                    }
                }

                if ( cases.isRowReturnedCase(path) ) {
                    if ( path[ 0 ] == '@first' ) {
                        path[ 0 ] = [ 0 ];
                    } else if ( path[ 0 ] == '@last' ) {
                        path[ 0 ] = [ this.get([]).length - 1 ];
                    }

                    return this.getRowObject(path[ 0 ]);

                } else if ( cases.isCellDataReturnedCase(path) ) {

                    if ( A.isNumber(path[ 1 ]) ) {

                        return this.getCell(path[ 0 ], path[ 1 ]);

                    } else if ( A.isString(path[ 1 ]) ) {

                        return this.getCell(path[ 0 ], this.getColIndex(path[ 1 ]));

                    }

                } else {
                    throw new Error("Path argument is invalid.");
                }

            } else {
                throw new Error("Path must be Array.");
            }
        },

        set: function(path, rowObject) {
            var self = this;
            var cases = { 
                isAllDataReplacedCase1: function(path, rowObject) {

                    return (A.isArray(path) && path.length == 0 && A.isArray(rowObject));
                },
                isAllDataReplacedCase2: function(path, rowObject) {
                    return A.isArray(path) && rowObject == undefined;
                },
                isRowAppendedToFirstCase: function(path, rowObject) {
                    return path[ 0 ] && A.isString(path[ 0 ]) && path[ 0 ].toLowerCase() == '@first';
                },
                isRowAppendedToLastCase: function(path, rowObject) {
                    return path[ 0 ] && A.isString(path[ 0 ]) && path[ 0 ].toLowerCase() == '@last';
                },
                isCellDataUpdatedCaseByColumnIndex: function(columnInfo) {
                    return A.isNumber(columnInfo);
                },
                isCellDataUpdatedCaseByColumnName: function(columnInfo) {
                    return A.isString(columnInfo);
                },
                isRowChangedCaseByRowObjectWithoutColumninfo: function(columnInfo) {
                    return columnInfo == undefined;
                },
                isNumber: function(path) {
                    var ret = true;

                    if ( path.length > 0 ) {

                        if ( isNaN(path[ 0 ]) && path[ 0 ].toLowerCase() != '@first' && path[ 0 ].toLowerCase() != '@last' ) {
                            ret = false;
                        }
                    }

                    return ret;
                }
            };

            if ( cases.isAllDataReplacedCase1(path, rowObject) || cases.isAllDataReplacedCase2(path, rowObject) ) {
                if ( cases.isAllDataReplacedCase2(path, rowObject) ) {
                    rowObject = path;
                }

                var validateDatasetColumnWithRowObjectColumn = function(datasetColumns, rowObject) { 
                    var isIncludedColumnNameInDataset = function(datasetColumns, columnName) {
                        for ( var k = 0; k < datasetColumns.length; k++ ) {
                            if ( datasetColumns[ k ] == columnName ) {
                                return true;
                            }
                        }
                        return false;
                    };

                    var returnValue = true;
                    for ( var rowIndex in rowObject ) {
                        var row = rowObject[ rowIndex ];
                        for ( var columnName in row ) {
                            if ( !isIncludedColumnNameInDataset(datasetColumns, columnName) ) {
                                throw new Error("'" + columnName + "' columnName is not included in Dataset Columns");
                                returnValue = false;
                            }
                        }
                    }

                    return returnValue;
                };

                var insertRowObjects = function() {
                    for ( var i in rowObject ) {
                        if ( A.isObject(rowObject[ i ]) ) {
                            self.addRow(rowObject[ i ], "last");
                        } else {
                            throw new Error('Invalid type of data to be inserted.');
                        }
                    }
                };

                if ( self.getRowCount() > 0 && validateDatasetColumnWithRowObjectColumn(self.getColNames(), rowObject) ) {
                    self.deleteAllRow();
                }

                insertRowObjects();

                this.setDatasetState(A.DS_STATE.LOADED);

                self.event_fire(DS_EVENT.LOADCOMPLETE, {
                    rows: A.copyObject(self.getRowAll()),
                    cols: A.copyObject(self.getCols()),
                    startindex: 0,
                    readindex: 0,
                    readcount: self.getRowCount(),
                    rowcount: self.getRowCount(),
                    dynamicmode: self._dynamicmode
                });

            } else {

                if ( !cases.isNumber(path) ) {
                    throw new Error("first path must be rowNumber or '@first' or '@last'");
                }

                if ( cases.isRowAppendedToFirstCase(path, rowObject) ) {
                    self.addRow(rowObject, "first");
                }
                else if ( cases.isRowAppendedToLastCase(path, rowObject) ) {
                    self.addRow(rowObject, "last");

                } else {

                    var rowNumber = path[ 0 ];
                    var columnInfo = path[ 1 ];

                    if ( A.isNumber(rowNumber) ) {

                        if ( cases.isCellDataUpdatedCaseByColumnIndex(columnInfo) ) {

                            self.updateCell(rowNumber, columnInfo, rowObject);

                        } else if ( cases.isCellDataUpdatedCaseByColumnName(columnInfo) ) {
                            var columnIndex = self.getColIndex(columnInfo);

                            self.updateCell(rowNumber, columnIndex, rowObject);

                        } else if ( cases.isRowChangedCaseByRowObjectWithoutColumninfo(columnInfo) ) {

                            self.updateRow(rowNumber, rowObject);
                        }

                    } else {

                        throw new Error("Row Number is Invalid.");
                    }
                }

            }

            if ( cases.isAllDataReplacedCase1(path, rowObject) || cases.isAllDataReplacedCase2(path, rowObject) ) {

                self.event_fire(DS_EVENT.LOADCOMPLETE, {
                    rows: A.copyObject(self.getRowAll()),
                    cols: A.copyObject(self.getCols()),
                    startindex: 0,
                    readindex: 0,
                    readcount: self.getRowCount(),
                    rowcount: self.getRowCount(),
                    dynamicmode: self._dynamicmode
                });
            }
        },

        remove: function(path) {
            var isValidPathStyle = function(path) {
                if ( !( 0 <= path.length && path.length <= 2 ) ) {
                    throw new Error('wrong parameter');
                }

                for ( var i = 0; i < path.length; i++ ) {
                    if ( !( Camellia.isNumber(path[ i ]) || Camellia.isString(path[ i ]) ) ) {
                        throw new Error('wrong parameter');
                    }
                }

                return true;
            };

            path = path || [];
            if ( path.length == 1 && Camellia.isString(path[ 0 ]) && path[ 0 ].substr(0, 1) == '@' ) { 

                var isSupportedTag = function(tagName) { 
                    var supportedTags = [ 
                        '@first',
                        '@last'
                    ], flag = false;

                    for ( var i = 0; i < supportedTags.length; i++ ) {
                        if ( tagName == supportedTags[ i ] ) {
                            flag = true;
                            break;
                        }
                    }

                    return flag;
                };

                if ( !isSupportedTag(path[ 0 ]) ) {
                    throw new Error("'" + path[ 0 ] + "' is not supported tag for path");
                }

                switch ( path[ 0 ] ) {
                    case '@first':
                        path = [ 0 ];
                        break;
                    case '@last':
                        path = [ this.get([]).length - 1 ];
                        break;
                }
            }

            if ( isValidPathStyle(path) ) {
                if ( path.length == 0 ) {

                    this.deleteAllRow();

                } else if ( path.length == 1 ) {

                    path = this._normalize(path);
                    return this.deleteRow(path[ 0 ]);

                } else if ( path.length == 2 ) {

                    this.set(path, '');

                }
            }
        }
    };

    A.inherit(dataset, A.getModule("datasetbase")); 
    A.extendModule(dataset, "dataset.table");

    A.DS_EVENT = A.copyObject(DS_EVENT);
    A.DS_READTYPE = A.copyObject(DS_READTYPE);
    A.DS_TRTYPE = A.copyObject(DS_TRTYPE);
    A.DS_DYNAMICTYPE = A.copyObject(DS_DYNAMICTYPE);
    A.DS_STATUS = A.copyObject(DS_STATUS);

})(Camellia);

(function(A) {

    "use strict";

    if ( A === undefined || A === null ) {
        throw new Error("Camellia is undefined or null");
    }

    var REQUEST_DATASET_TYPE = '__AUI_DATASET_TREE__';

    function _booleanOr(t, or) {
        if ( A.isBoolean(t) === true ) {
            return t;
        }
        else {
            return or;
        }
    }

    function TreeTransManager() {
        if ( !(this instanceof TreeTransManager) ) {
            return new TreeTransManager();
        }

        this.keymap = {};
        this.trarry = [];
    }

    TreeTransManager.prototype = {
        destroy: function() {
            this.trarry = null;
            this.keymap = null;
        },

        clear: function() {
            this.trarry = [];
            this.keymap = {};
        },

        hasTrans: function() {
            return (this.trarry.length > 0);
        },

        add: function(type, item) {
            var i;

            A.assert(type === A.DS_TRTYPE.ADD || type === A.DS_TRTYPE.UPDATE || type === A.DS_TRTYPE.DELETE, "transaction type error");


            switch ( type ) {
                case A.DS_TRTYPE.ADD:

                    var prev = this._findPrevItem(item);

                    if ( !prev ) {
                        this._add(type, item);
                        return;
                    }

                    if ( prev.type == A.DS_TRTYPE.DELETE ) {

                        var idx = this._findIndex(item);

                        this.trarry[ idx ].data = item;
                        this.trarry[ idx ].type = A.DS_TRTYPE.UPDATE;

                    }


                    break;
                case A.DS_TRTYPE.UPDATE:

                    var prev = this._findPrevItem(item),
                        prevData;

                    if ( !prev ) {
                        this._add(type, item);
                        return;
                    }

                    prevData = prev.data;

                    if ( prev.type == A.DS_TRTYPE.ADD || prev.type == A.DS_TRTYPE.UPDATE ) {

                        var idx = this._findIndex(item);

                        for ( var name in item ) {
                            prevData[ name ] = item[ name ];
                        }

                        this.trarry[ idx ].data = prevData;

                    }

                    break;
                case A.DS_TRTYPE.DELETE:

                    var prev = this._findPrevItem(item);

                    if ( !prev ) {

                        this._add(type, item);
                        return;
                    }

                    if ( prev.type == A.DS_TRTYPE.ADD ) {

                        this._remove(prev);

                    } else if ( prev.type == A.DS_TRTYPE.UPDATE ) {

                        var idx = this._findIndex(item);
                        this.trarry[ idx ].type = type;
                    }

                    break;
                default:
                    break;
            }
        },

        remove: function(type, item) {
        },

        getAll: function() {
            return this.trarry;
        },

        _add: function(type, item) {
            this.trarry.push({
                type: type,
                data: item
            });

            this.keymap[ item.id ] = {
                type: type,
                data: item
            };
        },

        _remove: function(item) {

            var deleteIndex = this._findIndex(item);

            this.trarry.splice(deleteIndex, 1);
            delete this.keymap[ item.id ];
        },

        _findIndex: function(item) {
            var trdata, ret = -1;

            for ( var idx = 0; idx < this.trarry.length; idx++ ) {
                trdata = this.trarry[ idx ].data;
                if ( item.id == trdata.id ) {
                    ret = idx;
                    break;
                }
            }

            return ret;
        },

        _findPrevItem: function(item) {

            return (this.keymap[ item.id ] || null);
        }
    };

    function treedataset(options) {
        if ( !(this instanceof treedataset) ) {
            return new treedataset(options);
        }

        if ( treedataset._super_proto_ !== undefined ) {
            treedataset._super_constructor(this, arguments);
        }

        options = options || {};

        this.id = options.id || A.generateUUID();
        this.url = options.url || "";
        this.autoload = options.autoload || false;
        this.localmode = _booleanOr(options.localmode, ((this.url.length > 0) ? false : true));

        this.reqobject = options.reqobject || { readtype: A.DS_READTYPE.READ_ALL };
        this.readtype = (this.reqobject.readtype != undefined) ? this.reqobject.readtype : A.DS_READTYPE.READ_ALL;

        this._selectedIndex = 0;

        this.trmanager = new TreeTransManager();

        this.events = A.createModule("events", this.EVENTS);
        this.events.parseOption(options, this);
    }

    treedataset.prototype =
    {

        EVENTS: {
            LOADCOMPLETE: "eventLoadComplete",

            CHANGED_POSITION: "eventChangedPosition",

            CHANGED_DATA: "eventChangedData",
            ADDED_DATA: "eventAddedData",
            DELETED_DATA: "eventDeletedData",
            SELECTED_DATA: "eventSelectedData",

            RESETDATASET: "eventResetDataset",

            TRANSACTION_BEGIN: "eventTransactionBegin",
            TRANSACTION_END: "eventTransactionEnd",
            TRANSACTION_REQUEST: "eventTransactionRequest",
            TRANSACTION_RESPONSE: "eventTransactionResponse",
            TRANSACTION_ERROR: 'eventTransactionError',
            DESTROY: 'eventDestroyDataset'
        },

        construct: function(options, comm, commparam) {
            this.init(comm, commparam);
        },

        __createData: function(options) {
            this.data = options.data ? A.copyObject(options.data) : [];

            if (!A.isNil(options.data)) {
                this.setDatasetState(A.DS_STATE.LOADED);
            }
        },

        init: function(comm, commparam) {
            if ( !this.autoload ) {
                return;
            }

            if ( this.autoload ) {
                A.assert(this.url != "", "invalid url");
            }

            var reqOptions = { url: this.url };

            A.extendif(reqOptions, this.reqobject || {}, "OEMC");
            this.requestTransaction(reqOptions, comm, commparam);
        },

        destroy: function() {
            this.trmanager.destroy();
            this.superc(A.getModule("datasetbase"), 'destroy');
        },

        clear: function() {
            this.trmanager.clear();
            this.data = [];

            this.events.fire(this.EVENTS.RESETDATASET);
        },

        on: function() {
            var ename = arguments[ 0 ],
                efunc = arguments[ 1 ],
                ctx = arguments[ 2 ] || this,
                async = arguments[ 3 ] || false;

            this.events.on(ename, efunc, ctx, async);
        },

        off: function() {
            var ename = arguments[ 0 ],
                efunc = arguments[ 1 ],
                ctx = arguments[ 2 ] || this;

            this.events.off(ename, efunc, ctx);
        },

        _setSelectedIndex: function(idx) {
            this._selectedIndex = idx || 0;

            this.event_fire(this.EVENTS.SELECTED_DATA, {
                selectedIndex: this._getSelectedIndex(),
                value: A.copyObject(this.get([ this._selectedIndex ]))
            });
        },

        _getSelectedIndex: function() {
            return this._selectedIndex;
        },

        __setReadtype: function(readtype) {
            if (readtype != A.DS_READTYPE.READ_NONE && readtype != A.DS_READTYPE.READ_ALL) {
                throw new Error("Invalid Read Type - tree dataset only accepts READ_ALL, READ_NONE.");
            }

            if (A.isNil(this.readtype) || this.readtype == A.DS_READTYPE.READ_ALL) {
                this.readtype = readtype;
            }
        },

        __buildResponse: function(data) {
            return data;
        },

        __buildRequest: function() {
            var returnObj = {},
                treeTransactionTrace = A.copyObject(this.trmanager.getAll()) || [];

            returnObj[ 'request_data_id' ] = this.id;
            returnObj[ 'request_data_type' ] = REQUEST_DATASET_TYPE;
            returnObj[ 'request_data_readtype' ] = { readtype: this.readtype };
            returnObj[ 'request_data' ] = {
                tr_add: [],
                tr_delete: [],
                tr_update: []
            };

            for ( var ax = 0, len = treeTransactionTrace.length; ax < len; ax++ ) {
                var refArryItem = treeTransactionTrace[ ax ];

                if ( refArryItem.type === A.DS_TRTYPE.ADD ) {
                    returnObj[ 'request_data' ].tr_add.push(refArryItem.data);
                }
                else if ( refArryItem.type === A.DS_TRTYPE.DELETE ) {
                    returnObj[ 'request_data' ].tr_delete.push(refArryItem.data);
                }
                else if ( refArryItem.type === A.DS_TRTYPE.UPDATE ) {
                    returnObj[ 'request_data' ].tr_update.push(refArryItem.data);
                }
            }

            this.event_fire(this.EVENTS.TRANSACTION_REQUEST, returnObj);
            return returnObj;
        },

        __verify: function(data) {
            var ecode = (data[ "errorcode" ] + "").trim();
            if ( ecode !== "0" ) {
                return true;
            }

            if ( this.readtype != A.DS_READTYPE.READ_NONE ) {
                if ( data[ "response_data" ] === undefined || data[ "response_data" ] === null ) {
                    throw new Error("Invalid Protocol Spec - undefined or null response_data");
                }

                if ( data[ "response_data_id" ] === undefined || data[ "response_data_id" ] === null ) {
                    throw new Error("Invalid Protocol Spec - undefined or null response_data_id");
                }

                if ( !A.isArray(data[ "response_data" ]) ) {
                    throw new Error("Invalid Protocol Spec - data must be array for tree");
                }
            }


            if ( data[ "response_data_type" ] === undefined || data[ "response_data_type" ] === null ) {
                throw new Error("Invalid Protocol Spec - undefined or null response_data_type");
            }

            if ( data[ "response_data_type" ] !== REQUEST_DATASET_TYPE ) {
                throw new Error("Invalid Protocol Spec - mismatched response_data_type (" + data[ "response_data_type" ] + "/" + REQUEST_DATASET_TYPE + ")");
            }


            return true;
        },

        requestTransaction: function(reqObject, optcomm, optcommparam) {
            this.superc(A.getModule("datasetbase"), 'requestTransaction', reqObject);

            reqObject = reqObject || {};

            var ctx = this,
                url = reqObject.url,
                options = {},
                _commname = optcomm || "comm",
                _commparam = optcommparam;


            if ( reqObject.readtype != undefined ) {
                this.readtype = reqObject.readtype;
            } else {
                this.readtype = A.DS_READTYPE.READ_ALL;
            }

            options = {
                url: url || this.url,
                async: (reqObject.async === undefined ? true : reqObject.async),
                data: reqObject.data || {},
                headers: reqObject.headers || {},
                callbackSucc: function(res, req, opts) {
                    ctx.__callbackSuccess(res, req, opts);
                },
                callbackError: function(res, ajaxerr) {
                    ctx.__callbackError(res, ajaxerr);
                }
            };

            ctx.event_fire(ctx.EVENTS.TRANSACTION_BEGIN, options);

            A.createModule(_commname, options, _commparam).send(this);
        },

        clearTransaction: function() {
            this.trmanager.clear();
        },

        hasTransaction: function() {
            return this.trmanager.hasTrans();
        },

        __callbackSuccess: function(response, request, options) {
            if(A.isNil(this.events)) {
                return;
            }

            this.event_fire(this.EVENTS.TRANSACTION_RESPONSE, response);

            this.setDatasetState(A.DS_STATE.LOADED);

            var readRequest = request[ "request_data_readtype" ];

            switch ( readRequest[ "readtype" ] ) {
                case A.DS_READTYPE.READ_NONE:
                    break;
                case A.DS_READTYPE.READ_ALL:
                    this.url = options.url; 
                    this._set([], A.copyObject(response[ "response_data" ]));
                    this.event_fire(this.EVENTS.LOADCOMPLETE, { data: A.copyObject(response[ "response_data" ]) });
                    break;
            }

            this.trmanager.clear();
            this.event_fire(this.EVENTS.TRANSACTION_END, {
                request: A.copyObject(request),
                response: A.copyObject(response)
            });
        },

        __callbackError: function(response, ajaxerroraguments) {
            if(A.isNil(this.events)) {
                return;
            }

            this.event_fire(this.EVENTS.TRANSACTION_ERROR, response, ajaxerroraguments);
        }
    };


    A.extendif(treedataset.prototype,
        {

            setNextIdFunc: function(func) {
                A.assert(A.isFunction(func), "not a function");

                this.nextIdFunc = func;
            },

            _getNextId: function() {
                var getOriginalGeneratedId = function() {
                    return (new Date()).getTime(); 
                };

                if ( this.nextIdFunc ) {
                    var args = [].slice.call(arguments);
                    args.push(getOriginalGeneratedId());

                    return this.nextIdFunc.apply(
                        this,
                        args
                    );
                } else {
                    return getOriginalGeneratedId();
                }
            },

            find: function(findKeyItem) {
                var idx = 0, ret = [],
                    parent = this.data;

                for ( var j in parent ) {
                    for ( var k in findKeyItem ) {
                        if ( parent[ j ][ k ] == findKeyItem[ k ] ) {
                            idx++;
                        } else {
                            idx = 0;
                            break;
                        }

                        if ( Object.keys(findKeyItem).length == idx ) {
                            idx = 0;
                            ret.push(parent[ j ]);
                            break;
                        }
                    }
                }

                return ret;
            },

            add: function(newval) {
                var idx = this.get([]).length;

                if ( newval.id ) {
                    A.assert(!this.getById(newval.id), "The item already exists");
                } else {
                    newval.id = this._getNextId(idx, newval);
                }

                this._set([ idx ], {
                    id: newval.id,
                    parentid: newval.parentid || "",
                    label: newval.label,
                    value: newval.value
                });

                if ( !this.localmode ) {
                    this.trmanager.add(A.DS_TRTYPE.ADD, newval);
                }

                this.events.fire(this.EVENTS.ADDED_DATA, {
                    id: newval.id,
                    value: this.getById(newval.id)
                });

                if ( this._getSelectedIndex() == this._getIndexById(newval.id) ) {
                    this._setSelectedIndex(0);
                }
            },

            update: function(path, newval) {
                A.assert(arguments.length == 2, "invalid arguments");
                A.assert(A.isArray(path), "path must be array");

                var fullPath = A.copyObject(path);
                var data = this.get(path);
                if ( data === undefined ) {
                    return;
                }

                var oldItem = A.copyObject(this.get([ path[ 0 ] ]));
                var oldValue = A.copyObject(data);
                if ( A.isPlainObject(newval) ) {
                    for ( var key in newval ) {
                        data[ key ] = newval[ key ];
                    }
                } else {
                    data = newval;
                }

                this._set(path, data);

                if ( path.length > 1 ) {
                    data = this.get(path.splice(0, 1));
                }

                if ( !this.localmode ) {
                    this.trmanager.add(A.DS_TRTYPE.UPDATE, data);
                }

                this.event_fire(this.EVENTS.CHANGED_DATA, {
                    id: data.id,
                    path: fullPath,
                    oldItem: oldItem,
                    newItem: A.copyObject(data)
                });
            },
            get: function(path) {
                path = path || [];

                A.assert(A.isArray(path), "path must be array");

                path = this._normalize(path);
                if ( path === undefined ) {
                    return undefined;
                }
                var result = this._getRef.call(this, path);
                return A.copyObject(result);
            },

            set: function() {
                var path = [], values,
                    items = [];

                A.assert(arguments.length <= 2, "invalid arguments");

                if ( arguments.length == 1 ) {
                    path = [];
                    values = arguments[ 0 ];
                } else {
                    path = arguments[ 0 ];
                    values = arguments[ 1 ];
                }

                if ( A.isArray(values) ) {
                    items = values;
                } else {
                    items.push(values);
                }

                if ( path.length === 0 ) {
                    this.remove([]);

                    for ( var idx = 0; idx < items.length; idx++ ) {
                        this.add(items[ idx ]);
                    }

                    this.event_fire(this.EVENTS.LOADCOMPLETE, {
                        data: A.copyObject(items)
                    });
                    this.setDatasetState(A.DS_STATE.LOADED);

                    return;
                }

                for ( var idx = 0; idx < items.length; idx++ ) {
                    if ( this.get(path) === undefined ) {
                        this.add(items[ idx ]);
                    } else {
                        this.update(path, items[ idx ]);
                    }
                }
            },

            _set: function(path, newval) {
                var i, parent;
                path = this._normalize(path);

                parent = this.data;
                for ( i = 0; i < path.length - 1; i++ ) {

                    parent = parent[ path[ i ] ];
                }

                if ( path.length === 0 ) {
                    this.data = newval;
                } else {
                    parent[ path[ i ] ] = newval;
                }
            },

            addTo: function(newval, parentItem) {
                A.assert(arguments.length == 2, "invalid arguments");

                var newItem = newval || {},
                    parentId = 0;

                if ( parentItem ) {
                    parentId = parentItem.id;
                }

                newItem.parentid = parentId;

                this.add(newItem);
            },

            addNext: function(newItem, nextItem, before) {
                before = (before == undefined) ? false : before;

                A.assert(newItem != undefined && newItem != null, "invalid first argument");
                A.assert(nextItem != undefined && nextItem != null, "invalid second argument");

                newItem[ 'parentid' ] = nextItem[ 'parentid' ];

                this.add(newItem);

                this._move(this.get([ this.get().length - 1 ]), nextItem, before);
            },

            move: function(fromItem, toItem, before) {
                before = (before == undefined) ? false : before;

                A.assert(fromItem != undefined && fromItem != null, "invalid first argument");
                A.assert(toItem != undefined && toItem != null, "invalid second argument");

                this._move(fromItem, toItem, before);

                this.events.fire(this.EVENTS.CHANGED_POSITION, {
                    fromItem: fromItem,
                    toItem: toItem
                });
            },

            _move: function(fromItem, toItem, before) {
                var d = this.get([]);

                for ( var i = 0, len = d.length; i < len; i++ ) {

                    if ( d[ i ].id == fromItem.id ) {

                        if ( d[ i ].parentid != fromItem.parentid && !this.localmode ) {
                            this.trmanager.add(A.DS_TRTYPE.UPDATE, fromItem);
                        }

                        d.splice(i, 1);

                        break;
                    }
                }

                for ( var i = 0, len = d.length; i < len; i++ ) {

                    if ( d[ i ].id == toItem.id ) {

                        if ( before ) {
                            d.splice(i, 0, fromItem);
                        } else {
                            d.splice(i + 1, 0, fromItem);
                        }

                        break;
                    }
                }

                this._set([], d);
            },

            remove: function(path) {
                var parent, deleteItemIdx, deleteTargetId, removedItems = [];

                path = path || [];
                if ( path.length == 1 && A.isString(path[ 0 ]) && path[ 0 ].substr(0, 1) == '@' ) { 

                    var isSupportedTag = function(tagName) { 
                        var supportedTags = [ 
                            '@first',
                            '@last'
                        ], flag = false;

                        for ( var i = 0; i < supportedTags.length; i++ ) {
                            if ( tagName == supportedTags[ i ] ) {
                                flag = true;
                                break;
                            }
                        }

                        return flag;
                    };

                    if ( !isSupportedTag(path[ 0 ]) ) {
                        throw new Error("'" + path[ 0 ] + "' is not supported tag for path");
                    }

                    switch ( path[ 0 ] ) {
                        case '@first':
                            path = [ 0 ];
                            break;
                        case '@last':
                            path = [ this.get([]).length - 1 ];
                            break;
                    }

                }

                path = this._normalize(path);

                if ( path.length === 0 ) {
                    removedItems = A.copyObject(this.data);

                    while ( this.data.length > 0 ) {
                        var deleteItem = A.copyObject(this.data[ 0 ]);

                        if ( !this.localmode ) {
                            this.trmanager.add(A.DS_TRTYPE.DELETE, deleteItem);
                        }

                        this.data.splice(0, 1);
                        this.events.fire(this.EVENTS.DELETED_DATA, {
                            id: deleteItem.id,
                            deleteItemIndex: 0,
                            value: deleteItem
                        });
                    }

                    this._selectedIndex = -1;
                    return;
                }

                parent = this.get(path);
                if ( parent === undefined ) {
                    return;
                }

                if (path.length == 1) {
                    removedItems = this.getByParentid(parent.id);
                    deleteTargetId = parent.id;

                    removedItems.push(parent);

                    while ( removedItems.length > 0 ) {
                        var removedItem = removedItems.shift(),
                            deleteIndex = this._getIndexById(removedItem[ "id" ]);

                        if ( !this.localmode ) {
                            this.trmanager.add(A.DS_TRTYPE.DELETE, removedItem);
                        }

                        this.data.splice(deleteIndex, 1);
                        this.events.fire(this.EVENTS.DELETED_DATA, {
                            id: removedItem[ "id" ],
                            deleteItemIndex: deleteIndex,
                            value: A.copyObject(removedItem)
                        });
                    }
                } else {
                    var deleteItemIndex = path[0],
                        data = this.data,
                        idx = 0, len = 0;

                    removedItems = this.get([deleteItemIndex]);
                    deleteTargetId = removedItems[ "id" ];

                    for (idx = 0, len = path.length; idx < len -1; idx++) {
                        data = data[path[idx]];
                    }

                    data[path[idx]] = undefined;

                    if ( !this.localmode ) {
                        this.trmanager.add(A.DS_TRTYPE.UPDATE, removedItems);
                    }

                    this.events.fire(this.EVENTS.DELETED_DATA, {
                        id: removedItems[ "id" ],
                        deleteItemIndex: deleteItemIndex,
                        value: A.copyObject(removedItems)
                    });
                }

                if ( this._getSelectedIndex() == path[0] ) {
                    this._setSelectedIndex(0);
                }
            },

            getById: function(id) {
                var path = [];

                if ( id ) {
                    path = [ { id: id } ];
                }

                path = this._normalize(path);
                if ( path === undefined ) {
                    return undefined;
                }
                var result = this._getRef.call(this, path);
                return A.copyObject(result);
            },

            getByParentid: function(parentid) {
                var item, targetIds = [], resultItems = [];

                item = this.getById(parentid);
                if ( !item ) {
                    return;
                }

                targetIds.push(parentid);

                while ( targetIds.length > 0 ) {
                    parentid = targetIds.shift();

                    item = this.find({ parentid: parentid });

                    for ( var i in item ) {
                        resultItems.push(item[ i ]);
                        targetIds.push(item[ i ].id);
                    }
                }

                return resultItems;
            },

            getAll: function() {
                return this.get([]);
            },

            _getIndexById: function(id) {
                A.assert(id != undefined && id != null, "id must be exist to get index");

                var d = this.data || [],
                    retIdx = -1;

                for ( var idx = 0; idx < d.length; idx++ ) {
                    if ( d[ idx ].id == id ) {
                        retIdx = idx;
                        break;
                    }
                }

                return retIdx;
            },

            event_fire: function() {
                this.events.fire.apply(this.events, arguments);
            },

            setLocalMode: function(newval) {
                this.localmode = newval;
            }

        }, "OEMC");

    A.inherit(treedataset, A.getModule("datasetbase"));
    A.extendModule(treedataset, "dataset.tree");

})(Camellia);


(function(A) {

    "use strict";

    if ( A === undefined || A === null ) {
        throw new Error("Camellia is undefined or null");
    }
    var _hasOwnProperty = Object.prototype.hasOwnProperty;

    var MULTIPLE_DATASET_TYPE = '__AUI_DATASET_MULTIPLE__';

    function multipledataset(options) {

        if ( !(this instanceof multipledataset) ) {
            return new multipledataset(options);
        }

        if ( multipledataset._super_proto_ !== undefined ) {
            multipledataset._super_constructor(this, arguments);
        }

        options = options || {};

        this.options = options;
        this.url = options.url || "";
        this.id = options.id || Camellia.generateUUID();
        this.localmode = false;
        this.reqobject = options.reqobject || { readtype: A.DS_READTYPE.READ_ALL };

        this.readtype = (this.reqobject.readtype != undefined) ? this.reqobject.readtype : A.DS_READTYPE.READ_ALL;

        this.events = A.createModule("events", this.EVENTS);
        this.events.parseOption(options, this);
    }

    multipledataset.prototype =
    {

        EVENTS: {
            TRANSACTION_BEGIN: "eventTransactionBegin",
            TRANSACTION_RESPONSE: "eventTransactionResponse",
            LOADCOMPLETE: "eventLoadComplete",
            TRANSACTION_END: "eventTransactionEnd",
            TRANSACTION_ERROR: "eventTransactionError",
            TRANSACTION_REQUEST: "eventTransactionRequest",
            CHANGED_DATA: "eventChangedData",
            DELETED_DATA: "eventDeletedData"
        },

        destroy: function() {
            this.superc(A.getModule("datasetbase"), 'destroy');
        },

        __createData: function(options) {
            this.data = options.data ? options.data : [];

            this._setLocalMode(false);
        },

        _setLocalMode: function(mode) {
            for ( var idx in this.data ) {

                if ( A.isModule(this.data[ idx ], "dataset.table") ) {
                    this.data[ idx ].localmode(mode);
                } else {
                    this.data[ idx ].setLocalMode(mode);
                }
            }
        },

        __buildRequest: function() {
            var returnObj = {};

            returnObj[ 'request_data_id' ] = this.id;
            returnObj[ 'request_data_type' ] = MULTIPLE_DATASET_TYPE;
            returnObj[ 'request_data_readtype' ] = { readtype: this.readtype };
            returnObj[ 'request_data' ] = this._buildRequestData();

            this.events.fire(this.EVENTS.TRANSACTION_REQUEST, returnObj);

            return returnObj;
        },

        __buildResponse: function(data) {
            return data;
        },

        _buildRequestData: function() {
            var ret = [],
                multipleData = this.data || [];

            for ( var idx = 0, len = multipleData.length; idx < len; idx++ ) {
                var ds = multipleData[ idx ];

                ds.__setReadtype(this.readtype);
                ret.push(ds.buildRequest({ readtype: this.readtype }));
            }

            return ret;
        },

        __verify: function(data) {
            var datasets = this.data || [];
            var ecode = (data[ "errorcode" ] + "").trim();

            if ( ecode !== "0" ) {
                return true;
            }

            if ( data[ "response_data" ] === undefined || data[ "response_data" ] === null ) {
                throw new Error("Invalid Protocol Spec - undefined or null response_data");
            }

            if ( data[ "response_data_id" ] === undefined || data[ "response_data_id" ] === null ) {
                throw new Error("Invalid Protocol Spec - undefined or null response_data_id");
            }

            if ( data[ "response_data_type" ] === undefined || data[ "response_data_type" ] === null ) {
                throw new Error("Invalid Protocol Spec - undefined or null response_data_type");
            }

            if ( data[ "response_data_type" ] !== MULTIPLE_DATASET_TYPE ) {
                throw new Error("Invalid Protocol Spec - mismatched response_data_type (" + data[ "response_data_type" ] + "/" + MULTIPLE_DATASET_TYPE + ")");
            }

            if ( !A.isArray(data[ "response_data" ]) ) {
                throw new Error("Invalid Protocol Spec - response_data must be array");
            }

            if(datasets.length !== data[ "response_data"].length) {
                throw new Error("Invalid Protocol Spec - Count of datasets that multiple dataset is including and Count of responseData is not equal.");
            }

            var multipleDatasetDatasFromServer = data[ "response_data" ] || [];
            for ( var idx = 0, len = multipleDatasetDatasFromServer.length; idx < len; idx++ ) {
                var data = multipleDatasetDatasFromServer[ idx ];

                if( data == undefined
                    || data == null
                    || !data.hasOwnProperty('response_data')
                    || !data.hasOwnProperty('response_data_id')
                    || !data.hasOwnProperty('response_data_type') ) {
                    throw new Error("Invalid Protocol Spec - The structure of responseData received from server is invalid.");
                }

                datasets[ idx ].__verify(data);
            }

            return true;
        },

        requestTransaction: function(reqObject, optcomm, optcommparam) {
            this.superc(A.getModule("datasetbase"), 'requestTransaction', reqObject);

            reqObject = reqObject || {};

            var ctx = this,
                url = reqObject.url,
                options = {},
                _commname = optcomm || "comm",
                _commparam = optcommparam;


            if ( reqObject.readtype != undefined ) {
                this.readtype = reqObject.readtype;
            } else {
                this.readtype = A.DS_READTYPE.READ_ALL;
            }

            options = {
                url: url || this.url,
                async: (reqObject.async === undefined ? true : reqObject.async),
                data: reqObject.data || {},
                headers: reqObject.headers || {},
                callbackSucc: function(response, request, options) {
                    if(A.isNil(ctx.events)) {
                        return;
                    }

                    ctx.events.fire(ctx.EVENTS.TRANSACTION_RESPONSE, response);

                    ctx.url = options.url; 
                    ctx._setResponseData(response[ "response_data" ], request['request_data'], options);

                    ctx.events.fire(ctx.EVENTS.LOADCOMPLETE, { data: A.copyObject(response[ "response_data" ]) });

                    ctx.events.fire(ctx.EVENTS.TRANSACTION_END, {
                        request: A.copyObject(request),
                        response: A.copyObject(response)
                    });
                },
                callbackError: function(response, ajaxerroraguments) {
                    if(A.isNil(ctx.events)) {
                        return;
                    }

                    ctx.events.fire(ctx.EVENTS.TRANSACTION_ERROR, response, ajaxerroraguments);
                }
            };

            ctx.events.fire(ctx.EVENTS.TRANSACTION_BEGIN, options);

            A.createModule(_commname, options, _commparam).send(this);
        },

        _setResponseData: function(responseData, requestData, options) {
            var datasets = this.data || [];

            responseData = responseData || [];

            for ( var idx = 0; idx < datasets.length; idx++ ) {
                datasets[ idx ].__callbackSuccess(responseData[ idx ], requestData[idx], options);
            }
        },

        get: function(path) {
            path = path || [];

            A.assert(A.isArray(path), "path must be array");

            var parent = this.data,
                idx = 0;

            for ( var i = 0; i < path.length; i++ ) {

                A.assert((A.isNumber(path[ i ]) || path[ i ] == '@first' || path[ i ] == '@last'), "path must be number or @first or @last");

                if ( path[ i ] == '@first' ) {
                    idx = 0;
                    parent = parent[ idx ];
                    break;
                } else if ( path[ i ] == '@last' ) {
                    idx = parent.length - 1;
                    parent = parent[ idx ];
                    break;
                } else {
                    idx = path[ i ];
                    parent = parent[ idx ];
                }
            }

            return parent;
        },

        set: function() {
            var path, value,
                parent = this.data,
                idx = 0;

            A.assert(arguments.length <= 2 && arguments.length > 0, "invalid arguments");

            if ( arguments.length == 1 ) {
                path = [];
                value = arguments[ 0 ];

            } else {
                path = arguments[ 0 ];
                value = arguments[ 1 ];
            }

            if (path.length == 0) {
                A.assert(A.isArray(value), "value must be array");
            }

            for (var idx = 0, len = value.length; idx < len; idx++) {
                var innerDS = value[idx];

                A.assert((A.isModule(innerDS, "dataset.simple") || A.isModule(innerDS, "dataset.tree") || A.isModule(innerDS, "dataset.table")), "value must be dataset");
            }


            for ( var i = 0; i < path.length; i++ ) {
                if ( path[ i ] == '@first' ) {

                    parent = parent.splice(0, 0, value);

                    break;
                } else if ( path[ i ] == '@last' ) {
                    idx = parent.length;

                    break;
                } else {
                    idx = path[ i ];
                }
            }

            if ( path.length == 0 ) {
                this.data = value;
            } else {
                parent[ idx ] = value;
            }

            this.events.fire(this.EVENTS.CHANGED_DATA, {
                path: A.copyObject(path),
                value: value
            });

            this._setLocalMode(false);
        },
        remove: function(path) {
            path = path || [];

            if ( path.length == 0 ) {
                for ( var idx in this.data ) {
                    delete this.data[ idx ];
                }

                return;
            }

            var parent = this.data;

            for ( var idx = 0; idx < path.length; idx++ ) {
                if ( _hasOwnProperty.call(parent, path[ idx ]) ) {
                    parent.splice(path[ idx ], 1);
                }
            }
        },

        on: function(ename, efunc, ctx, async) {
            this.events.on(ename, efunc, ctx, async);
        },

        off: function(ename, efunc, ctx) {
            this.events.off(ename, efunc, ctx);
        }
    };

    A.inherit(multipledataset, A.getModule("datasetbase"));
    A.extendModule(multipledataset, "dataset.multiple");

})(Camellia);



(function(A) {


    var _UIPROXY_PATTERN = {
        LOAD: "uipp_load",
        BEGINLOAD: "uipp_beginload",
        ENDLOAD: "uipp_endload",
        LOADERROR: "uipp_loaderror",
        RESET: "uipp_reset",
        LOADRANGE: "uipp_loadrange",

        MOVE: "uipp_move",
        UPDATE: "uipp_update",
        SELECT: "uipp_select",
        DELETE: "uipp_delete",
        INSERT: 'uipp_insert',

        UNBIND: 'uipp_unbind'
    }

    function uipp() {

        this._init();
    }

    uipp.prototype = {
        _init: function() {
            this.UIPP = A.copyObject(_UIPROXY_PATTERN);
        },

        destroy: function() {
            this.UIPP = null;
        },

        getUIPP: function() {
            return this.UIPP;
        }
    }


    A.extendModule(uipp);

})(Camellia);


(function(A) {

    "use strict";

    var _array_proto_comp = {

        indexOf: function(searchElement ) {

            var len = this.length,
                n, k,
                fromIndex = ( arguments.length > 1 ) ? arguments[ 1 ] : 0;

            if ( len === 0 ) {
                return -1;
            }

            n = fromIndex;
            if ( n >= len ) {
                return -1;
            }

            if ( n >= 0 ) {
                k = n;
            }
            else {
                k = len - Math.abs(n);
                if ( k < 0 ) {
                    k = 0;
                }
            }

            while ( k < len ) {
                if ( this[ k ] === searchElement ) {
                    return k;
                }
                k++;
            }

            return -1;
        },

        lastIndexOf: function(searchElement ) {

            var len = this.length,
                n, k,
                fromIndex = ( arguments.length > 1 ) ? arguments[ 1 ] : len - 1;

            if ( len === 0 ) {
                return -1;
            }

            n = fromIndex;
            if ( n >= 0 ) {
                k = Math.min(n, len - 1);
            }
            else {
                k = len - Math.abs(n);
            }

            while ( k >= 0 ) {
                if ( this[ k ] === searchElement ) {
                    return k;
                }
                k--;
            }

            return -1;
        }

    };

    A.extendif(Array.prototype, _array_proto_comp, "OE");

})(Camellia);

(function(A) {

    "use strict";


    A.extendif(Date.prototype,
        {

            isLeapYear: function(nYear) {
                var year = ( (arguments.length > 0) ? arguments[ 0 ] : this.getFullYear() );
                return ( (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0)) );
            },

            getLastDay: function(nYear, nMonth) {
                var lday = 0,
                    year = ( (arguments.length === 2) ? arguments[ 0 ] : this.getFullYear() ),
                    month = ( (arguments.length === 2) ? arguments[ 1 ] : this.getMonth() ),
                    bLeapYear = this.isLeapYear(year);

                month += 1;     

                switch ( month ) {
                    case 2:
                        lday = bLeapYear ? 29 : 28;
                        break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        lday = 30;
                        break;
                    default:
                        lday = 31;
                        break;
                }
                return lday;
            },

            isValidDate: function(nYear, nMonth, nDate) {
                var y = ( (arguments.length === 3) ? arguments[ 0 ] : this.getFullYear() ),
                    m = ( (arguments.length === 3) ? arguments[ 1 ] : this.getMonth() ),
                    d = ( (arguments.length === 3) ? arguments[ 2 ] : this.getDate() );

                return !( d < 1 || d > this.getLastDay(y, m) );
            }

        });


})(Camellia);


(function(A) {

    "use strict";

    var bkindexof = String.prototype.indexOf,
        bklastindexof = String.prototype.lastIndexOf;


    A.extendif(String.prototype,
        {

            trimLeft: function() {
                return this.replace(/^\s+/gm, '');
            },

            trimRight: function() {
                return this.replace(/\s+$/gm, '');
            },

            compare: function(compStr) {
                if ( this > compStr ) {
                    return false;
                }
                else if ( this < compStr ) {
                    return false;
                }
                else {
                    return true;
                }
            },

            compareNoCase: function(compStr) {
                var orgStr = this.toLowerCase(),
                    cmpStr = compStr.toLowerCase();

                if ( orgStr > cmpStr ) {
                    return false;
                }
                else if ( orgStr < cmpStr ) {
                    return false;
                }
                else {
                    return true;
                }
            },

            indexOfNoCase: function(searchString, fromIndex) {
                return String.prototype.indexOf.call(this.toLowerCase(), searchString.toLowerCase(), fromIndex);
            },

            lastIndexOfNoCase: function(searchString, fromIndex) {
                return String.prototype.lastIndexOf.call(this.toLowerCase(), searchString.toLowerCase(), fromIndex);
            },

            countMatch: function(searchString) {
                var rex = new RegExp(searchString, "gm"),
                    match = this.match(rex);
                return ((match != null) ? match.length : 0);
            },

            isNumber: function() {
                var match = this.match(/[^0-9]/gm);
                return (match === null);
            },

            isAlpha: function() {
                var match = this.match(/[^a-zA-Z]/gm);
                return (match === null);
            },

            isAlnum: function() {
                var match = this.match(/[^0-9a-zA-Z]/gm);
                return (match === null);
            },

            isAlnumSpace: function() {
                var match = this.match(/[^0-9a-zA-Z\s]/gm);
                return (match === null);
            },

            isUpper: function() {
                var match = this.match(/[^A-Z]/gm);
                return (match === null);
            },

            isLower: function() {
                var match = this.match(/[^a-z]/gm);
                return (match === null);
            },

            byteSize: function() {
                var len = this.length,
                    size = len;

                for ( var cx = 0; cx < len; cx++ ) {
                    if ( this.charCodeAt(cx) > 255 ) {
                        size += 2;
                    }
                }

                return size;
            },

            format: function() {
                var formatted = this;

                for ( var ax = 0, alen = arguments.length; ax < alen; ax++ ) {
                    formatted = formatted.replace('{' + ax + '}', "" + arguments[ ax ]);
                }

                return formatted;
            }

        });

    var _string_proto_comp = {
        trim: function() {
            return this.replace(/^\s+|\s+$/gm, '');
        }
    };

    A.extendif(String.prototype, _string_proto_comp, "OE");


})(Camellia);

(function(A) {


    "use strict";

    if ( A === undefined || A === null ) {
        throw new Error("Camellia is undefined or null");
    }

    var bigjs = createBigJS();            

    A.extendif(bigjs.prototype, {

        greaterThan: function(y) {
            return this.gt(y);
        },

        greaterThanOrEqual: function(y) {
            return this.gte(y);
        },

        lessThan: function(y) {
            return this.lt(y);
        },

        lessThanOrEqual: function(y) {
            return this.lte(y);
        },

        toString: function() {
            return this.val();
        },

        val: function(n) {
            var x = this;

            if ( n !== undefined ) {
                var i, j, nL, max;

                var isValid = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;

                if ( n === 0 && 1 / n < 0 ) {
                    n = '-0';
                } else if ( !isValid.test(n += '') ) {
                    throwErr(NaN);
                }

                x[ 's' ] = ( n.charAt(0) === '-' ) ? ( n = n.slice(1), -1 ) : 1;

                if ( ( i = n.indexOf('.') ) > -1 ) {
                    n = n.replace('.', '');
                }

                if ( ( j = n.search(/e/i) ) > 0 ) {

                    if ( i < 0 ) {
                        i = j;
                    }
                    i += +n.slice(j + 1);
                    n = n.substring(0, j);

                } else if ( i < 0 ) {

                    i = n.length;
                }

                for ( j = 0; n.charAt(j) === '0'; j++ ) {
                }

                if ( j === ( nL = n.length ) ) {

                    x[ 'c' ] = [ x[ 'e' ] = 0 ];
                } else {

                    for ( ; n.charAt(--nL) === '0'; ) {
                    }

                    x[ 'e' ] = i - j - 1;
                    x[ 'c' ] = [];

                    for ( i = 0; j <= nL; x[ 'c' ][ i++ ] = +n.charAt(j++) ) {
                    }
                }
            }

            var arr = A.copyObject(x[ 'c' ]);

            if ( x[ 'e' ] >= 0 ) {
                arr.splice(x[ 'e' ] + 1, 0, '.');

                if ( arr[ arr.length - 1 ] === '.' ) {
                    arr.pop();
                }

                var value = x[ 's' ] === 1 ? arr.join('') : "-" + arr.join('');

                for ( i = 0, max = x[ 'e' ] - value.length + (x[ 's' ] === 1 ? 1 : 2); i < max; i++ ) {
                    value += "0";
                }

                return value;

            } else {
                var numberOfZero = Math.abs(x[ 'e' ]) - 1;

                var val = "0.";
                for ( i = 0; i < numberOfZero; i++ ) {
                    val += "0";
                }

                return x[ 's' ] === 1 ? val + arr.join('') : "-" + val + arr.join('');
            }
        }
    }, "OEMC");

    function big(value) {

        if ( bigjs === undefined ) {
            throw new Error("Couldn't use big.js");
        }

        if ( value === "" || value === undefined || value === null ) {
            value = 0;
        }

        return new bigjs(value);
    }


    function createBigJS() {
        return (function() {





            Big[ 'DP' ] = 20;                                  

            Big[ 'RM' ] = 1;                                   

            var MAX_DP = 1E6,                                

                MAX_POWER = 1E6,                             

                TO_EXP_NEG = -7,                             

                TO_EXP_POS = 21,                             



                P = Big.prototype,
                isValid = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
                ONE = new Big(1);




            function Big(n) {
                var i, j, nL,
                    x = this;

                if ( !(x instanceof Big) ) {
                    return new Big(n);
                }

                if ( n instanceof Big ) {
                    x[ 's' ] = n[ 's' ];
                    x[ 'e' ] = n[ 'e' ];
                    x[ 'c' ] = n[ 'c' ].slice();
                    return;
                }

                if ( n === 0 && 1 / n < 0 ) {
                    n = '-0';
                } else if ( !isValid.test(n += '') ) {
                    throwErr(NaN);
                }

                x[ 's' ] = ( n.charAt(0) === '-' ) ? ( n = n.slice(1), -1 ) : 1;

                if ( ( i = n.indexOf('.') ) > -1 ) {
                    n = n.replace('.', '');
                }

                if ( ( j = n.search(/e/i) ) > 0 ) {

                    if ( i < 0 ) {
                        i = j;
                    }
                    i += +n.slice(j + 1);
                    n = n.substring(0, j);

                } else if ( i < 0 ) {

                    i = n.length;
                }

                for ( j = 0; n.charAt(j) === '0'; j++ ) {
                }

                if ( j === ( nL = n.length ) ) {

                    x[ 'c' ] = [ x[ 'e' ] = 0 ];
                } else {

                    for ( ; n.charAt(--nL) === '0'; ) {
                    }

                    x[ 'e' ] = i - j - 1;
                    x[ 'c' ] = [];

                    for ( i = 0; j <= nL; x[ 'c' ][ i++ ] = +n.charAt(j++) ) {
                    }
                }
            }




            function rnd(x, dp, rm, more) {
                var xc = x[ 'c' ],
                    i = x[ 'e' ] + dp + 1;

                if ( rm === 1 ) {
                    more = xc[ i ] >= 5;
                } else if ( rm === 2 ) {
                    more = xc[ i ] > 5 || xc[ i ] === 5 && ( more || i < 0 || xc[ i + 1 ] !== null || xc[ i - 1 ] & 1 );
                } else if ( rm === 3 ) {
                    more = more || xc[ i ] !== null || i < 0;
                } else if ( more = false, rm !== 0 ) {
                    throwErr('!Big.RM!');
                }

                if ( i < 1 || !xc[ 0 ] ) {
                    x[ 'c' ] = more
                        ? ( x[ 'e' ] = -dp, [ 1 ] )
                        : [ x[ 'e' ] = 0 ];
                } else {

                    xc.length = i--;

                    if ( more ) {

                        for ( ; ++xc[ i ] > 9; ) {
                            xc[ i ] = 0;

                            if ( !i ) {
                                ++x[ 'e' ];
                                xc.unshift(1);
                            }
                            i--;
                        }
                    }

                    for ( i = xc.length; !xc[ --i ]; xc.pop() ) {
                    }
                }

                return x;
            }


            function throwErr(message) {
                var err = new Error(message);
                err[ 'name' ] = 'BigError';

                throw err;
            }




            P[ 'abs' ] = function() {
                var x = new Big(this);
                x[ 's' ] = 1;

                return x;
            };


            P[ 'cmp' ] = function(y) {
                var xNeg,
                    x = this,
                    xc = x[ 'c' ],
                    yc = ( y = new Big(y) )[ 'c' ],
                    i = x[ 's' ],
                    j = y[ 's' ],
                    k = x[ 'e' ],
                    l = y[ 'e' ];

                if ( !xc[ 0 ] || !yc[ 0 ] ) {
                    return !xc[ 0 ] ? !yc[ 0 ] ? 0 : -j : i;
                }

                if ( i !== j ) {
                    return i;
                }
                xNeg = i < 0;

                if ( k !== l ) {
                    return ( k > l ^ xNeg ) ? 1 : -1;
                }

                for ( i = -1,
                          j = ( k = xc.length ) < ( l = yc.length ) ? k : l;
                      ++i < j; ) {

                    if ( xc[ i ] !== yc[ i ] ) {
                        return xc[ i ] > yc[ i ] ^ xNeg ? 1 : -1;
                    }
                }

                return ((k === l ) ? 0 : ( (k > l ^ xNeg) ? 1 : -1) );
            };


            P[ 'div' ] = function(y) {
                var x = this,
                    dvd = x[ 'c' ],
                    dvs = ( y = new Big(y) )[ 'c' ],
                    s = x[ 's' ] === y[ 's' ] ? 1 : -1,
                    dp = Big[ 'DP' ];

                if ( dp !== ~~dp || dp < 0 || dp > MAX_DP ) {
                    throwErr('!Big.DP!');
                }

                if ( !dvd[ 0 ] || !dvs[ 0 ] ) {

                    if ( dvd[ 0 ] === dvs[ 0 ] ) {
                        throwErr(NaN);
                    }

                    if ( !dvs[ 0 ] ) {
                        throwErr(s / 0);
                    }

                    return new Big(s * 0);
                }

                var dvsT, next, cmp, remI,
                    dvsZ = dvs.slice(),
                    dvsL = dvs.length,
                    dvdI = dvs.length,
                    dvdL = dvd.length,
                    rem = dvd.slice(0, dvsL),
                    remL = rem.length,
                    quo = new Big(ONE),
                    qc = quo[ 'c' ] = [],
                    qi = 0,
                    digits = dp + ( quo[ 'e' ] = x[ 'e' ] - y[ 'e' ] ) + 1;

                quo[ 's' ] = s;
                s = digits < 0 ? 0 : digits;

                dvsZ.unshift(0);

                for ( ; remL++ < dvsL; rem.push(0) ) {
                }

                do {

                    for ( next = 0; next < 10; next++ ) {

                        if ( dvsL !== ( remL = rem.length ) ) {
                            cmp = dvsL > remL ? 1 : -1;
                        } else {
                            for ( remI = -1, cmp = 0; ++remI < dvsL; ) {

                                if ( dvs[ remI ] !== rem[ remI ] ) {
                                    cmp = dvs[ remI ] > rem[ remI ] ? 1 : -1;
                                    break;
                                }
                            }
                        }

                        if ( cmp < 0 ) {

                            for ( dvsT = remL === dvsL ? dvs : dvsZ; remL; ) {

                                if ( rem[ --remL ] < dvsT[ remL ] ) {

                                    for ( remI = remL;
                                          remI && !rem[ --remI ];
                                          rem[ remI ] = 9 ) {
                                    }
                                    --rem[ remI ];
                                    rem[ remL ] += 10;
                                }
                                rem[ remL ] -= dvsT[ remL ];
                            }
                            for ( ; !rem[ 0 ]; rem.shift() ) {
                            }
                        } else {
                            break;
                        }
                    }

                    qc[ qi++ ] = cmp ? next : ++next;

                    rem[ 0 ] && cmp
                        ? ( rem[ remL ] = dvd[ dvdI ] || 0 )
                        : ( rem = [ dvd[ dvdI ] ] );

                } while ( ( dvdI++ < dvdL || rem[ 0 ] != null ) && s-- );

                if ( !qc[ 0 ] && qi !== 1 ) {

                    qc.shift();
                    quo[ 'e' ]--;
                }

                if ( qi > digits ) {
                    rnd(quo, dp, Big[ 'RM' ], rem[ 0 ] != null);
                }

                return quo;
            };


            P[ 'eq' ] = function(y) {
                return !this.cmp(y);
            };


            P[ 'gt' ] = function(y) {
                return this.cmp(y) > 0;
            };


            P[ 'gte' ] = function(y) {
                return this.cmp(y) > -1;
            };


            P[ 'lt' ] = function(y) {
                return this.cmp(y) < 0;
            };


            P[ 'lte' ] = function(y) {
                return this.cmp(y) < 1;
            };


            P[ 'minus' ] = function(y) {
                var d, i, j, xLTy,
                    x = this,
                    a = x[ 's' ],
                    b = ( y = new Big(y) )[ 's' ];

                if ( a !== b ) {
                    return y[ 's' ] = -b, x[ 'plus' ](y);
                }

                var xc = x[ 'c' ].slice(),
                    xe = x[ 'e' ],
                    yc = y[ 'c' ],
                    ye = y[ 'e' ];

                if ( !xc[ 0 ] || !yc[ 0 ] ) {

                    return yc[ 0 ]
                        ? ( y[ 's' ] = -b, y )
                        : new Big(xc[ 0 ]
                        ? x
                        : 0);
                }

                if ( (a = xe - ye) ) {
                    d = ( xLTy = a < 0 ) ? ( a = -a, xc ) : ( ye = xe, yc );

                    for ( d.reverse(), b = a; b--; d.push(0) ) {
                    }
                    d.reverse();
                } else {

                    j = ( ( xLTy = xc.length < yc.length ) ? xc : yc ).length;

                    for ( a = b = 0; b < j; b++ ) {

                        if ( xc[ b ] !== yc[ b ] ) {
                            xLTy = xc[ b ] < yc[ b ];
                            break;
                        }
                    }
                }

                if ( xLTy ) {
                    d = xc, xc = yc, yc = d;
                    y[ 's' ] = -y[ 's' ];
                }

                if ( ( b = -( ( j = xc.length ) - yc.length ) ) > 0 ) {

                    for ( ; b--; xc[ j++ ] = 0 ) {
                    }
                }

                for ( b = yc.length; b > a; ) {

                    if ( xc[ --b ] < yc[ b ] ) {

                        for ( i = b; i && !xc[ --i ]; xc[ i ] = 9 ) {
                        }
                        --xc[ i ];
                        xc[ b ] += 10;
                    }
                    xc[ b ] -= yc[ b ];
                }

                for ( ; xc[ --j ] === 0; xc.pop() ) {
                }

                for ( ; xc[ 0 ] === 0; xc.shift(), --ye ) {
                }

                if ( !xc[ 0 ] ) {

                    y[ 's' ] = 1;

                    xc = [ ye = 0 ];
                }

                return y[ 'c' ] = xc, y[ 'e' ] = ye, y;
            };


            P[ 'mod' ] = function(y) {
                y = new Big(y);
                var c,
                    x = this,
                    i = x[ 's' ],
                    j = y[ 's' ];

                if ( !y[ 'c' ][ 0 ] ) {
                    throwErr(NaN);
                }

                x[ 's' ] = y[ 's' ] = 1;
                c = y.cmp(x) === 1;
                x[ 's' ] = i, y[ 's' ] = j;

                return c
                    ? new Big(x)
                    : ( i = Big[ 'DP' ], j = Big[ 'RM' ],
                    Big[ 'DP' ] = Big[ 'RM' ] = 0,
                    x = x[ 'div' ](y),
                    Big[ 'DP' ] = i, Big[ 'RM' ] = j,
                    this[ 'minus' ](x[ 'times' ](y)) );
            };


            P[ 'plus' ] = function(y) {
                var d,
                    x = this,
                    a = x[ 's' ],
                    b = ( y = new Big(y) )[ 's' ];

                if ( a !== b ) {
                    return y[ 's' ] = -b, x[ 'minus' ](y);
                }

                var xe = x[ 'e' ],
                    xc = x[ 'c' ],
                    ye = y[ 'e' ],
                    yc = y[ 'c' ];

                if ( !xc[ 0 ] || !yc[ 0 ] ) {

                    return yc[ 0 ]
                        ? y
                        : new Big(xc[ 0 ]

                        ? x

                        : a * 0);
                }

                if ( (xc = xc.slice(), a = xe - ye) ) {
                    d = a > 0 ? ( ye = xe, yc ) : ( a = -a, xc );

                    for ( d.reverse(); a--; d.push(0) ) {
                    }
                    d.reverse();
                }

                if ( xc.length - yc.length < 0 ) {
                    d = yc, yc = xc, xc = d;
                }

                for ( a = yc.length, b = 0; a;
                      b = ( xc[ --a ] = xc[ a ] + yc[ a ] + b ) / 10 ^ 0, xc[ a ] %= 10 ) {
                }


                if ( b ) {
                    xc.unshift(b);
                    ++ye;
                }

                for ( a = xc.length; xc[ --a ] === 0; xc.pop() ) {
                }

                return y[ 'c' ] = xc, y[ 'e' ] = ye, y;
            };


            P[ 'pow' ] = function(e) {
                var isNeg = e < 0,
                    x = new Big(this),
                    y = ONE;

                if ( e !== ~~e || e < -MAX_POWER || e > MAX_POWER ) {
                    throwErr('!pow!');
                }

                for ( e = isNeg ? -e : e; ; ) {

                    if ( e & 1 ) {
                        y = y[ 'times' ](x);
                    }
                    e >>= 1;

                    if ( !e ) {
                        break;
                    }
                    x = x[ 'times' ](x);
                }

                return isNeg ? ONE[ 'div' ](y) : y;
            };


            P[ 'round' ] = function(dp, rm) {
                var x = new Big(this);

                if ( dp == null ) {
                    dp = 0;
                } else if ( dp !== ~~dp || dp < 0 || dp > MAX_DP ) {
                    throwErr('!round!');
                }
                rnd(x, dp, rm == null ? Big[ 'RM' ] : rm);

                return x;
            };


            P[ 'sqrt' ] = function() {
                var estimate, r, approx,
                    x = this,
                    xc = x[ 'c' ],
                    i = x[ 's' ],
                    e = x[ 'e' ],
                    half = new Big('0.5');

                if ( !xc[ 0 ] ) {
                    return new Big(x);
                }

                if ( i < 0 ) {
                    throwErr(NaN);
                }

                i = Math.sqrt(x.toString());

                if ( i === 0 || i === 1 / 0 ) {
                    estimate = xc.join('');

                    if ( !( estimate.length + e & 1 ) ) {
                        estimate += '0';
                    }

                    r = new Big(Math.sqrt(estimate).toString());
                    r[ 'e' ] = ( ( ( e + 1 ) / 2 ) | 0 ) - ( e < 0 || e & 1 );
                } else {
                    r = new Big(i.toString());
                }

                i = r[ 'e' ] + ( Big[ 'DP' ] += 4 );

                do {
                    approx = r;
                    r = half[ 'times' ](approx[ 'plus' ](x[ 'div' ](approx)));
                } while ( approx[ 'c' ].slice(0, i).join('') !==
                r[ 'c' ].slice(0, i).join('') );

                rnd(r, Big[ 'DP' ] -= 4, Big[ 'RM' ]);

                return r;
            };


            P[ 'times' ] = function(y) {
                var c,
                    x = this,
                    xc = x[ 'c' ],
                    yc = ( y = new Big(y) )[ 'c' ],
                    a = xc.length,
                    b = yc.length,
                    i = x[ 'e' ],
                    j = y[ 'e' ];

                y[ 's' ] = x[ 's' ] === y[ 's' ] ? 1 : -1;

                if ( !xc[ 0 ] || !yc[ 0 ] ) {

                    return new Big(y[ 's' ] * 0);
                }

                y[ 'e' ] = i + j;

                if ( a < b ) {
                    c = xc, xc = yc, yc = c, j = a, a = b, b = j;
                }

                for ( j = a + b, c = []; j--; c.push(0) ) {
                }

                for ( i = b - 1; i > -1; i-- ) {

                    for ( b = 0, j = a + i;
                          j > i;
                          b = c[ j ] + yc[ i ] * xc[ j - i - 1 ] + b,
                              c[ j-- ] = b % 10 | 0,
                              b = b / 10 | 0 ) {
                    }

                    if ( b ) {
                        c[ j ] = ( c[ j ] + b ) % 10;
                    }
                }

                b && ++y[ 'e' ];

                !c[ 0 ] && c.shift();

                for ( j = c.length; !c[ --j ]; c.pop() ) {
                }

                return y[ 'c' ] = c, y;
            };


            P[ 'toString' ] = P[ 'valueOf' ] = P[ 'toJSON' ] = function() {
                var x = this,
                    e = x[ 'e' ],
                    str = x[ 'c' ].join(''),
                    strL = str.length;

                if ( e <= TO_EXP_NEG || e >= TO_EXP_POS ) {
                    str = str.charAt(0) + ( strL > 1 ? '.' + str.slice(1) : '' ) +
                        ( e < 0 ? 'e' : 'e+' ) + e;

                } else if ( e < 0 ) {

                    for ( ; ++e; str = '0' + str ) {
                    }
                    str = '0.' + str;

                } else if ( e > 0 ) {

                    if ( ++e > strL ) {

                        for ( e -= strL; e--; str += '0' ) {
                        }
                    } else if ( e < strL ) {
                        str = str.slice(0, e) + '.' + str.slice(e);
                    }

                } else if ( strL > 1 ) {
                    str = str.charAt(0) + '.' + str.slice(1);
                }

                return x[ 's' ] < 0 && x[ 'c' ][ 0 ] ? '-' + str : str;
            };




            function format(x, dp, toE) {
                var i = dp - ( x = new Big(x) )[ 'e' ],
                    c = x[ 'c' ];

                if ( c.length > ++dp ) {
                    rnd(x, i, Big[ 'RM' ]);
                }

                i = !c[ 0 ] ? i + 1 : toE ? dp : ( c = x[ 'c' ], x[ 'e' ] + i + 1 );

                for ( ; c.length < i; c.push(0) ) {
                }
                i = x[ 'e' ];

                return toE === 1 || toE === 2 && ( dp <= i || i <= TO_EXP_NEG )

                    ? ( x[ 's' ] < 0 && c[ 0 ] ? '-' : '' ) + ( c.length > 1
                    ? ( c.splice(1, 0, '.'), c.join('') )
                    : c[ 0 ] ) + ( i < 0 ? 'e' : 'e+' ) + i

                    : x.toString();
            }


            P[ 'toExponential' ] = function(dp) {

                if ( dp == null ) {
                    dp = this[ 'c' ].length - 1;
                } else if ( dp !== ~~dp || dp < 0 || dp > MAX_DP ) {
                    throwErr('!toExp!');
                }

                return format(this, dp, 1);
            };


            P[ 'toFixed' ] = function(dp) {
                var str,
                    x = this,
                    neg = TO_EXP_NEG,
                    pos = TO_EXP_POS;

                TO_EXP_NEG = -( TO_EXP_POS = 1 / 0 );

                if ( dp == null ) {
                    str = x.toString();
                } else if ( dp === ~~dp && dp >= 0 && dp <= MAX_DP ) {
                    str = format(x, x[ 'e' ] + dp);

                    if ( x[ 's' ] < 0 && x[ 'c' ][ 0 ] && str.indexOf('-') < 0 ) {
                        str = '-' + str;
                    }
                }
                TO_EXP_NEG = neg, TO_EXP_POS = pos;

                if ( !str ) {
                    throwErr('!toFix!');
                }

                return str;
            };


            P[ 'toPrecision' ] = function(sd) {

                if ( sd == null ) {
                    return this.toString();
                } else if ( sd !== ~~sd || sd < 1 || sd > MAX_DP ) {
                    throwErr('!toPre!');
                }

                return format(this, sd - 1, 2);
            };




            if ( typeof module !== 'undefined' && module.exports ) {
                module.exports = Big;

            } else if ( typeof define === 'function' && define.amd ) {
                return Big;

            } else {
                return Big;
            }
        })();
    }

    A.extendModule(big);

})(Camellia);





(function(A) {

    "use strict";


    var __booleantypes = [
        [ false, true ],
        [ "FALSE", "TRUE" ],
        [ 0, 1 ],
        [ "0", "1" ],
        [ "NO", "YES" ],
        [ "N", "Y" ]
    ];

    function _findBooleanSet(val) {
        var bs = null; 

        if ( A.isString(val) ) {
            val = val.trim();
            val = val.toUpperCase();
        }

        for ( var bx = 0, blen = __booleantypes.length; bx < blen; bx++ ) {
            if ( __booleantypes[ bx ][ 0 ] === val ||
                __booleantypes[ bx ][ 1 ] === val ) {
                bs = __booleantypes[ bx ];
                break;
            }
        }

        return bs;
    }

    function _findBooleanSet2(boolset) {
        var bs = null;

        if ( !A.isArray(boolset) || boolset.length !== 2 ) {
            return bs;
        }

        for ( var bx = 0, blen = __booleantypes.length; bx < blen; bx++ ) {
            if ( __booleantypes[ bx ][ 0 ] === boolset[ 0 ] &&
                __booleantypes[ bx ][ 1 ] === boolset[ 1 ] ) {
                bs = __booleantypes[ bx ];
                break;
            }
        }

        return bs;
    }

    function _checkBooleanPair(boolset, val) {
        if ( boolset == null || val == null ) {
            return null;
        }

        if ( A.isString(val) ) {
            val = val.trim();
            val = val.toUpperCase();
        }

        if ( boolset[ 0 ] === val || boolset[ 1 ] === val ) {
            return true;
        }
        else {
            return false;
        }
    }

    function _getValueBooleanPair(boolset, val) {
        if ( boolset == null || val == null ) {
            return null;
        }

        var refV = boolset[ 1 ];

        if ( A.isString(refV) ) {
            refV = refV.trim();
            refV = refV.toUpperCase();
        }

        if ( A.isString(val) ) {
            val = val.trim();
            val = val.toUpperCase();
        }

        return (refV === val);
    }

    function exboolean() {
        if ( !(this instanceof exboolean) ) {
            return new exboolean();
        }
    }

    exboolean.prototype = {
        construct: function(initval, boolset) {
            var tbs, ck;


            this._bvalue = false;                                                   
            this._booleanset = null;

            if ( A.isArray(boolset) && boolset.length === 2 ) {

                this.setbooleanset(boolset);
            }
            else {
                this._booleanset = _findBooleanSet(initval) || __booleantypes[ 0 ];        
            }

            switch ( initval ) {
                case undefined:
                    this.setboolean(false);
                    break;
                case null:
                    this._bvalue = null;
                    break;
                default:
                    this._bvalue = _getValueBooleanPair(this._booleanset, initval);
                    break;
            }
        },

        val: function(newval) {
            if ( arguments.length > 0 ) {
                if ( !_checkBooleanPair(this._booleanset, newval) ) {
                    this._booleanset = _findBooleanSet(newval) || __booleantypes[ 0 ];        
                }
                this._bvalue = _getValueBooleanPair(this._booleanset, newval);
            }

            if ( this._bvalue === null ) {
                return null;
            }
            else {
                return (this._bvalue === true) ? this._booleanset[ 1 ] : this._booleanset[ 0 ];
            }
        },

        getboolean: function() {
            return this._bvalue;
        },

        setboolean: function(bval) {
            A.assert(( A.isBoolean(bval) || (bval == null) ), "invalid parameter type, only boolean or null value");      
            this._bvalue = bval;

            return this.val();
        },

        getbooleanset: function() {
            return A.copyObject(this._booleanset);
        },

        setbooleanset: function(boolset) {
            var tbs;

            if ( !A.isArray(boolset) || boolset.length !== 2 ) {
                return false;
            }

            if ( A.isString(boolset[ 0 ]) ) {
                boolset[ 0 ] = boolset[ 0 ].toUpperCase();
            }

            if ( A.isString(boolset[ 1 ]) ) {
                boolset[ 1 ] = boolset[ 1 ].toUpperCase();
            }

            tbs = _findBooleanSet2(boolset);
            if ( !tbs ) {
                __booleantypes.push(boolset);
            }
            this._booleanset = tbs || boolset;

            return true;
        }

    };

    A.extendModule(exboolean);

})(Camellia);



(function(A) {

    var
        _language = "ko",
        _data = {},
        _LANGUAGE_PACK = {
            af: "Afrikaans",
            ak: "Akan",
            sq: "Albanian",
            am: "Amharic",
            ar: "Arabic",
            hy: "Armenian",
            as: "Assamese",
            asa: "Asu",
            az: "Azerbaijani",
            bm: "Bambara",
            eu: "Basque",
            be: "Belarusian",
            bem: "Bemba",
            bez: "Bena",
            bn: "Bengali",
            bs: "Bosnian",
            bg: "Bulgarian",
            my: "Burmese",
            ca: "Catalan",
            tzm: "Central Morocco Tamazight",
            chr: "Cherokee",
            cgg: "Chiga",
            zh: "Chinese",
            kw: "Cornish",
            hr: "Croatian",
            cs: "Czech",
            da: "Danish",
            nl: "Dutch",
            ebu: "Embu",
            en: "English",
            eo: "Esperanto",
            et: "Estonian",
            ee: "Ewe",
            fo: "Faroese",
            fil: "Filipino",
            fi: "Finnish",
            fr: "French",
            ff: "Fulah",
            gl: "Galician",
            lg: "Ganda",
            ka: "Georgian",
            de: "German",
            el: "Greek",
            gu: "Gujarati",
            guz: "Gusii",
            ha: "Hausa",
            haw: "Hawaiian",
            he: "Hebrew",
            hi: "Hindi",
            hu: "Hungarian",
            is: "Icelandic",
            ig: "Igbo",
            id: "Indonesian",
            ga: "Irish",
            it: "Italian",
            ja: "Japanese",
            kea: "Kabuverdianu",
            kab: "Kabyle",
            kl: "Kalaallisut",
            kln: "Kalenjin",
            kam: "Kamba",
            kn: "Kannada",
            kk: "Kazakh",
            km: "Khmer",
            ki: "Kikuyu",
            rw: "Kinyarwanda",
            kok: "Konkani",
            ko: "Korean",
            khq: "Koyra Chiini",
            ses: "Koyraboro Senni",
            lag: "Langi",
            lv: "Latvian",
            lt: "Lithuanian",
            luo: "Luo",
            luy: "Luyia",
            mk: "Macedonian",
            jmc: "Machame",
            kde: "Makonde",
            mg: "Malagasy",
            ms: "Malay",
            ml: "Malayalam",
            mt: "Maltese",
            gv: "Manx",
            mr: "Marathi",
            mas: "Masai",
            mer: "Meru",
            mfe: "Morisyen",
            naq: "Nama",
            ne: "Nepali",
            nd: "North Ndebele",
            nb: "Norwegian Bokmål",
            nn: "Norwegian Nynorsk",
            nyn: "Nyankole",
            or: "Oriya",
            om: "Oromo",
            ps: "Pashto",
            fa: "Persian",
            pl: "Polish",
            pt: "Portuguese",
            pa: "Punjabi",
            ro: "Romanian",
            rm: "Romansh",
            rof: "Rombo",
            ru: "Russian",
            rwk: "Rwa",
            saq: "Samburu",
            sg: "Sango",
            seh: "Sena",
            sr: "Serbian",
            sn: "Shona",
            ii: "Sichuan Yi",
            si: "Sinhala",
            sk: "Slovak",
            sl: "Slovenian",
            xog: "Soga",
            so: "Somali",
            es: "Spanish",
            sw: "Swahili",
            sv: "Swedish",
            gsw: "Swiss German",
            shi: "Tachelhit",
            dav: "Taita",
            ta: "Tamil",
            te: "Telugu",
            teo: "Teso",
            th: "Thai",
            bo: "Tibetan",
            ti: "Tigrinya",
            to: "Tonga",
            tr: "Turkish",
            uk: "Ukrainian",
            ur: "Urdu",
            uz: "Uzbek",
            vi: "Vietnamese",
            vun: "Vunjo",
            cy: "Welsh",
            yo: "Yoruba",
            zu: "Zulu"
        };


    function i18n() {
        this.url = "";
        this.localmode = false;
        this.plaindata = false;
        this.overwrite = false;
        this.async = true;
    }

    i18n.prototype =
    {
        construct: function(options) {
            A.extendif(this, options, 'OMC');

            if ( options.data ) {
                this.setData(options.data);
            }

            var userlang = options.language ? options.language : this._getBrowserLanguage();
            this.setLanguage(userlang);

            this.bind(this.url, null, null);
        },

        t: function(key, args) {
            return this.translate.call(this, key, args);
        },

        translate: function(key, args) {
            var msg = "",
                keyarr = [],
                data = this.getData(this.getLanguage());

            if ( this.plaindata ) {
                if ( A.hasOwnProp(data, key) ) {
                    msg = data[ key ];
                }
            }
            else {
                keyarr = key.split('.');
                msg = this._getMsg(data, keyarr);
            }

            if ( A.isArray(args) ) {
                msg = this._replaceTemplate(msg, args);
            }

            return msg;
        },

        setLanguage: function(lang) {
            if ( !this._isLanguage(lang) ) {
                throw new Error("unsupported language");
            }

            _language = this._makeLangKey(lang);
        },

        getLanguage: function() {
            return _language;
        },

        bind: function(url, lang, callbackError) {
            var that = this;

            if ( A.isString(lang) ) {
                if ( !this._isLanguage(lang) ) {
                    throw new Error("unsupported language");
                }
            }

            if ( A.isString(url) && !this._isEmptyString(url) ) {
                A.$.ajax({
                    dataType: "json",
                    type: "POST",
                    url: url,
                    async: this.async,
                    success: function(data) {
                        that._dataLoad(data, lang);
                        that._domi18n();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        if ( callbackError && A.isFunction(callbackError) ) {
                            callbackError(jqXHR, textStatus, errorThrown);
                        }
                    }
                });
            }
            else {
                this._domi18n();
            }
        },


        setData: function(data) {
            if ( !A.isPlainObject(data) ) {
                return;
            }

            this._dataLoad(data);
        },

        getData: function(lang) {
            if ( A.isString(lang) ) {
                return _data[ lang ];
            }
        },

        exist: function(key) {
            return this.translate(key, null) ? true : false;
        },

        _replaceTemplate: function(msg, args) {
            var result = msg,
                pattern = /{\d.*}/g;

            if ( !pattern.test(result) ) {
                return result;
            }

            for ( var i = 0; i < args.length; i++ ) {
                result = result.replace('{' + i + '}', "" + args[ i ]);
            }

            return result;
        },

        _dataLoad: function(data, lang) {
            var ceilingProperties = A.extractKeys(data),
                attrname,
                langProperties = this._findLangkeys(ceilingProperties);

            if ( A.isArray(langProperties) && langProperties.length > 0 ) {
                for ( var i = 0, max = langProperties.length; i < max; i++ ) {
                    var langKey = langProperties[ i ];

                    for ( attrname in data[ langKey ] ) {
                        this._setData(langKey, attrname, data[ langKey ][ attrname ]);
                    }
                }
            }
            else {
                lang = lang || this.getLanguage();

                for ( attrname in data ) {
                    this._setData(lang, attrname, data[ attrname ]);
                }
            }
        },

        _findLangkeys: function(ceilingProperties) {
            var langProperties = [];

            for ( var key = 0, max = ceilingProperties.length; key < max; key++ ) {
                var keyprop = ceilingProperties[ key ];

                if ( this._isLanguage(keyprop) ) {
                    langProperties.push(keyprop);
                }
            }

            return langProperties;
        },

        _setData: function(lang, attrname, value) {
            var smallcaseLang = this._makeLangKey(lang);

            _data[ smallcaseLang ] = _data[ smallcaseLang ] || {};

            _data[ smallcaseLang ][ attrname ] = _data[ smallcaseLang ][ attrname ] || value;
        },

        _domi18n: function() {
            var translatedStr = "",
                nodeList = A.querySelectorAll('[data-i18n]');

            for ( var i = 0, max = nodeList.length; i < max; i++ ) {
                var node = nodeList[ i ];

                translatedStr = this.translate(node.getAttribute("data-i18n"), null);

                if ( this.overwrite ) {
                    if ( !this._isEmptyString(translatedStr) ) {
                        node.innerText = translatedStr;
                    }
                }
                else {
                    if ( this._isEmptyString(node.innerText.trim()) ) {
                        node.innerText = translatedStr;
                    }
                }
            }
        },

        _getMsg: function(obj, arr) {
            var key = arr.splice(0, 1);

            if ( !A.isPlainObject(obj) || !A.hasOwnProp(obj, key) ) {
                return "";
            }

            if ( arr.length > 0 ) {
                return this._getMsg(obj[ key ], arr);
            }

            return A.isString(obj[ key ]) ? obj[ key ] : "";
        },

        _getBrowserLanguage: function() {
            var lang = A.language;

            return this._makeLangKey(lang);
        },

        _makeLangKey: function(lang) {
            var retLang = lang.toLowerCase();

            if ( retLang.indexOf('-') > 0 ) {
                retLang = retLang.substring(0, retLang.indexOf('-'));
            }

            return retLang;
        },

        _isLanguage: function(lang) {
            if ( !A.isString(lang) ) {
                return false;
            }

            var retLang = this._makeLangKey(lang);

            if ( _LANGUAGE_PACK[ retLang ] === undefined ) {
                return false;
            }

            return true;
        },

        _isEmptyString: function(str) {
            if ( str === "" ) {
                return true;
            } else {
                return false;
            }
        }


    };

    A.extendModule(i18n);

})(Camellia);

(function(A) {


    "use strict";

    if ( A === undefined || A === null ) {
        throw new Error("Camellia is undefined or null");
    }

    var storejs = createStoreJS();     

    function localStorage(options) {
        if ( !storejs.enabled ) {
            throw new Error("Current version of a browser dose not support Web Storage.");
        }
    }

    localStorage.prototype = {
        get: function(key) {
            return storejs.get(key);
        },

        getAll: function() {
            return storejs.getAll();
        },

        set: function(key, value) {
            storejs.set(key, value);
        },

        remove: function(key) {
            storejs.remove(key);
        },

        clear: function() {
            storejs.clear();
        }
    };

    function createStoreJS() {

        return (function() {
            var store = {},
                win = window,
                localStorageName = 'localStorage',
                scriptTag = 'script',
                storage;

            store.disabled = false;
            store.set = function(key, value) {
            };
            store.get = function(key) {
            };
            store.remove = function(key) {
            };
            store.clear = function() {
            };
            store.transact = function(key, defaultVal, transactionFn) {
                var val = store.get(key);
                if ( transactionFn == null ) {
                    transactionFn = defaultVal;
                    defaultVal = null;
                }
                if ( typeof val === 'undefined' ) {
                    val = defaultVal || {};
                }
                transactionFn(val);
                store.set(key, val);
            };
            store.getAll = function() {
            };
            store.forEach = function() {
            };

            store.serialize = function(value) {
                return JSON.stringify(value);
            };
            store.deserialize = function(value) {
                if ( typeof value !== 'string' ) {
                    return undefined;
                }
                try {
                    return JSON.parse(value);
                }
                catch ( e ) {
                    return value || undefined;
                }
            };

            function isLocalStorageNameSupported() {
                try {
                    return (localStorageName in win && win[ localStorageName ]);
                }
                catch ( err ) {
                    return false;
                }
            }

            try {
                A.assert(isLocalStorageNameSupported(), '[LocalStorageWrapper#storejs] Current version of a browser dose not support Web Storage.');

                storage = win[ localStorageName ];
                store.set = function(key, val) {
                    if ( val === undefined ) {
                        return store.remove(key);
                    }
                    storage.setItem(key, store.serialize(val));
                    return val;
                };
                store.get = function(key) {
                    return store.deserialize(storage.getItem(key));
                };
                store.remove = function(key) {
                    storage.removeItem(key);
                };
                store.clear = function() {
                    storage.clear();
                };
                store.getAll = function() {
                    var ret = {};
                    store.forEach(function(key, val) {
                        ret[ key ] = val;
                    });
                    return ret;
                };
                store.forEach = function(callback) {
                    var key;
                    for ( var i = 0; i < storage.length; i++ ) {
                        key = storage.key(i);
                        callback(key, store.get(key));
                    }
                };

                var testKey = '__storejs__';
                store.set(testKey, testKey);
                if ( store.get(testKey) !== testKey ) {
                    store.disabled = true;
                }
                store.remove(testKey);

            } catch ( e ) {
                store.disabled = true;
            }

            store.enabled = !store.disabled;

            return store;

        })();
    }

    A.extendModule(localStorage);

})(Camellia);






(function(A) {

    "use strict";

    if ( A === undefined || A === null ) {
        throw new Error("Camellia is undefined or null");
    }

    function modulefactory() {

        var _module_map = {},            
            _validators = {};            

        function _module(name, def, ctx) {

            var _foundvd = null;

            this._name = name || null;
            this._def = def || null;
            this._context = {};     


            if ( ctx ) {
                A.extendif(this._context, ctx);
                this.verifyContext();
            }
        }

        Object.defineProperties(_module.prototype, {
            "name": {
                get: function() {
                    return this._name;
                }
            }
            , "def": {
                get: function() {
                    return this._def;
                }
            }
        });
        _module.prototype.getContext = function(key_) {
            var _key = (key_ == undefined || key_ == null ? key_ : "" + key_)
                , _value = (_key ? this._context[ key_ ] : this._context);

            return A.copyObject(_value);
        };

        _module.prototype.setContext = function(key, value) {
            var _key = (key == undefined || key == null ? key : "" + key)
                ;
            this._context[ _key ] = value;

            this.verifyContext();
        };

        _module.prototype.verifyContext = function(ctx_) {
            var _foundVd = this.hasValidator();

            if ( _foundVd ) {
                _foundVd.call(_validators, ctx_ || this.getContext());
            }
        };

        _module.prototype.hasValidator = function() {
            return this._context.type ? _validators[ this._context.type ] : undefined;
        };



        modulefactory.prototype.addModule = function(name, def, ctx) {
            var _target = this.findModule(name);

            A.assertNot(_target, "module [{0}] already exists. so it can't add this module".format(name));
            A.assert(name && def, "name or module definition not exist.");
            A.assert(A.isFunction(def) && def.prototype.construct, "a module must implement the construct interface");

            _module_map[ name ] = new _module(name, def, ctx);
        };

        modulefactory.prototype.removeModule = function(name) {
            var _target = this.findModule(name);

            A.assert(_target, "module [{0}] not exists. so it can't remove this module.".format(name));

            _module_map[ name ] = null;
            _target = null;
            delete _module_map[ name ];
        };

        modulefactory.prototype.removeAllModules = function() {
            for ( var _modname in _module_map ) {
                this.removeModule(_modname);
            }
        };

        modulefactory.prototype.findModule = function(name) {
            return (_module_map[ name ] || null);
        };


        modulefactory.prototype.getValidator = function(type) {
            return (_validators[ type ]);
        };

        modulefactory.prototype.setValidator = function(type, validator) {
            A.assert(A.isFunction(validator), "validator type must be function");
            _validators[ type ] = validator;
            return true;
        };

        modulefactory.prototype.filterWithContextCondition = function(condition) {
            var _mod,
                _modCtx,
                _filteredMod = [];

            A.assert(A.isFunction(condition), "invalid argument type. it needs function type argument");

            for ( var mapk in _module_map ) {
                _mod = _module_map[ mapk ];
                _modCtx = _mod.getContext();

                if ( !_modCtx.type ) {
                    continue;
                }

                if ( condition.call(_modCtx, _modCtx) ) {
                    _filteredMod.push(_mod);
                }
            }

            return _filteredMod;
        };

        modulefactory.prototype._clear = function() {
            this.removeAllModules();
            A.clearObject(_validators);
        };


        modulefactory.prototype._getModuleMap = function() {
            return _module_map;
        };
    }

    modulefactory.prototype.construct = function() {

    };

    modulefactory.prototype.destroy = function() {
        this._clear();
    };

    modulefactory.prototype.createModule = function(name, options) {
        var _mod = this.findModule(name),
            _modcontext = _mod ? _mod.getContext() : _mod,
            _moddef = _mod ? _mod.def : _mod,
            _newinst,
            _args;

        A.assert(_mod, "the module [{0}] was not found in moduleFactory".format(name));

        _args = Array.prototype.slice.call(arguments);
        _args.shift();

        _newinst = new (_moddef)(options, _modcontext);		
        _moddef.prototype.construct.apply(_newinst, _args);

        return _newinst;
    };


    modulefactory.prototype.get = function(name) {
        var _foundMod = this.findModule(name);
        return (_foundMod ? _foundMod.def : null);
    };

    modulefactory.prototype.set = function(name, def, ctx_) {
        this.addModule(name, def, ctx_);
    };

    modulefactory.prototype.unset = function(name) {
        this.removeModule(name);
    };

    modulefactory.prototype.register = function(name, def, ctx_) {
        this.set(name, def, ctx_);
    };

    modulefactory.prototype.registerByExtend = function(name, def, parent, ctx_) {
        A.inherit(def, parent);
        this.set(name, def, ctx_);
    };

    modulefactory.prototype.unregister = function(name) {
        this.unset(name);
    };

    modulefactory.prototype.isExist = function(name) {
        return (this.findModule(name) != null);
    };

    modulefactory.prototype.clear = function() {
        this.removeAllModules();
    };

    modulefactory.prototype.updateModuleContext = function(name, key_, value_) {
        var _foundMod = this.findModule(name);

        if ( !_foundMod || key_ === undefined ) {
            return false;
        }

        _foundMod.setContext(key_, value_);		

        return true;
    };

    modulefactory.prototype.getModuleContext = function(name, key_) {
        var _foundMod = this.findModule(name);
        if ( !_foundMod ) {
            return null;
        }

        return _foundMod.getContext(key_);
    };

    modulefactory.prototype.updateValidator = function(type, validator) {
        return this.setValidator(type, validator);
    };







    A.extendModule(modulefactory);

})(Camellia);


;(function(_A) {

    var A = _A,
        $ = _A.$,
        runAttrs = A.runAttributes,

        core = {
            'defineNamespace': defineNamespace,
            'createModuleLike': _createModuleLike,
            "moduleFactory": A.createModule('modulefactory'),

            '_userconfig_': null,   

            'DDA_BIND':             ( !runAttrs.uselegacydatakey ? 'data-camellia-bind' : 'data-aui-bind' ),
            'DDA_VIEW':             ( !runAttrs.uselegacydatakey ? 'data-camellia-view' : 'data-aui-view' ),
            'DDA_VIEW_INST_ID':    ( !runAttrs.uselegacydatakey ? 'data-camellia-view-instance-id' : 'data-aui-view-instance-id' ),
            'DDA_POPUP_ID':         ( !runAttrs.uselegacydatakey ? 'data-camellia-popup-id' : 'data-aui-popup-id' ),
            'DDA_CALLER_VIEW':     ( !runAttrs.uselegacydatakey ? 'data-camellia-caller-view' : 'data-aui-caller-view' ),
            'DDA_MODEL':            ( !runAttrs.uselegacydatakey ? 'data-camellia-model' : 'data-aui-model' ),

            'util': null,
            'executeFramework': executeFramework
        },

        nodef = function() {
        },
        nodefneedderive = function() {
            A.debug("must implement this function");
        };

    A.moduleFactory = core.moduleFactory;
    A.core = core;




    function defineNamespace(name, anyType, parentNS) {
        var _parentNS = parentNS || core,
            _newNS = name, _newValue = anyType;

        A.assert(A.isString(name), "invalid argument - 2th, registerFrameworkInstance. must be string.");
        A.assertNot(_parentNS[ _newNS ], "already exist namespace[{0}]".format(_newNS));

        _parentNS[ _newNS ] = _newValue;
    }


    function _createModuleLike(mod, options) {
        var args, _newinst;

        A.assert(mod && A.isFunction(mod), "it's not a function type.");

        args = Array.prototype.slice.call(arguments);
        args.shift();
        _newinst = new (mod)(options);
        if ( mod.prototype.construct ) {
            mod.prototype.construct.apply(_newinst, args);
        }

        return _newinst;
    }




    if ( runAttrs.noframework ) {
        A.debug("noframework defined...........");
    }


    function executeFramework() {


        defineNamespace('loader', core.moduleFactory.createModule('loader'));
        defineNamespace('parser', core.moduleFactory.createModule('parser'));
        defineNamespace('builder', core.moduleFactory.createModule('builder'));
        defineNamespace('viewInstanceContainer', core.moduleFactory.createModule('viewInstanceContainer'));
        defineNamespace('communicationChannel', core.moduleFactory.createModule('communicationChannel'));


        defineNamespace("loadActionQueue", core.moduleFactory.createModule("LEQBLayerLoad")); 
        defineNamespace("leqbI18N", core.moduleFactory.createModule("LEQBLayerI18N")); 

        defineNamespace('page', core.moduleFactory.createModule('page')); 










    }


})(Camellia);

(function(_A) {

    var A = _A,
        core = _A.core;

    if ( _A.runAttributes.noframework ) {
        return;
    }

    function ModuleObject() {  
        if ( ModuleObject._super_proto_ !== undefined ) {
            ModuleObject._super_constructor(this, arguments);
        }
        this.$eventModule = A.createModule("events");
    }

    ModuleObject.prototype.construct = function() {

    };

    ModuleObject.toString = function() {
    };

    ModuleObject.getClassName = function() {
    };

    ModuleObject.prototype.on = function(ename, efunc, ctx, async) {
        this.$eventModule.on(ename, efunc, ctx, async);
    };

    ModuleObject.prototype.once = function(ename, efunc, ctx, async) {
        this.$eventModule.once(ename, efunc, ctx, async);
    };

    ModuleObject.prototype.off = function(ename, efunc, ctx) {
        this.$eventModule.off(ename, efunc, ctx);
    };


    ModuleObject.prototype.fire = function(evtname, args, ctx) {
        var eventObject = {
            args: A.isNil(args) ? {} : A.copyObject(args),
            eventType: evtname
        };

        arguments[ 1 ] = eventObject;

        this.$eventModule.fire.apply(this.$eventModule, arguments);
    };

    core.moduleFactory.register('ModuleObject', ModuleObject);

})(Camellia);
(function(_A) {

    var core = _A.core;
    if ( _A.runAttributes.noframework ) {
        return;
    }

    var utils = {

        path: {
            join: function(contextPath, url) {
                if ( A.isEmpty(contextPath) || A.isEmpty(url) ) {
                    return false;
                }

                if ( utils.path.isAbsolute(url) ) {
                    contextPath = core.page._config.resourceContextPath;
                }

                if ( contextPath[ contextPath.length - 1 ] !== '/' ) {
                    contextPath += '/';
                }

                if ( url[ 0 ] == '/' ) {
                    url = url.substr(1);
                }

                var fullPath = contextPath + url;
                var source = utils.path.split(fullPath);
                var target = [];

                A.forEach(source, function(token) {
                    if ( token == '..' ) {
                        A.assert(target.length !== 0, 'Cannot join url with contextPath because dot notation is out of bound.')
                        target.pop();

                    } else if ( token !== '.' ) {
                        target.push(token);
                    }
                });


                return utils.path._concatUrlTokensToUrl(target);
            },

            split: function(url) {
                var tokens = url.split('/');

                if ( tokens[ 0 ] === '' ) {
                    tokens = tokens.splice(1, tokens.length - 1);
                }

                if ( tokens[ tokens.length - 1 ] === '' ) {
                    tokens = tokens.splice(0, tokens.length - 1);
                }

                return tokens;

            },

            isAbsolute: function(path) {
                if ( path[ 0 ] === '/' ) {
                    return true;
                }

                return false;
            },

            convertCachedUrl: function(url) {
                var cachedPrefix = '?version_cache=';
                if ( core.page.getConfig('versionCacheUse') ) {
                    var queryParam = core.page.getConfig('versionCacheValue') ? cachedPrefix + core.page.getConfig('versionCacheValue') : null;
                    if ( queryParam ) {
                        url = url + queryParam;
                    }
                }

                return url;
            },

            _concatUrlTokensToUrl: function(urlTokens) {
                var concatUrl = '/';
                var lastTokenIndex = urlTokens.length - 1;
                A.forEach(urlTokens, function(token, index) {
                    concatUrl += token;
                    if ( index != lastTokenIndex ) {
                        concatUrl += '/';
                    }
                });

                return concatUrl;
            }
        },
        view: {
            parseParentViewInstanceID: function(id) {
                var idArray = id.split('.');

                idArray = idArray.slice(0, idArray.length - 1);

                return idArray.join('.');
            },

            getViewInstanceIDFromElement: function(element) {
                if( A.isNil(element) ) {
                    return '';
                }
                return element.viewInstanceID;
            }
        },

        $dom: {
            findViews: function($dom) {
                return $dom.find( "*[{0}]".format(core.DDA_VIEW) );
            },
            findFirstView: function($dom) {
                var _$result = utils.$dom.findViews($dom);
                return (_$result.length > 0 ? _$result[0] : null);
            },
            findViewByClass: function(className, $dom) {
                var _$result;

                if ($dom) {
                    _$result = $dom.find( '*[{0}="{1}"]'.format(core.DDA_VIEW, className) );
                }
                else {
                    _$result = $( '*[{0}="{1}"]'.format(core.DDA_VIEW, className) );
                }

                return _$result;
            },
            getViewClass: function($dom) {
                return $dom.attr(core.DDA_VIEW);
            },
            getViewId: function($dom) {
                return $dom.attr(core.DDA_VIEW_INST_ID);
            }
        },

        dom: {
            getViewClass:function(elm) {
                return elm.getAttribute(core.DDA_VIEW);
            },
            getViewId: function(elm) {
                return elm.getAttribute(core.DDA_VIEW_INST_ID);
            }
        }
    };

    core.defineNamespace('util', utils);

})(Camellia);


(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    function LEQBAction(layerType) {

        this._actionLayer = layerType;
        this._actionContext = null;
        this._resolved = null;
        this._rejected = null;
        this._promised = null;
    }

    LEQBAction.prototype.construct = function(layerType, context, resolved_, rejected_, promise_) {
        this._actionContext = context;
        this._resolved = resolved_;
        this._rejected = rejected_;
        this._promised = promise_;
    };

    Object.defineProperties(LEQBAction.prototype, {
        "actionLayer": {
            get: function() {
                return this._actionLayer;
            }
        },
        "actionContext": {
            get: function() {
                return A.copyObject(this._actionContext);
            }
        },
        "resolved": {
            get: function() {
                return this._resolved;
            }
        },
        "rejected": {
            get: function() {
                return this._rejected;
            }
        },
        "promised": {
            get: function() {
                return this._promised;
            }
        }
    });


    LEQBAction.prototype.execute = function(promise) {
        var that = this;

        A.assert(promise instanceof RSVP.Promise, "Action only executes with Promise Object. Not a promise argument");



        if ( this.promised ) {
            this.promised(promise);
        }
        else {
            return promise.then(function() {
                if ( that.resolved ) {
                    return that.resolved.apply(that, arguments);
                }
            }, function() {
                if ( that.rejected ) {
                    return that.rejected.apply(that, arguments);
                }
            });
        }
    };





    core.moduleFactory.register("LEQBAction", LEQBAction);	
})(Camellia);
(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    A.inherit(LEQBLayer, core.moduleFactory.get("ModuleObject"));
    function LEQBLayer() {

        if ( LEQBLayer._super_proto_ !== undefined ) {
            LEQBLayer._super_constructor(this, arguments);
        }

        this._type = "unknown";
        this._actions = [];
        this._runningActions = [];

    }

    Object.defineProperties(LEQBLayer.prototype, {
        "type": {
            get: function() {
                return this._type;
            }
        }

        , "EVENT_LAYER_ADD_ACTION": {
            get: function() {
                return "evtLayerAddAction";
            }
        }
        , "EVENT_LAYER_END_ACTION": {
            get: function() {
                return "evtLayerEndAction";
            }
        }
        , "EVENT_LAYER_END_ALL_ACTION": {
            get: function() {
                return "evtLayerEndAllAction";
            }
        }

        , "COMPLETE": {
            get: function() {
                return "complete";
            }
        }
    });


    LEQBLayer.prototype.construct = function() {
    };

    LEQBLayer.prototype.destroy = function() {
    };


    LEQBLayer.prototype.enqueue = function(actionOrActionList) {
        var that = this,
            actions = A.isArray(actionOrActionList) ? actionOrActionList : [ actionOrActionList ];

        if ( A.isEmpty(actions) ) {
            return false;
        }

        A.forEach(actions, function(action) {
            that._actions.push(action);
        });

        this.awake();
    };


    LEQBLayer.prototype.awake = function() {
        var _RUNNING_MAXCOUNT = 5; 


        function consumeActions() {
            var _action = null
                , _runningcount = this._runningActions.length;

            if ( (_runningcount <= _RUNNING_MAXCOUNT) ) {
                var _action = this.dequeue();

                if ( !A.isNil(_action) ) {
                    this._execute(_action);
                }
            }

            if ( !this.isActionsEmpty() ) {
                setTimeout(consumeActions.bind(this), 1);
            }
        }

        setTimeout(consumeActions.bind(this), 1);
    };

    LEQBLayer.prototype.isActionsEmpty = function() {
        return this._actions.length == 0;
    };

    LEQBLayer.prototype.dequeue = function() {
        var _action = this._actions.shift();

        if ( _action ) {
            this._runningActions.push(_action);
        }
        return _action;
    };


    LEQBLayer.prototype._execute = function(action) {
        var loadJob;
        var loadComplete = this._endAction;



        this.__execute.apply(this, arguments);
    };

    LEQBLayer.prototype._endAction = function(action) {
        var pos = this._runningActions.indexOf(action);

        if ( pos < 0 ) return;

        this._runningActions.splice(pos, 1);

        if ( this._actions.length == 0 && this._runningActions.length == 0 ) {
            this.fire(this.COMPLETE, action._actionContext);  
        }
    };


    LEQBLayer.prototype.__execute = function(action) {
        A.debug("must be implemented at derived module");
    };

    core.moduleFactory.register("LEQBLayer", LEQBLayer);	
})(Camellia);


(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }


    var IE_INTERACTIVE_MODE = Camellia.browser == 'msie' && Camellia.browser_version < 11;

    function getBaseUrlOfCurrentScriptInInteractiveMode() {
        var scripts = document.getElementsByTagName('script');
        var currentScript = null;

        A.forEachRight(scripts, function(script) {
            if(script.readyState == 'interactive') {
                currentScript = script;
                return false;
            }
        });

        if(!currentScript) {
            throw new Error('[CamelliaJS] [aui.core.leqb.layer.load] Fail to get a script which is in interactive state.');
        }

        return currentScript.getAttribute('data-base-url');
    }

    A.inherit(LEQBLayerLoad, core.moduleFactory.get("LEQBLayer"));

    function LEQBLayerLoad() {
        if ( LEQBLayerLoad._super_proto_ !== undefined ) {
            LEQBLayerLoad._super_constructor(this, arguments);
        }

        var that = this;

        this._type = "loadLayer";
        this._includes = []; 
        this._defines = [];

        A.assertNot(window.include, "include function is already defined. duplicated creation for loadLEDQLayer");

        A.include = window.include = function(url) {
            that._includes.push(url);

            if(IE_INTERACTIVE_MODE) {
                var baseUrl = getBaseUrlOfCurrentScriptInInteractiveMode();
                that._handleInclude(baseUrl);
            }
        };

        _A.define = function(className, module, moduleContext) {
            var moduleDef = {
                className: className,
                module: module,
                context: moduleContext
            };

            that._defines.push(moduleDef);

            if(IE_INTERACTIVE_MODE) {
                var baseUrl = getBaseUrlOfCurrentScriptInInteractiveMode();
                that._handleDefine(baseUrl);
            }
        };
    }

    LEQBLayerLoad.prototype.construct = function() {

    };


    LEQBLayerLoad.prototype._verifyContext = function(context) {
    };


    LEQBLayerLoad.prototype._handleInclude = function(contextPath) {
        A.assert(contextPath, "not found context path");

        var actions = [];

        if ( A.isEmpty(this._includes) ) {
            return;
        }

        A.forEach(this._includes, function(url) {
            var normalizedUrl = core.util.path.join(contextPath, url);
            var newLoadAction = core.moduleFactory.createModule("LEQBAction"
                , "loadLayer"
                , { url: normalizedUrl}
            );
            actions.push(newLoadAction);
        });

        this._includes = [];

        this.enqueue(actions);
    };

    LEQBLayerLoad.prototype._handleDefine = function(contextPath) {
        if ( !contextPath ) {

            A.debug(contextPath, "not found context path");
        }

        if ( A.isEmpty(this._defines) ) {
            return;
        }

        A.forEach(this._defines, function(moduleDef) {
            var moduleContext = moduleDef.context;

            moduleContext.contextPath = contextPath;

            if ( moduleDef.module.prototype.templateUrl ) {

                var action = core.moduleFactory.createModule("LEQBAction"
                    , "loadLayer"
                    , {
                        url: moduleDef.module.prototype.templateUrl,
                        contextPath: contextPath,
                        viewClass: moduleDef.module,
                        type: 'template'
                    }
                );

                core.loadActionQueue.enqueue(action);
            }

            core.moduleFactory.register(moduleDef.className, moduleDef.module, moduleContext);
        });

        this._defines = [];
    };

    LEQBLayerLoad.prototype._loadScript = function(action) {
        var that = this,
            actionContext = action.actionContext;

        var promise = new RSVP.Promise(function(resolve, reject) {
            core.loader.load(actionContext.url, true, resolve, reject, IE_INTERACTIVE_MODE); 
        });

        promise.then(function() {
            if(!IE_INTERACTIVE_MODE) {
                that._processAfterLoad(actionContext);
            }
        }).then(function() {
            that._endAction(action);
        }).catch(function(error) {
            that._endAction(action); 
            core.page.fireApplicationError(error);
        });
        action.execute(promise);
    };
    LEQBLayerLoad.prototype._loadTemplate = function(action) {
        var that = this,
            actionContext = action.actionContext;

        var promise = new RSVP.Promise(function(resolve, reject) {

            var url = core.util.path.join(action.actionContext.contextPath, action.actionContext.url);

            url = core.util.path.convertCachedUrl(url);

            $.ajax({
                async: true,
                url: url,
                type: 'GET',
                success: function(html) {

                    resolve(html);
                },

                error: function() {
                    reject(new Error('Cannot load templateUrl. url : ' + url));
                }
            });
        });

        promise.then(function(html) {
            actionContext.viewClass.prototype.template = html;
        }).then(function() {
            that._endAction(action);
        }).catch(function(error) {
            that._endAction(action);
            core.page.fireApplicationError(error);
        });

        action.execute(promise);
    };

    LEQBLayerLoad.prototype._processAfterLoad = function(actionContext) {
        var lastSlashIndex = actionContext.url.lastIndexOf('/')
            , contextPath = actionContext.url.slice(0, lastSlashIndex + 1);

        this._handleInclude(contextPath);
        this._handleDefine(contextPath);
    };

    LEQBLayerLoad.prototype._loadtypeCss = function(action) {
        var _that = this;


        var promise = new RSVP.Promise(function(resolve, reject) {
            var ac = action.actionContext,
                head = document.getElementsByTagName('head')[ 0 ],
                elm = createNode(ac.url);

            elm.addEventListener('load', load);
            elm.addEventListener('error', error);

            head.appendChild(elm);

            function load() {
                removeEvents();
                resolve(ac);
            }

            function error() {
                removeEvents();
                reject(ac);
            }

            function removeEvents() {
                elm.removeEventListener('load', load);
                elm.removeEventListener('error', error);
            }

            function createNode(url) {
                var elm = document.createElement("link");
                elm.type = "text/css";
                elm.rel = 'stylesheet';
                elm.href = url;

                return elm;
            }
        });

        action.execute(promise);

        this._endAction(action);
    };

    LEQBLayerLoad.prototype._loadtypeJSON = function(action) {



        var promise = new RSVP.Promise(function(resolve, reject) {
            var ac = action.actionContext
                , url = ac.url
                , async = true
                , xhr = new XMLHttpRequest()
            ;

            xhr.open("GET", url, async);		
            xhr.onreadystatechange = _readystatechange;
            xhr.responseType = "json";
            xhr.setRequestHeader("Accept", "application/json");	
            xhr.send();	

            function _readystatechange() {
                if ( this.readyState == this.DONE ) {
                    if ( this.status == 200 ) {
                        ac.result = this.response;
                        resolve(ac);
                    }
                    else {
                        ac.result = this.response;
                        reject(ac);
                    }
                }
            }
        });

        action.execute(promise);

        this._endAction(action);
    };

    LEQBLayerLoad.prototype.__execute = function(action) {
        var url = action.actionContext.url;
        A.assert(url, "missing url context in LEQBAction");
        if ( !url ) {
            A.debug("missing url context in LEQBAction", url);
        }

        url = url.trim().toLowerCase();

        if ( url.lastIndexOf(".css") > 0 ) {
            this._loadtypeCss(action);
        } else if ( url.lastIndexOf(".json") > 0 ) {
            this._loadtypeJSON(action);
        } else if ( url.lastIndexOf(".js") > 0 ) {
            this._loadScript(action);
        } else if ( action.actionContext.type == 'template' ) {
            this._loadTemplate(action);
        } else {
            throw Error("fail to load url : " + url);
        }
    };

    core.moduleFactory.register('LEQBLayerLoad', LEQBLayerLoad);
})(Camellia);

(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    A.inherit(LEQBLayerI18N, core.moduleFactory.get("LEQBLayer"));

    function LEQBLayerI18N() {
        if ( LEQBLayerI18N._super_proto_ !== undefined ) {
            LEQBLayerI18N._super_constructor(this, arguments);
        }

        this._type = "i18nLayer";
    }

    LEQBLayerI18N.prototype.construct = function() {

    };



    LEQBLayerI18N.prototype._load = function(action) {
        var that = this,
            actionContext = action.actionContext;

        if ( core.page._i18n.hasGroup(actionContext.groupKey) ) {
            that._endAction(action);
            return;
        }

        var promise = new RSVP.Promise(function(resolve, reject) {
            core.loader.i18nLoad(actionContext, resolve, reject);
        });

        promise.then(function(i18nData) {
            that._processAfterLoad(actionContext.groupKey, i18nData);
        }).then(function() {
            that._endAction(action);
        }).catch(function(error) {

            that._endAction(action);
            A.application.fireApplicationError(error);
        });

        action.execute(promise);
    };

    LEQBLayerI18N.prototype._processAfterLoad = function(groupKey, i18nData) {
        core.page._i18n.set([ groupKey ], i18nData);
    };

    LEQBLayerI18N.prototype.__execute = function(action) {
        this._load(action);
    };

    core.moduleFactory.register('LEQBLayerI18N', LEQBLayerI18N);
})(Camellia);
(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    function LEQBBlock() {

        this._layers_order = [];
        this._layers_map = {};
    }

    LEQBBlock.prototype.construct = function() {
    };

    LEQBBlock.prototype.run = function(action) {
        var _layer;

        this._verifyAction(action);

        _layer = this._findLayer(action.actionLayer);
        if ( _layer ) {
            _layer.enqueue(action);
        }
    };

    LEQBBlock.prototype.addLayer = function(layer, pos_) {
        A.assert(layer instanceof LEQBLayer, "input layer is wrong type");
        A.assertNot(this._isExistLayer(layer), "layer type is duplicated [{0}]".format(layer.type));

        var pos = (pos_ == undefined ? -1 : pos_);

        if ( pos >= 0 ) {
            this._layers_order.splice(pos, 0, layer);
        }
        else {
            this._layers_order.push(layer);
        }

        this._layers_map[ layer.type ] = layer;
    };

    LEQBBlock.prototype.deleteLayer = function(layerOrType) {
        var foundLayer,
            type = layerOrType instanceof LEQBLayer ? layerOrType.type : layerOrType;

        foundLayer = this._layers_map[ type ];
        if ( foundLayer ) {
            this._layers_order.splice(this._layers_order.indexOf(foundLayer), 1);
            delete this._layers_map[ type ];

            foundLayer.destroy();
        }
    };

    LEQBBlock.prototype.changeLayer = function(layerOrType, pos) {
        var foundLayer,
            type = layerOrType instanceof LEQBLayer ? layerOrType.type : layerOrType;

        A.assert(A.isInteger(pos) && pos <= this._layers_order.length, "invalid position value. out of range.");		

        foundLayer = this._layers_map[ type ];
        if ( foundLayer ) {
            this._layers_order.splice(this._layers_order.indexOf(foundLayer), 1);

            if ( pos >= 0 ) {
                this._layers_order.splice(pos, 0, foundLayer);
            }
            else {
                this._layers_order.push(foundLayer);
            }
        }
    };


    LEQBBlock.prototype._verifyAction = function(action) {
        A.assert(action instanceof LEQBAction, "Input Value is Wrong. It's not a LEQBActionSlot Type");

    };

    LEQBBlock.prototype._isExistLayer = function(layer) {
        var layer_type = layer;

        if ( layer instanceof LEQBLayer ) {
            layer_type = layer.type;
        }

        return this._layers_map[ layer_type ] != undefined;
    };


    LEQBBlock.prototype._findLayer = function(layer_type) {
        A.assert(A.isString(layer_type), "invalid argument type. it must be String type.");
        return this._layers_map[ layer_type ];
    };




    core.moduleFactory.register("LEQBBlock", LEQBBlock);	
})(Camellia);


(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    function config(options) {
        this._resourceContextPath = options.resourceContextPath || "/";     
        this._routerContextPath = options.routerContextPath || "/";
        this._routes = options.routes || null;                             
        this._pageNotFoundPath = options.pageNotFoundPath || "";           

        this._includes = options.includes || [];       

        this._bindSeperator = options.bindSeperator || '/';    
        this._cacheableSelector = options.cacheableSelector || false;    

        this._i18n = options.i18n || {};
        this._i18n_url = this._i18n.url || "";
        this._i18n_lang = options.i18n_lang || "ko";
        this._i18n_widgets = [];
        this._i18n_beforeSend = options.i18n_beforeSend || null;

        this._dataProtocolType = 'comm';

        this._historyTargetView = options.historyTargetView || null;
        this._historyTargetDom = options.historyTargetDom || null;

        if ( options.i18n && A.isPlainObject(options.i18n) ) {      
            this._i18n_url = options.i18n.url || this._i18n_url;
            this._i18n_lang = options.i18n.langauge || this._i18n_lang;
            this._i18n_commonKeys = options.i18n_commonKeys || this._i18n_commonKeys;
            this._i18n_beforeSend = options.i18n_beforeSend || this._i18n_beforeSend;
        }

        this._versionCacheUse = options.versionCacheUse || false;
        this._versionCacheValue = options.versionCacheValue || null;

    }

    Object.defineProperties(config.prototype,
        {
            "context": {
                get: function() {
                    return this._context;
                }
            }, 
            "resourceContextPath": {
                get: function() {
                    return this._resourceContextPath;
                }
            },
            "routerContextPath": {
                get: function() {
                    return this._routerContextPath;
                }
            },
            "routes": {
                get: function() {
                    return this._routes;
                }
            },
            "pageNotFoundPath": {
                get: function() {
                    return this._pageNotFoundPath;
                }
            },
            "bindSeperator": {
                get: function() {
                    return this._bindSeperator;
                }
            },
            "cacheableSelector": {
                get: function() {
                    return this._cacheableSelector;
                }
            },
            "includes": {
                get: function() {
                    return this._includes;
                }
            },
            "i18n": {
                get: function() {
                    return this._i18n;
                }
            },
            "i18n.url": {
                get: function() {
                    return this._i18n_url;
                }
            },
            "i18n.language": {
                get: function() {
                    return this._i18n_lang;
                }
            },
            "i18n.beforeSend": {
                get: function() {
                    return this._i18n_beforeSend;
                }
            },
            "dataProtocolType": {
                get: function() {
                    return this._dataProtocolType
                }
            },
            "historyTargetView": {
                get: function() {
                    return this._historyTargetView
                }
            },
            "historyTargetDom": {
                get: function() {
                    return this._historyTargetDom
                }
            },
            'versionCacheUse': {
                get: function() {
                    return this._versionCacheUse;
                }
            },
            'versionCacheValue': {
                get: function() {
                    return this._versionCacheValue;
                }
            }
        })
    ;


    config.prototype.construct = function() {

    };

    config.prototype.destroy = function() {

    };

    config.prototype.clear = function() {

    };

    config.prototype.update = function(key, value) {
        var privateKey = "_" + key;
        var that = this;

        A.assert(this[ privateKey ] !== undefined, "not found target key - " + key);

        this[ privateKey ] = value;

        if ( A.isPlainObject(value) && !A.isArray(value) ) {
            A.forIn(value, function(value_, key_) {
                privateKey += '_' + key_;
                that[ privateKey ] = value_;
            });
        }
    };


    config.prototype._verifyPath = function(path) {
        return true;    
    };


    core.moduleFactory.register("config", config);

})(Camellia);


(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    function loader() {
        this._scriptLoadHistory = new ScriptLoadHistory();
    }

    loader.prototype.construct = function() {
    };

    loader.prototype.load = function(url, async, resolve, reject, ieInteractiveMode) {
        this._load(url, async, resolve, reject, ieInteractiveMode);
    };

    loader.prototype.loadSync = function(url, resolve, reject) {
        return this._load(url, false, resolve, reject);
    };

    loader.prototype.register = function(name, def) {
        if ( this.find(name) ) {
            throw new Error('Module ' + name + ' is already registered');
        }
        core.moduleFactory.set(name, def);
    };

    loader.prototype.registerByExtend = function(name, def, parentDef) {
        A.inherit(def, parentDef);
        this.register(name, def);
    };

    loader.prototype.unregister = function(name) {
        core.moduleFactory.remove(name);
    };

    loader.prototype.find = function(name) {
        return core.moduleFactory.get(name);
    };

    loader.prototype.isURIPattern = function(URI) {
        var rexpURL = /\:\/\/|\/|\.[jJ][sS]$/;
        return rexpURL.test(URI)
    };

    loader.prototype._requestResource = function(URI) {

    };

    loader.prototype._isAlreadyLoaded = function(url) {
        return this._scriptLoadHistory.hasScript(url);
    };

    loader.prototype._load = function(url, async, resolve, reject, ieInteractiveMode) {
        var that = this;
        A.assert(this.isURIPattern(url), 'Invalid URI pattern - ' + url);

        if ( this._isAlreadyLoaded(url) ) {
            resolve();
            return;
        } else {
            this._scriptLoadHistory.push(url);
        }

        var head = document.getElementsByTagName('head')[ 0 ]
            , elm = createNode(url);

        elm.addEventListener('load', load);
        elm.addEventListener('error', error);

        head.appendChild(elm);

        function load() {
            removeEvents();
            resolve();
        }

        function error() {
            that._scriptLoadHistory.remove(url);
            removeEvents();
            reject(new Error('Fail to load - ' + url));
        }

        function removeEvents() {
            elm.removeEventListener('load', load);
            elm.removeEventListener('error', error);
        }

        function createNode(url) {
            var elm = document.createElement("script");
            elm.type = "text/javascript";
            elm.charset = 'utf-8';
            elm.async = true;
            elm.src = core.util.path.convertCachedUrl(url);

            if(ieInteractiveMode) {
                var lastSlashIndex = url.lastIndexOf('/')
                    , parentBaseUrl = url.slice(0, lastSlashIndex + 1);
                elm.setAttribute('data-base-url', parentBaseUrl);
            }
            return elm;
        }
    };

    loader.prototype.i18nLoad = function(requestParam, resolve, reject) {
        $.ajax({
            dataType: "json",
            async: true,
            url: core.page.getConfig('i18n').url,
            type: "POST",
            beforeSend: core.page.getConfig('i18n').beforeSend,
            data: requestParam,
            success: function(data) {
                resolve(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                A.debug('fail to load i18n data. url : ' + core.page.getConfig('i18n').url + ' requestParam : ' + JSON.stringify(requestParam));
                reject(new Error('fail to load i18n data. requestParam : ' + JSON.stringify(requestParam)));
            }
        });
    };

    loader.prototype.i18nLoadSync = function(requestParam) {
        $.ajax({
            dataType: "json",
            async: false,
            url: core.page.getConfig('i18n').url,
            type: "POST",
            beforeSend: core.page.getConfig('i18n').beforeSend,
            data: requestParam,
            success: function(data) {
                core.page._i18n.set([requestParam.groupKey], data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                A.debug('fail to load i18n data. url : ' + core.page.getConfig('i18n').url + ' requestParam : ' + JSON.stringify(requestParam));
                A.debug('i18nload-error', jqXHR, textStatus, errorThrown);
            }
        });
    };

    loader.prototype._generateResourcePath = function(name) {
        return name;
    };


    core.moduleFactory.register('loader', loader);


    function ScriptLoadHistory() {
        this._loadedScript = [];

        this.push = function(url) {
            if ( !this.hasScript(url) ) {
                this._loadedScript.push(url);
            }
        };

        this.remove = function(key) {
            A.remove(this._loadedScript, function(value) {
                return value == key;
            });
        };
        this.hasScript = function(url) {
            for ( var i = 0, len = this._loadedScript.length; i < len; i++ ) {
                if ( this._loadedScript[ i ] == url ) {
                    return true;
                }
            }
            return false;
        };

        this.clear = function() {
            this._loadedScript = [];
        }
    }
})(Camellia);





(function(_A) {
    var core = _A.core;

    if ( A.runAttributes.noframework ) {
        return;
    }

    A.inherit(I18N, core.moduleFactory.get("ModuleObject"));

    function I18N(options) {
        if ( I18N._super_proto_ !== undefined ) {
            I18N._super_constructor(this, arguments);
        }

        this.language = options.language ? options.language : A.language.substr(0, 2);
        this.tenant = options.tenant;

        this.widgets = options.widgets ? options.widgets : [];

        this.groupKeySeparator = core.page.getConfig('bindSeperator') ? core.page.getConfig('bindSeperator') : '/';
        this.groupKeyDepth = options.groupKeyDepth ? options.groupKeyDepth : 1;
        this.groupKeyMode = options.groupKeyMode ? options.groupKeyMode : this.MANUAL_GROUPKEY_MODE; 

        this.i18nSimpleDataset = A.createModule('dataset.simple');

        this.groupKeys = [];
    }

    Object.defineProperties(I18N.prototype, {
        I18N_READY: { get: function() { return 'i18n_ready'; } },
        I18N_DATA_LOADED: { get: function() { return 'I18N_DATA_LOADED'; } },
        I18N_LANGUAGE_CHANGED: { get: function() { return 'i18n_language_changed'}},
        LANGUAGE: { get: function() { return this.language; } },
        CAMELLIA_COMMON_I18NDATA: { get: function() { return '__CAMELLIA_COMMON_I18N_DATA__'; } },
        VIEWCLASS_GROUPKEY_MODE: { get: function() { return 'viewClassName'; } },
        MANUAL_GROUPKEY_MODE: { get: function() { return 'manual'; } },
        GROUP_KEY_MODE: { get: function() { return this.groupKeyMode; } }
    });

    I18N.prototype.construct = function(options) {
    };

    I18N.prototype.init = function() {
        if ( !A.isEmpty(this.widgets) ) {
            this.load(this.widgets, function() {
                this.fire(this.I18N_READY);
            }.bind(this));
        } else {
            this.fire(this.I18N_READY);
        }
    };

    I18N.prototype.get = function(path, language) {
        var _language = language ? language : this.getLanguage();

        var concatenatedPath = A.concat([ _language ], path);
        if ( this.isMultiTenant() ) {
            concatenatedPath = A.concat([ this.tenant ], concatenatedPath);
        }

        var value = this.i18nSimpleDataset.get(concatenatedPath);

        if ( this.isGroupKeyModeByView() ) {
            if ( !value ) {
                var extractedKey = this.extractKey(path);

                value = this.i18nSimpleDataset.get(A.concat([ _language ], this.CAMELLIA_COMMON_I18NDATA, extractedKey));
            }
        }

        return value;
    };

    I18N.prototype.set = function(path, data, language) {
        var _language = language ? language : this.getLanguage();

        if ( !A.isString(data) ) {
            data = this._flattenObject(data);

            for ( var key in data ) {
                if ( key.indexOf(this.groupKeySeparator) === -1 ) {
                    continue;
                }

                var keys = key.split(this.groupKeySeparator);
                A.set(data, keys, data[ key ]);

                delete data[ key ];
            }
        }

        var newPath = A.concat([ _language ], path);
        if ( this.isMultiTenant() ) {
            newPath = A.concat([ this.tenant ], newPath);
        }

        this.i18nSimpleDataset.set(newPath, data);
        this.fire(this.I18N_DATA_LOADED, { language: this.getLanguage() });
    };

    I18N.prototype.setEntireData = function(data) {
        this.i18nSimpleDataset.set([], data);
    };

    I18N.prototype.flushData = function() {
        this.i18nSimpleDataset.set([], {});
    };

    I18N.prototype.eventOn = function(eventName, func, ctx, async, path) {
        path = A.isNil(path) ? [] : path;

        this.i18nSimpleDataset.eventOn(eventName, func, ctx, async, path);
    };

    I18N.prototype.eventOff = function(eventName, func, ctx, path) {
        path = A.isNil(path) ? [] : path;

        this.i18nSimpleDataset.eventOff(eventName, func, ctx, path);
    };

    I18N.prototype._flattenObject = function(obj) {
        var flattendObj = {};

        for ( var key in obj ) {
            if ( typeof obj[ key ] === 'object' ) {
                var flatObject = this._flattenObject(obj[ key ]);
                for ( var flatKey in flatObject ) {
                    flattendObj[ key + '/' + flatKey ] = flatObject[ flatKey ];
                }
            } else {
                flattendObj[ key ] = obj[ key ];
            }
        }
        return flattendObj;
    };

    I18N.prototype.setCommonData = function(data, language) {
        var _language = language ? language : this.getLanguage();

        this.set([ this.CAMELLIA_COMMON_I18NDATA ], data, _language);
    };

    I18N.prototype.hasGroup = function(groupKey) {
        return this.i18nSimpleDataset.getCount([ this.language, groupKey ]) > 0;
    };

    I18N.prototype.getGroupKeys = function(language) {
        var _language = language ? language : this.getLanguage();

        return this.i18nSimpleDataset.getKeys([ _language ]);
    };

    I18N.prototype.translate = function(key, substituteArray, viewClassName) {
        if ( this.isGroupKeyModeByView() ) {
            return this._translateByView(key, substituteArray, viewClassName);
        }

        return this._translate(key, substituteArray);
    };

    I18N.prototype._translate = function(key, substituteArray) {
        var keys = key.split(this.groupKeySeparator),
            i18nValue = this.get(keys);

        if ( A.isArray(substituteArray) ) {
            i18nValue = this._replaceTemplate(i18nValue, substituteArray);
        }

        return i18nValue;
    };

    I18N.prototype.extractGroupKey = function(key) {
        return key.slice(0, this._getGroupKeyPosition(key));
    };

    I18N.prototype.extractKey = function(path) {
        return path.slice(this.groupKeyDepth, path.length);
    };

    I18N.prototype._getGroupKeyPosition = function(key) {
        var splitPos = 0,
            splitedKeys = key.split(this.groupKeySeparator),
            idx = 0;

        while ( idx < this.groupKeyDepth ) {
            splitPos += splitedKeys[ idx ].length;
            idx++;
        }

        return splitPos;
    };

    I18N.prototype._translateByView = function(key, substituteArray, viewClassName) {
        var i18nValue = this.get(A.concat([ viewClassName ], key.split(this.groupKeySeparator)));

        if ( !i18nValue ) {
            A.debug('There is no i18n value:: [ viewClassName : ' + viewClassName + ' i18nKey : ' + key + ' ]');
            return;
        }

        if ( A.isArray(substituteArray) ) {
            i18nValue = this._replaceTemplate(i18nValue, substituteArray);
        }

        return i18nValue;
    };

    I18N.prototype.extractGroupKeyList = function(keyList) {
        var groupKeyList = [];

        A.forEach(keyList, function(key) {
            groupKeyList.push(this.extractGroupKey(key));
        }.bind(this));

        return groupKeyList;
    };

    I18N.prototype._replaceTemplate = function(valueString, substituteArray) {
        var pattern = /{\d.*}/g;

        if ( !pattern.test(valueString) ) {
            return valueString;
        }

        for ( var i = 0; i < substituteArray.length; i++ ) {
            valueString = valueString.replace('{' + i + '}', '' + substituteArray[ i ]);
        }

        return valueString;
    };

    I18N.prototype.setLanguage = function(language, callback) {
        var path = [];

        if ( this.isMultiTenant() ) {
            path.push(this.getTenant());
            path.push(this.getLanguage());
        } else {
            path.push(this.getLanguage());
        }

        var currentLoadedI18nGroupKeys = this.i18nSimpleDataset.getKeys(path);

        this.language = language;

        this.load(currentLoadedI18nGroupKeys, function() {
            this.fire(this.I18N_LANGUAGE_CHANGED, language);

            if ( callback ) {
                callback();
            }
        }.bind(this));
    };

    I18N.prototype.getLanguage = function() {
        return this.LANGUAGE || core.page.getConfig('i18n').language;
    };

    I18N.prototype.setTenant = function(tenant) {
        this.tenant = tenant;
    };

    I18N.prototype.getTenant = function() {
        return this.tenant || core.page.getConfig('i18n').tenant;
    };

    I18N.prototype.isMultiTenant = function() {
        if ( this.tenant ) {
            return true;
        }
        return false;
    };

    I18N.prototype.enrollGroupKeys = function(groupKeyOrGroupKeyList) {
        var groupKeys = A.isArray(groupKeyOrGroupKeyList) ? groupKeyOrGroupKeyList : [ groupKeyOrGroupKeyList ];

        A.forEach(groupKeys, function(groupKey) {
            if ( this.groupKeys.indexOf(groupKey) === -1 ) {
                this.groupKeys.push(groupKey);
            }
        }.bind(this));
    };

    I18N.prototype.flushEnrollList = function(async) {
        if ( !A.isEmpty(this.groupKeys) ) {
            if ( async ) {
                this.load(this.groupKeys);
            } else {
                this.loadSync(this.groupKeys);
            }
        } else {
            this.fire(this.I18N_DATA_LOADED);
        }

        this.groupKeys = [];
    };

    I18N.prototype._beforeLoadRefineGroupKeys = function(groupKeys) {
        var existGroupKeys = this.i18nSimpleDataset.getKeys([ this.getLanguage() ]);

        return A.difference(A.uniq(A.compact(groupKeys)), existGroupKeys);
    };

    I18N.prototype.load = function(groupKeyList, callback) {
        var actionList = [];

        groupKeyList = this._beforeLoadRefineGroupKeys(groupKeyList);

        if ( A.isEmpty(groupKeyList) ) {
            var path = [];

            if ( this.isMultiTenant() ) {
                path.push(this.getTenant());
            }

            path.push(this.getLanguage());
            this.i18nSimpleDataset.changeSelectedKey(path);
        }

        A.forEach(groupKeyList, function(groupKey) {
            var param = {
                language: this.getLanguage(),
                groupKey: groupKey
            };

            if ( this.isMultiTenant() ) {
                param[ 'tenant' ] = this.getTenant();
            }

            var action = core.moduleFactory.createModule('LEQBAction'
                , 'i18nLayer'
                , param
            );

            actionList.push(action);
        }.bind(this));

        if ( A.isEmpty(actionList) ) {
            if ( callback ) {
                callback();
            }
        } else {
            if ( callback ) {
                core.leqbI18N.once('complete', callback.bind(this));
            }

            core.leqbI18N.enqueue(actionList);
        }
    };

    I18N.prototype.loadSync = function(groupKeyList) {
        groupKeyList = this._beforeLoadRefineGroupKeys(groupKeyList);

        A.forEach(groupKeyList, function(groupKey) {
            var param = {
                language: this.getLanguage(),
                groupKey: groupKey
            };

            if ( this.isMultiTenant() ) {
                param[ 'tenant' ] = this.getTenant();
            }
            core.loader.i18nLoadSync(param);
        }.bind(this));
    };

    I18N.prototype.getWidgetLocalization = function(widgetName) {
        return this.get([ widgetName ]);
    };

    I18N.prototype.setWidgetLocalization = function(widgetName, data) {
        this.i18nSimpleDataset.set(A.concat([ this.getLanguage() ], widgetName), data);
    };

    I18N.prototype.isGroupKeyModeByView = function() {
        return this.groupKeyMode === this.VIEWCLASS_GROUPKEY_MODE;
    };

    core.moduleFactory.register('i18n', I18N);

})(Camellia);
(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }
    A.inherit(frame, core.moduleFactory.get('ModuleObject'));

    function frame() {
        if ( frame._super_proto_ !== undefined ) {
            frame._super_constructor(this, arguments);
        }

        this._rootView = null;
    }

    Object.defineProperties(frame.prototype, {
        EVENT_VIEW_UPDATING: {
            get: function () {
                return "viewUpdating";
            }
        },
        EVENT_VIEW_UPDATE_COMPLETE: {
            get: function () {
                return "viewUpdateComplete";
            }
        },
        EVENT_VIEW_UPDATE_TIMEOUT: {
            get: function () {
                return "viewUpdateTimeout";
            }
        }
    });

    frame.prototype.construct = function () {
        this._sharedModelInstancePool = {};
    };


    frame.prototype.destroy = function () {
    };

    frame.prototype.init = function () {
        var that = this;

        core.viewInstanceContainer.createRootView();

        this._rootView = core.viewInstanceContainer.getRootView();

        this._rootView.on(this._rootView.ROOTVIEW_EVENT_VIEW_UPDATING, function () {
            that.fire(that.EVENT_VIEW_UPDATING);
        });

        this._rootView.on(this._rootView.ROOTVIEW_EVENT_VIEW_UPDATE_COMPLETE, function () {
            that.fire(that.EVENT_VIEW_UPDATE_COMPLETE);
        });


        this._rootView.on(this._rootView.ROOTVIEW_EVENT_VIEW_UPDATE_TIMEOUT, function () {
            that.fire(that.EVENT_VIEW_UPDATE_TIMEOUT);
        });

    };

    frame.prototype.hasSharableModel = function (modelClassName) {
        if ( this._sharedModelInstancePool[ modelClassName ] ) {
            return true;
        }

        return false;
    };

    frame.prototype.registerSharableModel = function (modelInstance) {
        var modelClassSetting = modelInstance._getModelClassDefinition();


        if ( !modelClassSetting.sharable ) {
            throw new Error("ModelClass(" + modelClassSetting.className + ") is not sharable.");
        }

        if ( this.hasSharableModel(modelClassSetting.className) ) {
            throw new Error("ModelClass(" + modelClassSetting.className + ") has already existed in Shared Model Instance Pool.");
        }

        this._sharedModelInstancePool[ modelClassSetting.className ] = modelInstance;
    };

    frame.prototype.getSharableModelInstance = function (modelClassName) {
        if ( !this._sharedModelInstancePool[ modelClassName ] ) {
            throw new Error("Model Instance(" + modelClassName + ") does not exist in aFrame's Shared Model Instance Pool.");
        }

        return this._sharedModelInstancePool[ modelClassName ];
    };


    frame.prototype.getView = function (cssPath) {
        return this.getViewByID($(cssPath)[0].viewInstanceID);
    };

    frame.prototype.getViewByID = function (id) {
        return core.viewInstanceContainer.getViewByID(id);
    };

    core.moduleFactory.register('frame', frame);
})(Camellia);


(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    A.inherit(page, core.moduleFactory.get('ModuleObject'));

    function page(options) {
        if ( page._super_proto_ !== undefined ) {
            page._super_constructor(this, arguments);
        }

        this._config = core.moduleFactory.createModule("config", {});

        this._frames = [];          
        this._mainFrame = null;      

        this._mainFrame = null;

        this._isFrameInitialized = false; 

        this._status = "NONE";

        this._state = null; 

        this._i18n = null;


    }


    Object.defineProperties(page.prototype, {
        EVENT_BEFORE_APPLICATION_ACTIVE: {
            get: function() {
                return "beforeApplicationActive";
            }
        },

        EVENT_APPLICATION_ACTIVE: {
            get: function() {
                return "applicationActive";
            }
        },

        EVENT_APPLICATION_UPDATING: {
            get: function() {
                return "applicationUpdating";
            }
        },

        EVENT_APPLICATION_UPDATE_TIMEOUT: {
            get: function() {
                return "applicationUpdateTimeout";
            }
        },

        EVENT_APPLICATION_RESUMED: {
            get: function() {
                return "applicationResumed";
            }
        },

        EVENT_APPLICATION_ERROR: {
            get: function() {
                return "applicationError"
            }
        }
    });


    page.prototype.construct = function() {
    };

    page.prototype.destroy = function() {
        var _frame;

        this._config.destroy();

        for ( var fx = this._frames.length - 1; fx >= 0; fx-- ) {
            _frame = this._frames[ fx ];
            _frame.destroy();
        }
        this._frames.splice(0);
        this._mainFrame = null;

    };

    page.prototype.setConfig = function(configs) {
        var that = this;

        A.forEach(configs, function(config, configName) {
            that._config.update(configName, config);
        })
    };

    page.prototype.getConfig = function(propertyName) {
        var property = this._config[ propertyName ];

        if ( !property ) {
            return null;
        }

        return A.copyObject(property);
    };

    page.prototype._loadPredefinedResources = function(importUrls) {
        var that = this,
            loadActions = [];


        A.forEach(importUrls, function(url) {
            var actionUrl = core.util.path.join(that._config.resourceContextPath, url);

            var newLoadAction = core.moduleFactory.createModule("LEQBAction"
                , "loadLayer"
                , { url: actionUrl, async: true } 
            );

            loadActions.push(newLoadAction);
        });


        core.loadActionQueue.enqueue(loadActions); 
    };

    page.prototype.run = function() {
        var that = this;

        this._i18n = core.moduleFactory.createModule("i18n", this._config._i18n);
        this.fire(this.EVENT_BEFORE_APPLICATION_ACTIVE);

        this._mainFrame = core.moduleFactory.createModule("frame");
        this._mainFrame.on(this._mainFrame.EVENT_VIEW_UPDATE_COMPLETE, function() {
            that.fire(that.EVENT_APPLICATION_RESUMED);
        });
        this._mainFrame.on(this._mainFrame.EVENT_VIEW_UPDATING, function() {
            that.fire(that.EVENT_APPLICATION_UPDATING);

        });
        this._mainFrame.on(this._mainFrame.EVENT_VIEW_UPDATE_TIMEOUT, function() {
            that.fire(that.EVENT_APPLICATION_UPDATE_TIMEOUT);
        });

        this._frames.push(this._mainFrame);

        this._i18n.once('i18n_ready', function() {
            if ( A.isEmpty(that._config.includes) ) {
                that.initFrame();
            } else {
                core.loadActionQueue.once('complete.page', function() {
                    if ( !that._isFrameInitialized ) {
                        that.initFrame();
                    }
                }, null, true);

                that._loadPredefinedResources(that._config.includes);
            }
        });

        this._i18n.init();

        this._history = core.moduleFactory.createModule("history");
        window.addEventListener("popstate", function(e) {
            that._history.popHistory.apply(that._history, arguments);
        });
        this.on('applicationActive', function() {
            that._history.beginHistory.apply(that._history, arguments);
        });
    };

    page.prototype.fireApplicationError = function(error) {
        console.error("[CamelliaJS]", error );

        this.fire(this.EVENT_APPLICATION_ERROR, error);
    };

    page.prototype.redirect = function(path) {
    };

    page.prototype.initFrame = function() {
        this._mainFrame.init();
        this._isFrameInitialized = true;
        this.fire(this.EVENT_APPLICATION_ACTIVE);
    };

    page.prototype.getFrame = function() {
        return this._mainFrame;
    };

    page.prototype.dangerouslyAppendViewTemplate = function(ownerViewInstance, templateStr, appendPosition, viewInitParam) {
        var $wrapper = $("<div>"),
            $template = $(templateStr),
            $where = $(appendPosition);

        function safeTemplateBuildCheck($target) {
            var $firstBindTag = $target.find('[{0}]:first'.format(core.DDA_BIND)),
                $bindTagWrapperView = null;

            A.assert($target.find( '[{0}]'.format(core.DDA_VIEW) ).length > 0, 'At least one {0} tag is required.'.format(core.DDA_VIEW));

            if ( $firstBindTag.length == 0 ) {
                return true;
            }

            $bindTagWrapperView = $firstBindTag.closest( '[{0}]'.format(core.DDA_VIEW) );

            A.assert($bindTagWrapperView.length > 0, 'A html tag which has {0} attribute should be wrapped with a html tag with {1} attribute.'.format(core.DDA_BIND, core.DDA_VIEW));
        }


        A.assert(ownerViewInstance, 'First parameter "ownerViewInstance" is not defined. "ownerViewInstance" is used to manage child view\'s life cycle');
        A.assert(templateStr, 'Second parameter "templateStr" is not defined. "templateStr" is a html string which defines view class.');
        A.assert(appendPosition, 'Third parameter "appendPosition" is not defined. "appendPosition" is a css path or jquery selector. ');
        A.assert($where.length > 0, 'Fail to find the append position. Please, check third parameter.');


        $wrapper.append($template);

        safeTemplateBuildCheck($wrapper);

        $where.append($wrapper);

        core.builder._build(ownerViewInstance, core.parser.parse($wrapper[ 0 ]), viewInitParam);

        $where.append($wrapper.children().detach());
        $wrapper.remove();
    };

    page.prototype.dangerouslyGetView = function(cssPath, frame) {
        return this._mainFrame.getView(cssPath)
    };

    page.prototype.dangerouslyGetViewByID = function(id, frame) {
        return this._mainFrame.getViewByID(id)
    };

    page.prototype.getLanguage = function() {
        return this._i18n.getLanguage();
    };

    page.prototype.setLanguage = function(langauge, callback) {
        this._i18n.setLanguage(langauge, callback);
    };

    page.prototype.setWidgetLocalization = function(widgetName, localizationData) {
        this._i18n.setWidgetLocalization(widgetName, localizationData);
    };

    page.prototype.setI18nData = function(path, data, language) {
        if(this._i18n.groupKeyMode === this._i18n.MANUAL_GROUPKEY_MODE) {
            this._i18n.set(path, data, language);
        } else {
            this._i18n.setCommonData(path, data);
        }
    };

    page.prototype.setI18nEntireData = function(data) {
        this._i18n.setEntireData(data);
    };

    page.prototype.setTenant = function(tenant) {
        this._i18n.setTenant(tenant);
    };

    page.prototype.getHistory = function() {
        return this._history;
    };

    core.moduleFactory.register('page', page);
})(Camellia);



(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    function parser() {
    }

    parser.prototype.construct = function() {
    };

    parser.prototype.parse = function(baseElement) {
        var parseResult = {
            viewTargets: [],
            modelTargets: [],
            i18nTargets: [],
            dataBindTargets: []
        };

        if ( baseElement instanceof jQuery ) {
            throw new Error("parser doesn't accept jQuery!!!");
        }

        this._run(baseElement, parseResult);


        return parseResult;
    };

    parser.prototype._run = function(baseElm, resultRef) { 

        var _running_context = createRunningContext();
        var _pnode = null, _children = null, _pos = -1, _tctx, _cnode, _cattr, _tmp, _pAttr, _noPeek;

        if ( !baseElm ) {
            return;
        }

        _children = this._childElements(baseElm.childNodes);   
        _pos = 0;

        while ( _pos < _children.length ) {

            _cnode = _children[ _pos ];
            _pAttr = null;
            _noPeek = false;

            if ( (_cattr = _cnode.getAttribute(core.DDA_VIEW) ) ) {
                _tmp = this._parserole_view(_cattr, _cnode);

                resultRef.viewTargets.push(_tmp);
                _noPeek = true;
            }

            else if ( (_cattr = _cnode.getAttribute(core.DDA_BIND)) ) {
                var isValidBindText = function(text) {
                    if ( A.isNil(text) ) {
                        throw new Error('{0} is undefined or null.\n'.format(core.DDA_BIND), text);
                    }

                    var bindItemCnt = text.split(',').length;
                    if ( bindItemCnt > 0 ) {
                        for ( var i = 0; i < bindItemCnt; i++ ) {
                            if ( text.split(',')[ i ].split(':').length != 2 ) {
                                throw new Error('AttributeName, ReferenceName pair specified on {0} are invalid. \n'.format(core.DDA_BIND) + text.split(',')[ i ]);
                            }
                        }
                    }

                    return true;
                };

                if ( isValidBindText(_cattr) ) {
                    var BIND_SEPERATOR = core.page.getConfig('bindSeperator');
                    var attributeListForBind = _cattr.split(',');

                    for ( var i = 0; i < attributeListForBind.length; i++ ) {
                        var bindingText = attributeListForBind[ i ];
                        var attributeName = bindingText.split(':')[ 0 ].trim();
                        var modelClassName = bindingText.split(':')[ 1 ].split(BIND_SEPERATOR)[ 0 ].trim();
                        var bindKey = bindingText.split(':')[ 1 ].split(BIND_SEPERATOR).splice(1).join(BIND_SEPERATOR).trim();
                        var element = _cnode;

                        resultRef.dataBindTargets.push({
                            refName: modelClassName,
                            bindKey: bindKey,
                            attributeName: attributeName,
                            element: element
                        });
                    }
                }
            }

            if ( !_noPeek && this._childElements(_cnode.childNodes).length > 0 ) {
                _running_context.push(_children, _pos, _pAttr);
                _children = this._childElements(_cnode.childNodes);
                _pos = 0;
                continue;
            }

            if ( _pos == (_children.length - 1) ) {
                while ( !_running_context.isEmpty() ) {
                    _tctx = _running_context.pop();
                    _children = _tctx.children;
                    _pos = _tctx.current;

                    if ( _pos < (_children.length - 1) ) {
                        break;
                    }
                }

            }

            _pos++;
        }


        function createRunningContext() {
            var _runctx = [];
            var _parentAttr = null;

            return {
                push: function(childNodes, currentIndex, parentClass) { 
                    var _ctx = {
                        children: childNodes,
                        current: currentIndex,
                        parentAttr: parentClass || null
                    };

                    _parentAttr = _ctx.parentAttr;

                    return _runctx.push(_ctx);
                },

                pop: function() {
                    var _poped = _runctx.pop();
                    _parentAttr = _poped.parentAttr;

                    return _poped;
                },

                isEmpty: function() {
                    return (_runctx.length == 0);
                },

                getParentClass: function() {    
                    return _parentAttr;
                }
            }
        }

    };

    parser.prototype._childElements = function(nodes) {
        return A.filter(nodes, function(node) {
            return A.isElement(node);
        });
    };

    parser.prototype._parserole_view = function(attr, elm) {
        var role_return = {
            viewClassName: attr || elm.getAttribute(core.DDA_VIEW),
            element: elm
        };
        return role_return;
    };

    parser.prototype._parserole_model = function(attr, elm) {
        var _role_two_attr = null;
        var role_return_set = [];
        var role_return_one = {
            modelClassName: attr || elm.getAttribute(core.DDA_MODEL),
            element: elm
        };
        var role_return_two = null;
        if ( (_role_two_attr = elm.getAttribute(core.DDA_BIND)) ) {
            role_return_two = {
                modelClassName: attr,
                element: elm,
                bindKey: _role_two_attr
            }
        }

        role_return_set.push(role_return_one);
        if ( role_return_two ) {
            role_return_set.push(role_return_two);
        }

        return role_return_set;
    };

    parser.prototype._parserole_bind = function(pattr, attr, elm) {
        var role_return = {
            modelClassName: pattr || elm.getAttribute(core.DDA_MODEL),
            element: elm,
            bindKey: attr || elm.getAttribute(core.DDA_BIND)
        };
        return role_return;
    };

    parser.prototype._parserole_i18n = function(attrValue, elm) {
        var groupKey = attrValue.slice(0, _getGroupKeyPosition(attrValue));
        var i18nKey = attrValue.slice(_getGroupKeyPosition(attrValue) + 1, attrValue.length);

        var role_return = {
            groupKey: groupKey,
            i18nKey: i18nKey,
            element: elm
        };

        function _getGroupKeyPosition(key) {
            var splitPos = 0;

            var splitedKeys = key.split('.'); 
            var idx = 0;
            while ( idx < 1 ) { 
                splitPos += splitedKeys[ idx ].length;
                idx++;
            }

            return splitPos;
        }


        return role_return;
    };


    core.moduleFactory.register('parser', parser);
})(Camellia);
(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }


    function builder() {
        this._viewInstanceContainer = core.viewInstanceContainer;
    }

    builder.prototype.construct = function() {
    };

    builder.prototype._build = function(viewInstance, parseResult, viewInitParam) {
        this._processParseResult(viewInstance, parseResult, viewInitParam);
    };

    builder.prototype._processParseResult = function(parentViewInstance, parseResult, viewInitialParam, modelInitialParam) {
        var childViewTargets = parseResult.viewTargets;
        var dataBindTargets = parseResult.dataBindTargets;

        if ( dataBindTargets.length > 0 ) {
            this._createDataBind(parentViewInstance, parentViewInstance.getViewModel(), dataBindTargets);
        }

        if ( childViewTargets.length > 0 ) {
            core.viewInstanceContainer.createViews(parentViewInstance, childViewTargets, viewInitialParam);
        }
    };


    builder.prototype._createModel = function(parentViewInstance, modelTargets, modelInitialParams) {
        var aframe = core.page.getFrame();

        for ( var i = 0, len = modelTargets.length; i < len; i++ ) {
            var modelItem = modelTargets[ i ];
            var modelClassName = modelItem.modelClassName;
            var modelClass = core.moduleFactory.get(modelClassName);

            if ( !modelClass ) {
                throw new Error("ModelClass (" + modelClassName + ") is null or undefined.");
            }

            var modelInstance = null;

            if ( modelClass.sharable == true ) {
                if ( !aframe.hasSharableModel(modelClassName) ) {             
                    modelInstance = core.moduleFactory.createModule(modelClassName, modelInitialParams);

                    if ( modelInstance._getReferenceModel() ) {
                        throw new Error("Sharable ModelClass can't refer to other ModelClass.");
                    }

                    aframe.registerSharableModel(modelInstance);
                }
            } else if ( modelClass.sharable == false ) {
                if ( !parentViewInstance.hasModel(modelClassName) ) {

                    modelInstance = core.moduleFactory.createModule(modelClassName, modelInitialParams);

                    parentViewInstance.registerModel(modelInstance);

                    var refModelClassName = modelInstance._getReferenceModel();
                    if ( modelInstance && refModelClassName ) {
                        var refModelClass = core.moduleFactory.get(refModelClassName);

                        if ( !refModelClass ) {
                            throw new Error("refModelClass (" + refModelClassName + ") is null or undefined.");
                        }

                        this._createModel(parentViewInstance, [ { modelClassName: refModelClassName } ]);
                        modelInstance._changeRefDataset(parentViewInstance._getModelInstance(refModelClassName));
                    }
                }
            } else {
                throw new Error("model's sharable property is required to have one value between true or false.");
            }
        }
    };

    builder.prototype._createDataBind = function(viewInstance, viewModel, dataBindTargets) {
        var itemsForAttributeModelBinding = []; 
        var itemsForAttributeFunctionBinding = []; 
        var itemsForAttributeI18nBinding = []; 
        var bindKeysI18n = []; 

        for ( var i = 0; i < dataBindTargets.length; i++ ) {
            var element = dataBindTargets[ i ].element;
            var attributeName = dataBindTargets[ i ].attributeName;
            var refName = dataBindTargets[ i ].refName;
            var bindKey = dataBindTargets[ i ].bindKey;

            if ( isModel(refName) && !viewModel.isEmpty() ) {

                var modelInstance = viewModel.get(refName);
                var dataset = modelInstance.getDataset();

                var cachedItem = A.find(itemsForAttributeModelBinding, { 'src': dataset, 'element': element });

                if ( A.isNil(cachedItem) ) {
                    cachedItem = {
                        src: dataset,
                        element: element,
                        attrBindingInfo: []
                    };
                    itemsForAttributeModelBinding.push(cachedItem);
                }

                cachedItem.attrBindingInfo.push(createAttributeBindInfo(attributeName, bindKey));

            } else if ( isFunction(refName) && !viewModel.isEmpty() ) {

                var cachedItem = A.find(itemsForAttributeFunctionBinding, { 'element': element });
                var func = $.proxy(viewModel.get(refName), viewInstance);

                if ( A.isNil(cachedItem) ) {
                    cachedItem = {
                        src: null,
                        element: element,
                        attrBindingInfo: []
                    };
                    itemsForAttributeFunctionBinding.push(cachedItem);
                }

                cachedItem.attrBindingInfo.push(createAttributeBindInfo(attributeName, func));

            } else if ( isI18n(refName) ) {
                var cachedItem = A.find(itemsForAttributeI18nBinding, { 'element': element });

                if ( A.isNil(cachedItem) ) {
                    cachedItem = {
                      element: element,
                        attrBindingInfo: []
                    };
                    itemsForAttributeI18nBinding.push(cachedItem);
                }

                if (core.page._i18n.isGroupKeyModeByView()) {
                    var bindSeparator = A.isNil(core.page.getConfig("bindSeparator")) ? "/" : core.page.getConfig("bindSeparator");
                    bindKey = viewInstance.viewClassName + bindSeparator + bindKey;
                }

                cachedItem.attrBindingInfo.push(createAttributeBindInfo(attributeName, bindKey));

                bindKeysI18n.push(core.page._i18n.extractGroupKey(bindKey));
            } else {

                if ( A.isNil(viewModel.get(refName)) ) {
                    throw new Error('It does not exist in View Model (refName:' + refName + ')');
                } else {

                    var dataset = viewModel.getDataset();
                    var cachedItem = A.find(itemsForAttributeModelBinding, { 'src': dataset, 'element': element }); 
                    if ( A.isNil(cachedItem) ) {
                        cachedItem = {
                            src: dataset,
                            element: element,
                            attrBindingInfo: []
                        };
                        itemsForAttributeModelBinding.push(cachedItem);
                    }

                    var convertedBindKey = bindKey.trim() == '' ? refName : refName + getBindSeparator() + bindKey;
                    cachedItem.attrBindingInfo.push(createAttributeBindInfo(attributeName, convertedBindKey));
                }

            }
        }

        var attributeBindItems = itemsForAttributeModelBinding || [];
        for ( var i = 0; i < attributeBindItems.length; i++ ) {
            var bndmodel = A.createModule("bindmodel.simple", {
                src: attributeBindItems[ i ].src,             
                targets: [ attributeBindItems[ i ].element ], 
                attrBindingInfo: attributeBindItems[ i ].attrBindingInfo,   
                bindSeparator: getBindSeparator()
            });
            viewInstance._registerBindModel(bndmodel);
        }

        var attributeBindItems = itemsForAttributeFunctionBinding || [];
        for ( var i = 0; i < attributeBindItems.length; i++ ) {
            var bndmodel = A.createModule("bindmodel.simple", {
                src: attributeBindItems[ i ].src,             
                targets: [ attributeBindItems[ i ].element ], 
                attrBindingInfo: attributeBindItems[ i ].attrBindingInfo,   
                bindSeparator: getBindSeparator(),
                bindway: A.BINDER_WAY.ONE
            });
            viewInstance._registerBindModel(bndmodel);
        }

        if ( core.page._i18n.groupKeyMode == core.page._i18n.MANUAL_GROUPKEY_MODE ) {
            core.page._i18n.enrollGroupKeys(bindKeysI18n);
        }

        for ( var i = 0; i < itemsForAttributeI18nBinding.length; i++ ) {
            var bndmodel = A.createModule("bindmodel.simple", {
                src: core.page._i18n,
                targets: [ itemsForAttributeI18nBinding[ i ].element ], 
                attrBindingInfo: itemsForAttributeI18nBinding[ i ].attrBindingInfo,   
                bindway: A.BINDER_WAY.ONE,
                isI18n: true,
                bindSeparator: getBindSeparator()
            });
            viewInstance._registerBindModel(bndmodel);
        }

        function isModel(refName) {
            if ( A.isNil(refName) ) {
                return false;
            }

            var modelInstance = viewModel.get(refName);
            var ModelPrototype = core.moduleFactory.get('model');

            if ( !A.isNil(modelInstance) && modelInstance instanceof ModelPrototype ) {
                return true;
            }
            return false;
        }

        function isFunction(refName) {
            if ( A.isNil(refName) ) {
                return false;
            }

            var functionBody = viewModel.get(refName);
            if ( !A.isNil(functionBody) && A.isFunction(functionBody) ) {
                return true;
            }
            return false;
        }

        function isI18n(refName) {
            if ( A.isNil(refName) ) {
                return false;
            }

            return refName.trim().toLowerCase() == 'i18n';
        }

        function createAttributeBindInfo(attributeName, info) {
            var attributeBindInfoItem = {};
            attributeBindInfoItem[ attributeName ] = info;
            return attributeBindInfoItem;
        }

        function getBindSeparator() {
            var bindSeparator = '/'; 
            return core.page.getConfig('bindSeperator') ? core.page.getConfig('bindSeperator') : bindSeparator;
        }
    };

    core.moduleFactory.register('builder', builder);
})(Camellia);
(function(_A) {
    var core = _A.core;
    if ( _A.runAttributes.noframework ) {
        return;
    }

    A.inherit(historyCore, core.moduleFactory.get('ModuleObject'));

    function historyCore() {
        if ( historyCore._super_proto_ !== undefined ) {
            historyCore._super_constructor(this, arguments);
        }

        this.historyTargetViewName = core.page.getConfig('historyTargetView');
        this.historyTargetDom = core.page.getConfig('historyTargetDom') || null;
        this.browserTitle = $('title').text();
        this.browserUrl = location.href;
    }

    A.extendif(historyCore.prototype, {
        constructor : function() {},

        destroy : function() {},

        _viewTravelStartingFromRootView : function(executeFunc) {
            var auiRootView = core.viewInstanceContainer.getRootView();
            this._viewTravel(auiRootView, executeFunc);
        },

        _viewTravel : function(view, executeFunc) {
            executeFunc(view);

            if(view.getChildViews().length == 0) {
                return;
            }

            for(var i=0; i < view.getChildViews().length; i++) {
                this._viewTravel(view.getChildViews()[i], executeFunc);
            }
        },

        _getHistoryTargetViewInstance : function() {

            var $historyTargetView = core.util.$dom.findViewByClass(this.historyTargetViewName),
                historyTargetViewInstanceId = core.util.$dom.getViewId($historyTargetView),
                historyTargetViewInstance = core.viewInstanceContainer.getViewByID(historyTargetViewInstanceId);

            return historyTargetViewInstance;
        },

        _isNoHistoryState : function(history) {
            return !(history.length > 0 && history.state && history.state.viewClassName);
        },

        _isHistoryTargetView : function(viewInstance) {
            return core.util.dom.getViewClass(viewInstance.getHost()[0]) == this.historyTargetViewName;
        },

        _recoverPreviousView : function(historyState) {
            var historyViewInstance = this._getHistoryTargetViewInstance();
            if(!historyState.viewClassName) {
                historyViewInstance.removeAllView();
                return;
            }

            var viewTemplateToBeRecovered = "<div {0}=".format(core.DDA_VIEW) + "'" + historyState.viewClassName + "'></div>";

            historyViewInstance.removeAllView();

            historyViewInstance._appendTemplate(viewTemplateToBeRecovered, historyState.where, historyState.viewInitParam);
        },

        _isHistoryManagingCase : function() {

            if(A.isNil(this.historyTargetViewName) || this.historyTargetViewName.trim() == '') {
                return false;
            }

            var $historyTargetView = core.util.$dom.findViewByClass(this.historyTargetViewName);
            if ($historyTargetView.length == 0) {
                return false;
            }

            if(Camellia.browser == 'msie' && Camellia.browser_version < 11) {
                A.debug("History Feature dosen't support under Internet Explorer 11");
                return false;
            }

            return true;
        },

        _isSupportedBrowser : function() {
            if(Camellia.browser == 'msie' && Camellia.browser_version < 11) {
                A.debug("History Feature dosen't support under Internet Explorer 11");
                return false;
            }

            return true;
        }

    }, "OEMC");

    A.extendif(historyCore.prototype, {

        beginHistory : function() {
            if(this._isSupportedBrowser() && this._isHistoryManagingCase()) {

                if (this._isNoHistoryState(history)) {

                    var $historyTargetView = core.util.$dom.findViewByClass(this.historyTargetViewName);
                    if ($historyTargetView.length > 0) {
                        var firstChild;
                        if (this.historyTargetDom) {
                            firstChild = $historyTargetView.find(this.historyTargetDom + " [{0}]".format(core.DDA_VIEW) )[0];
                        } else {
                            firstChild = $historyTargetView.find( "> [{0}]".format(core.DDA_VIEW) )[0];
                        }

                        var historyItem = {
                            viewClassName: firstChild ? core.util.dom.getViewClass(firstChild) : null,
                            viewInitParam: null,
                            where : this.historyTargetDom,
                            historyContext: null
                        };

                        this._viewTravelStartingFromRootView(function(view) {
                            if (view && view.beforeHistoryPush) {
                                historyItem.historyContext = historyItem.historyContext || {};
                                historyItem.historyContext.viewArgs = historyItem.historyContext.viewArgs || {};
                                historyItem.historyContext.viewArgs[view.getClassName()] = view.beforeHistoryPush.apply( view, [] );
                            }
                        });

                        A.debug('History Replace:' + historyItem.viewClassName);
                        history.replaceState(historyItem, this.browserTitle, this.browserUrl);
                    }

                } else {
                    this._recoverPreviousView(history.state);
                }

            }
        },

        pushHistory : function(currentViewInstance, viewClassName, where, viewInitParam, historyContext) {
            if(this._isSupportedBrowser() && this._isHistoryManagingCase()) {

                var historyTargetViewName = this.historyTargetViewName;
                var historyTargetDom = this.historyTargetDom;

                if (this._isHistoryTargetView(currentViewInstance) && historyTargetDom == where) {

                    if (core.page._isFrameInitialized) {

                        var historyItem = {
                            viewClassName: viewClassName,
                            viewInitParam: viewInitParam,
                            where: historyTargetDom,
                            historyContext: historyContext
                        };

                        this._viewTravelStartingFromRootView(function(view) {
                            if (view && view.beforeHistoryPush) {
                                historyItem.historyContext = historyItem.historyContext || {};
                                historyItem.historyContext.viewArgs = historyItem.historyContext.viewArgs || {};
                                historyItem.historyContext.viewArgs[view.getClassName()] = view.beforeHistoryPush.apply( view, [] );
                            }
                        });

                        A.debug('History Push:' + historyItem.viewClassName);
                        history.pushState(historyItem, this.browserTitle, this.browserUrl);

                    } else {
                        A.debug("Application Ready 전 이라서 push 하지 않음:" + viewClassName);
                    }

                }

            }
        },

        popHistory : function(e) {
            if(this._isSupportedBrowser() && this._isHistoryManagingCase()) {

                var state = e.state;

                if (!A.isNull(state)) {

                    this._recoverPreviousView(state);

                    this._viewTravelStartingFromRootView(function(view) {
                        if(view.beforeHistoryPop) {
                            var stateHistory = state.historyContext || {},
                                historyArgs = A.copyObject(stateHistory);
                            delete historyArgs['viewArgs'];

                            if (stateHistory.viewArgs && stateHistory.viewArgs[view.getClassName()]) {
                                historyArgs['viewArgs'] = A.copyObject(stateHistory.viewArgs[view.getClassName()]);
                            }

                            view.beforeHistoryPop.apply( view, [ historyArgs ] );
                        }
                    });

                }

            }
        }

    }, "OEMC");

    core.moduleFactory.register('history', historyCore);
})(Camellia);
(function(_A) {
    var core = _A.core;
    if (_A.runAttributes.noframework) {
        return;
    }

    var bindingTypes = ['source', 'value', 'values'];

    A.inherit(BindInfo, core.moduleFactory.get('ModuleObject'));

    function BindInfo (options) {
        if (BindInfo._super_proto_ !== undefined) {
            BindInfo._super_constructor(this, arguments);
        }

        this.bindingInfo = options.bindingInfo || [];
        this.controlFlag = options.controlFlag;         

        this._bindingMap = [];
        this._dataBinders = {};

        this._synchronizer = null;

        this.init();
    }

    BindInfo.prototype.construct = function() {
    };

    BindInfo.prototype.destroy = function() {
        for (var idx = 0, len = this._bindingMap.length; idx < len; idx++) {
            var bindInfo = this._bindingMap[ idx ];

            if ( bindInfo[ 'dataBinder' ] ) {
                this._unregisterDataBinderEvent(bindInfo[ 'dataBinder' ]);
                bindInfo[ 'dataBinder' ].destroy();
                bindInfo[ 'dataBinder' ] = null;
            }

            if ( bindInfo[ 'bindModel' ] ) {
                bindInfo[ 'bindModel' ] = null;
            }
        }

        this._bindingMap = null;
        this._dataBinders = null;

        if (this._synchronizer) {
            this._synchronizer.destroy();
            this._synchronizer = null;
        }
    };

    BindInfo.prototype.init = function() {
        A.assert(this.bindingInfo, "bindInfo is NULL or undefined.");

        this._synchronizer = this._createBindInfoSynchronizer();

        var orderSort = function(f, s) {
            return f[ 'order' ] - s[ 'order' ];
        };

        var orderExistArray = [],
            orderNotExistArray = [],
            bindingArray = [];

        for (var idx = 0, len = this.bindingInfo.length; idx < len; idx++) {
            var bindInfo = this.bindingInfo[idx],
                order = bindInfo[ 'order' ];

            if (A.isNil(order)) {
                orderNotExistArray.push(bindInfo);
            } else {
                orderExistArray.push(bindInfo);
            }
        }

        orderExistArray.sort(orderSort);

        bindingArray = A.concat(orderNotExistArray, orderExistArray);

        for (var idx = 0, len = bindingArray.length; idx < len; idx++) {
            this.set(bindingArray[ idx ]);
        }
    };

    BindInfo.prototype._sortBindingMapByOrder = function() {
        for ( var idx = 0, len = this._bindingMap.length; idx < len; idx++ ) {
            this._bindingMap[ idx ].order = (idx + 1);
        }
    };

    BindInfo.prototype.get = function(bindType) {
        var ret = { index: -1, bindInfo: null };

        for (var idx = 0, len = this._bindingMap.length; idx < len; idx++) {
            if ( this._bindingMap[ idx ].bindType == bindType ) {
                ret['index'] = idx;
                ret['bindInfo'] = this._bindingMap[idx];
                break;
            }
        }

        return ret;
    };

    BindInfo.prototype.set = function(bindInfo) {
        var firstIndex = 1,
            lastIndex = this._bindingMap.length + 1,
            bindType = bindInfo[ 'type' ],
            order = bindInfo['order'],
            bindModel, dataBinder, ret = {};

        try {
            if ( A.indexOf(bindingTypes, A.toLower(bindType)) == -1 ) {
                throw new Error(bindType + ' is an unsupported binding type. The type must be one of the following three (\'source\', \'value\', \'values\')');
            }

            var oldBindInfo = this.get(bindType);
            if ( oldBindInfo.index > -1 ) {
                this.remove(bindType);
            }

            if ( A.isNil(order) ) {
                order = lastIndex;
            }

            if ( order < firstIndex ) {
                order = firstIndex;
            }

            if ( order > lastIndex ) {
                order = lastIndex;
            }

            bindModel = this._createBindModel(bindInfo);
            dataBinder = this._createDataBinder(bindType, bindModel);

            this._bindingMap.splice(order - 1, 0, {
                'bindType': bindType,
                'bindModel': bindModel,
                'dataBinder': dataBinder,
                'order': order
            });

            this._sortBindingMapByOrder();

            this._synchronizer.add(bindType, false, order, dataBinder.applyCallbackFunc, dataBinder);

            ret[ bindType ] = dataBinder;
            return ret;
        } catch ( e ) {
            core.page.fireApplicationError(e);
        }

    };

    BindInfo.prototype.remove = function(bindType) {
        var bi = this.get(bindType),
            bindInfo = bi['bindInfo'],
            idx = bi['index'];

        if ( idx < 0 ) {
            return false;
        }

        if (bindInfo['dataBinder']) {
            this._unregisterDataBinderEvent(bindInfo['dataBinder']);
            bindInfo['dataBinder'] = null;
        }

        if (bindInfo['bindModel']) {
            bindInfo['bindModel'] = null;
        }

        this._bindingMap.splice(idx, 1);

        this._sortBindingMapByOrder();

        this._synchronizer.remove(bindType);

        return true;
    };

    BindInfo.prototype.getDataBinders = function() {
        var ret = {}, type;
        for ( var idx = 0, len = this._bindingMap.length; idx < len; idx++ ) {
            type = this._bindingMap[ idx ].bindType;
            ret[ type ] = this._bindingMap[ idx ].dataBinder;
        }
        return ret;
    };

    BindInfo.prototype.getBindModels = function() {
        var ret = [];

        for ( var idx = 0, len = this._bindingMap.length; idx < len; idx++ ) {
            ret.push(this._bindingMap[ idx ].bindModel);
        }

        return ret;
    };

    BindInfo.prototype._createBindModel = function(bindInfo) {
        if ( A.isNil(bindInfo[ "model" ]) ) {
            throw new Error("model is undefined or null");
        }

        if ( !bindInfo[ 'model' ] instanceof core.moduleFactory.get('model') ) {
            throw new Error('model is not a CamelliaJS model type');
        }

        var model = bindInfo[ 'model' ],
            bindModelType = bindInfo[ 'bindmodel' ] || model.getModelType(),
            options = {
                'src': model.getDataset(),
                'targets': bindInfo[ 'target' ] ? [ bindInfo[ 'target' ] ] : [],
                'dataBindKey': bindInfo[ 'bindKey' ],
                'bindType': bindInfo[ 'type' ]
            };

        if ( bindModelType.indexOf("bindmodel") == -1 ) {
            bindModelType = "bindmodel" + '.' + bindModelType;
        }

        return A.createModule(bindModelType, options);
    };

    BindInfo.prototype._createDataBinder = function(bindType, bindModel) {
        var dataBinder = A.createModule("dataBinder", {
            'bindmodel': bindModel,
            'bindType': bindType,
            'loadControl': this.controlFlag
        });

        this._registerDataBinderEvent(dataBinder);

        return dataBinder;
    };

    BindInfo.prototype._registerDataBinderEvent = function(dataBinder) {
        dataBinder.on(dataBinder.EVENTS.LOAD_END, this._evtDataBinderLoadEnd, this);
        dataBinder.on(dataBinder.EVENTS.DESTROY, this._evtDataBinderUnbind, this);
    };

    BindInfo.prototype._unregisterDataBinderEvent = function(dataBinder) {
        dataBinder.off(dataBinder.EVENTS.LOAD_END, this._evtDataBinderLoadEnd, this);
        dataBinder.off(dataBinder.EVENTS.DESTROY, this._evtDataBinderUnbind, this);
    };

    BindInfo.prototype._evtDataBinderLoadEnd = function() {
        var args = arguments[0],
            bindType = args["bindType"],
            isLoaded = A.isNil(args['isLoaded']) ? false : args['isLoaded'],
            bindInfo = this.get(bindType).bindInfo,
            dataBinder = bindInfo[ 'dataBinder' ]; 

        if (isLoaded) {
            this._synchronizer.update(bindType, isLoaded, args['originalArgs'], dataBinder);
        }
    };

    BindInfo.prototype._evtDataBinderUnbind = function() {
        var args = arguments[ 0 ],
            bindType = args[ 'bindType' ];

        this.remove(bindType);
    };

    BindInfo.prototype._createBindInfoSynchronizer = function() {
        return core.moduleFactory.createModule("bindInfoSynchronizer", {
            'isControl': this.controlFlag
        });
    };


    core.moduleFactory.register('bindInfo', BindInfo);

})(Camellia);
(function(_A) {
    var core = _A.core;
    if (_A.runAttributes.noframework) {
        return;
    }

    A.inherit(BindInfoSynchronizer, core.moduleFactory.get('ModuleObject'));

    function BindInfoSynchronizer(options) {
        if (BindInfoSynchronizer._super_proto_ !== undefined) {
            BindInfoSynchronizer._super_constructor(this, arguments);
        }

        this.isControl = options.isControl;


        this._mappingTable = [];
        this._mappingKeys = {};

        this.init();
    }

    BindInfoSynchronizer.prototype.construct = function() {

    };

    BindInfoSynchronizer.prototype.init = function() {
    };

    BindInfoSynchronizer.prototype.destroy = function() {
        this._mappingTable = null;
        this._mappingKeys = null;
    };

    BindInfoSynchronizer.prototype.update = function(bindType, state, originalArgs) {
        var idx = this._mappingKeys[bindType];

        if (A.isNil(this._mappingTable[idx])) {
            A.debug("There is no mappingInfo:: [bindType : " + bindType + "]");
            return;
        }

        this._mappingTable[idx].state = state;
        this._mappingTable[idx].args = originalArgs;

        if (this.isControl && this.checkAllStates()) {
            this._applyLoadSync();
        } else {
            this._applyLoadAsync(bindType);
        }
    };

    BindInfoSynchronizer.prototype.add = function(bindType, state, order, callback, ctx) {
        this._mappingTable.push({
            'key': bindType,
            'state': state,
            'order': order,
            'callbackFunc': callback,
            'ctx': ctx,
            'args': null
        });

        this._mappingKeys[bindType] = this._mappingTable.length - 1;
    };

    BindInfoSynchronizer.prototype.get = function(bindType) {
        var idx = this._mappingKeys[bindType];

        if (idx < 0) {
            A.debug("There is no mappingInfo:: [bindType : " + bindType + "]");
            return;
        }

        return this._mappingTable[idx];
    };

    BindInfoSynchronizer.prototype.remove = function(bindType) {
        var idx = this._mappingKeys[bindType];

        if (idx < 0) {
            A.debug("There is no mappingInfo:: [bindType : " + bindType + "]");
            return;
        }

        this._mappingTable.splice(idx, 1);
        delete this._mappingKeys[bindType];

    };

    BindInfoSynchronizer.prototype.checkAllStates = function() {
        var ret = true;

        for (var i = 0, len = this._mappingTable.length; i < len; i++) {
            var mappingInfo = this._mappingTable[i];

            if (!mappingInfo['state']) {
                ret = false;
                break;
            }
        }

        return ret;
    };

    BindInfoSynchronizer.prototype._applyLoadSync = function() {
        var compareSort = function(f, s) {
            return f['order'] - s['order'];
        };

        this._mappingTable.sort(compareSort);

        for (var i = 0, len = this._mappingTable.length; i < len; i++) {
            var mappingInfo = this._mappingTable[i],
                args = A.isNil(mappingInfo['args']) ? {} : mappingInfo['args'];

            if(!A.isNil(mappingInfo['callbackFunc'])) {
                mappingInfo['callbackFunc'].apply(mappingInfo['ctx'], ['load', args]);
            }

            if (i == (len-1)) {
                mappingInfo['callbackFunc'].apply(mappingInfo['ctx'], ['load_end', args]);
            }
        }
    };

    BindInfoSynchronizer.prototype._applyLoadAsync = function(bindType) {
        var mappingInfo = this.get(bindType),
            args = mappingInfo['args'];

        if(!A.isNil(mappingInfo['callbackFunc'])) {
            mappingInfo['callbackFunc'].apply(mappingInfo['ctx'], ['load', args]);

            if (this.checkAllStates()) {
                mappingInfo['callbackFunc'].apply(mappingInfo['ctx'], ['load_end', args]);
            }
        }
    };


    core.moduleFactory.register('bindInfoSynchronizer', BindInfoSynchronizer);

})(Camellia);
(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    function defineConfig(userConfig) {
        A.assert(A.isPlainObject(userConfig), "invalid argument - 1th, defineConfig. must be object type");

        A.application.setConfig(userConfig);

    }

    A.defineConfig = window.defineConfig = defineConfig;
})(Camellia);

(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    function defineModel(className, modelClassSetting ) {

        if ( !className ) {
            throw new Error('model classname is necessarily required.');
        }
        if ( !modelClassSetting ) {
            throw new Error('model setting is necessarily required.');
        }
        if ( !modelClassSetting.type ) {
            throw new Error('model type is necessarily required.');
        }

        (function() {
            var isValidType = false;
            for ( var type in A.MODEL_TYPE ) {
                if ( A.MODEL_TYPE[ type ] == modelClassSetting.type ) {
                    isValidType = true;
                }
            }
            if ( !isValidType ) {
                throw new Error('model type is invalid.');
            }
        })();

        if ( modelClassSetting.data ) {
            var modelData = modelClassSetting.data;

            if ( A.MODEL_TYPE.SIMPLE == modelClassSetting.type ) {
                if ( !A.isPlainObject(modelData) ) {
                    throw new Error('Data has to be Object for Simple Model.');
                }
            }

            else if ( A.MODEL_TYPE.TABLE == modelClassSetting.type ) {
                if ( !A.isArray(modelData) ) {
                    throw new Error('Data has to be Array for Table Model.');
                }

                var firstRowColumns = [];
                for ( var rowIndex = 0, len = modelData.length; rowIndex < len; rowIndex++ ) {
                    var row = modelData[ rowIndex ];

                    if ( !A.isPlainObject(row) ) {
                        throw new Error('Row Object of Table Model has to be Object type.');
                    }

                    if ( rowIndex == 0 ) {
                        for ( var columnName in row ) {
                            firstRowColumns.push(columnName);
                        }
                    }

                    for ( var columnName in row ) {
                        var isColumnMatched = false;

                        for ( var j = 0, jlen = firstRowColumns.length; j < jlen; j++ ) {
                            if ( columnName == firstRowColumns[ j ] ) {
                                isColumnMatched = true;
                            }
                        }

                        if ( !isColumnMatched ) {
                            throw new Error("Several column names are different among rows of Table Model. Please check mistyped column name related to '" + columnName + "'");
                        }
                    }
                }
            }

            else if ( A.MODEL_TYPE.TREE == modelClassSetting.type ) {
                var essentialPropertiesOfTreeItem = [
                    'id'
                ];

                if ( !A.isArray(modelData) ) {
                    throw new Error('Data has to be Array for Tree Model.');
                }

                for ( var i = 0, len = modelData.length; i < len; i++ ) {
                    var item = modelData[ i ];

                    if ( !A.isPlainObject(item) ) {
                        throw new Error('Item Object of Tree Model has to be Object type.');
                    }

                    for ( var j = 0, jlen = essentialPropertiesOfTreeItem.length; j < jlen; j++ ) {
                        var essentialProperty = essentialPropertiesOfTreeItem[ j ];

                        if ( !A.hasOwnProp(item, essentialProperty) ) {
                            throw new Error("Item Object of Tree Model is required to have '" + essentialProperty + "' property.");
                        }
                    }
                }
            }
        }

        var dataProtocolType = arguments[ 2 ] || (core.page.getConfig('dataProtocolType') || 'comm');
        var dataProtocolOptions = arguments[ 3 ] || {};

        function userModel(initializeParameter, moduleContext) {

            if ( userModel._super_proto_ !== undefined ) {
                userModel._super_constructor(this, arguments);
            }

            this._model.dataProtocolType = dataProtocolType || this._model.modelClassSetting.dataProtocolType;
            this._model.dataProtocolOptions = dataProtocolOptions || this._model.modelClassSetting.dataProtocolOptions

        }

        userModel.prototype.construct = function() {

            this._init(this._model.modelClassSetting);

            if ( this.init && A.isFunction(this.init) ) {
                this.init.apply(this, arguments);
            }

        };

        modelClassSetting[ 'className' ] = className;

        userModel.className = modelClassSetting.className;
        userModel.type = modelClassSetting.type;
        userModel.sharable = modelClassSetting.sharable || false;

        var _classSetting = A.copyObject(modelClassSetting);
        A.extendif(userModel.prototype, _classSetting); 

        core.moduleFactory.registerByExtend(className, userModel, core.moduleFactory.get('model'), modelClassSetting); 
    }

    A.defineModel = window.defineModel = defineModel;
})(Camellia);
(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    function defineView(className, viewClassSetting, isNativeOrPlugin) {
        var _classSetting = A.extend({}, viewClassSetting);

        _classSetting.viewClassName = className;

        for ( var key in _classSetting ) {
            if ( core.moduleFactory.get('view').prototype[ key ] ) {
                if ( key !== 'init' && key !== 'render' && key !== 'destroy' && key !== 'template' && key !== 'templateUrl' ) {
                    throw new Error('Class definition error. ' + key + ' in ' + className + ' is predefined keyword.');
                }
            }
        }

        function userView() {
            if ( userView._super_proto_ !== undefined ) {
                userView._super_constructor(this, arguments);
            }
        }

        userView.prototype.construct = function() {
        };

        if( !A.isNil(_classSetting.destroy)) {
            userView.prototype.userDestroy = _classSetting.destroy;
            delete _classSetting.destroy;

        }


        A.extendif(userView.prototype, _classSetting);

        A.inherit(userView, core.moduleFactory.get("view"));

        if ( isNativeOrPlugin ) {
            core.moduleFactory.register(className, userView, { type: 'view', className: className, isNative: true, contextPath : '/' });
        } else {
            _A.define(className, userView, { type: "view", className: className, isNative: false });
        }
    }

    A.defineView = window.defineView = defineView;
})(Camellia);


(function (_A) {
    var core = _A.core;

    if ( A.runAttributes.noframework ) {  
        return;
    }

    var instanceIDPrefix = 'V';

    function makeIDHierarhcyArray(id) {
        return A.replace(id, instanceIDPrefix, '').split('.');

    }

    function InstanceNode(viewInstance, childNodeID) {
        this.viewInstanceID = childNodeID;
        this.viewInstance = viewInstance;
        this.idHierarchy = makeIDHierarhcyArray(this.viewInstanceID);
        this.childNodes = [];
        this.childAppendCount = 0;

        this.viewInstance._setViewInstanceID(this.viewInstanceID);

        this.addChildNode = function (node) {
            this.childNodes.push(node);
            this.childAppendCount++;
        }

        this.popChildNode = function (instanceID) {
            return A.remove(this.childNodes, function (node) {
                return node.viewInstanceID == instanceID;
            })[ 0 ];
        }

        this.popAllChildNode = function () {
            var childNodes = this.childNodes;
            this._clearChildNodes();
            return childNodes;
        }

        this._clearChildNodes = function () {
            this.childNodes = [];
        }

        this.destroy = function () {
            this.viewInstance.runDestroyStep();
            this.viewInstance = null;
            this.idHierarchy = [];
            this.viewInstanceID = '';
            this._clearChildNodes();
        }
    }

    function InstanceTree() {
        this._rootNode = null;
    }

    InstanceTree.prototype.setRootNode = function (rootViewInstance) {
        this._rootNode = new InstanceNode(rootViewInstance, instanceIDPrefix + '0');
    };
    InstanceTree.prototype.getRootNode = function () {
        return this._rootNode;
    }
    InstanceTree.prototype.addNode = function (viewInstance, parentNodeID) {
        var parentViewNode, childNodeID, circularDependencyChecker;

        parentViewNode = this.findNode(parentNodeID);


        childNodeID = parentViewNode.viewInstanceID + '.' + parentViewNode.childAppendCount;

        parentViewNode.addChildNode(new InstanceNode(viewInstance, childNodeID));
    };

    InstanceTree.prototype.removeNode = function (targetInstanceID) {
        var parentNode, targetNode;

        parentNode = this.findNode(core.util.view.parseParentViewInstanceID(targetInstanceID));

        A.assert(!A.isNil(parentNode), '[ViewInstanceContainer] Cannot find the target instance. viewInstanceID : ', targetInstanceID);

        targetNode = parentNode.popChildNode(targetInstanceID);

        A.assert(!A.isNil(parentNode), '[ViewInstanceContainer] Cannot find the target instance. viewInstanceID : ', targetInstanceID);

        this._runDestroyNodes(this._makeBackwardNodeStack([ targetNode ]));
    };

    InstanceTree.prototype.removeAllChildNode = function (targetInstanceID) {
        var targetNode, childNodes;

        targetNode = this.findNode(targetInstanceID);

        A.assert(!A.isNil(targetNode), '[ViewInstanceContainer] Cannot find the target instance. viewInstanceID : ', targetInstanceID);

        childNodes = targetNode.popAllChildNode();

        this._runDestroyNodes(this._makeBackwardNodeStack(childNodes))
    };

    InstanceTree.prototype.findNode = function (instanceID, circularDependencyChecker) {
        var found = null,
            currentNode = null,
            targetNodeStack = [],
            targetInstanceIDHierarchy = makeIDHierarhcyArray(instanceID);

        currentNode = this._rootNode;

        while ( !A.isNil(currentNode) ) {

            if(circularDependencyChecker) {
                circularDependencyChecker.run(currentNode.viewInstance);
            }

            if ( currentNode.viewInstanceID == instanceID ) {
                found = currentNode;
                break;
            }

            if ( currentNode.idHierarchy.length == targetInstanceIDHierarchy.length ) {
                break;
            }

            currentNode = this._findCandidateNode(targetInstanceIDHierarchy, currentNode)
        }


        return found;
    };



    InstanceTree.prototype.displayTree = function () {
        var currentNode = null,
            printStack = [];

        printStack.push(makePrintData(this._rootNode, 0));

        console.log("------------ View Instance Tree Structure ------------");
        while ( printStack.length > 0 ) {

            var current = printStack.pop();
            var dash = makeDash(current);

            console.log(dash + current.viewClassName + ' | ' + current.viewInstanceID + ' | ' + current.state);

            if ( current.node.childNodes.length > 0 ) {
                A.forEachRight(current.node.childNodes, function (node, index) {
                    printStack.push(makePrintData(node, current.depth + 1));
                })
            }
        }

        console.log("--------------------------------------------------------")

        function makePrintData(node, depth) {
            printData = {};
            printData.depth = depth;
            printData.viewClassName = node.viewInstance.getClassName();
            printData.viewInstanceID = node.viewInstanceID;
            printData.state = node.viewInstance.getState();
            printData.node = node;

            return printData;
        }

        function makeDash(printData) {
            var result = '',
                dash = '─';

            if ( printData.depth == 0 ) {
                return '';
            }

            for ( var i = 0, len = printData.depth; i < len; i++ ) {
                result += ' ';
            }

            result += dash;

            return result;
        }

    };

    InstanceTree.prototype._runDestroyNodes = function (removeNodeStack) {
        while ( removeNodeStack.length > 0 ) {
            targetNode = removeNodeStack.pop();
            targetNode.destroy();
        }
    };

    InstanceTree.prototype._makeBackwardNodeStack = function (nodes) {
        var backwardNodeStack = [],
            traversingQueue = [],
            currentNode;

        A.forEach(nodes, function (node) {
            traversingQueue.push(node);
        })

        while ( traversingQueue.length > 0 ) {
            currentNode = traversingQueue.shift();

            A.forEach(currentNode.childNodes, function (node) {
                traversingQueue.push(node);
            });

            backwardNodeStack.push(currentNode);
        }

        return backwardNodeStack;
    };

    InstanceTree.prototype._findCandidateNode = function (targetInstanceIDHierarchy, currentNode) {
        var comparePosition = currentNode.idHierarchy.length;

        return A.find(currentNode.childNodes, function (node) {
            return node.idHierarchy[ comparePosition ] == targetInstanceIDHierarchy[ comparePosition ];
        });
    };


    InstanceTree.prototype._getCircularDependencyChecker = function (childViewInstance) {
        return {
            childViewInstance : childViewInstance,
            _foundCircularDependency : false,
            _reason  : { viewClassName : '', viewInstanceID:''},
            foundCircularDependency : function() {
                return this._foundCircularDependency;
            },

            getReason : function() {
                return this._reason;
            },

            run : function(parentViewInstance) {
                if(this._foundCircularDependency) {
                    return;
                }
                if ( parentViewInstance.getClassName() === this.childViewInstance.getClassName()) {
                    this._foundCircularDependency = true;
                    this._reason.viewClassName = parentViewInstance.getClassName();
                    this._reason.viewInstanceID = parentViewInstance.getViewInstanceID();
                    this._reason.html = parentViewInstance.getHost()[0 ].outerHTML;
                }
            }
        }

    }

    function viewInstanceContainer() {
        this._viewTree = new InstanceTree();
        var viewCount = 0;
    }

    viewInstanceContainer.prototype.construct = function () {
    };

    viewInstanceContainer.prototype._makeViewConstructorArguments = function (element, viewClassName, viewInitParam) {
        return {
            element: element,
            viewClassName: viewClassName,
            initParam: viewInitParam
        }
    };

    viewInstanceContainer.prototype.createViews = function (parentView, viewItems, viewInitParam) {
        var parentViewInstanceID = parentView.getViewInstanceID(),
            newView,
            viewInstanceQueueWaitingToBeInstantiated = [];


        A.forEach(viewItems, function (item) {
            newView = this._createView(this._makeViewConstructorArguments(item.element, item.viewClassName, viewInitParam));

            if ( !this._hasViewErrorState(newView) ) {
                this._viewTree.addNode(newView, parentViewInstanceID);
                viewInstanceQueueWaitingToBeInstantiated.push(newView);
            }
        }.bind(this));

        A.forEach(viewInstanceQueueWaitingToBeInstantiated, function (view) {
            view = viewInstanceQueueWaitingToBeInstantiated.shift();

            view.runInstantiationStep();

            if ( this._hasViewErrorState(view) ) {
                this.destroyView(view.getViewInstanceID());
            }
        }.bind(this));
    };

    viewInstanceContainer.prototype.createView = function (parentView, viewItem, viewInitParam) { 
        this.createViews(parentView, [ viewItem ], viewInitParam);
    };

    viewInstanceContainer.prototype._createView = function (viewConstructorArguments) { 
        var view;
        try {
            view = core.moduleFactory.createModule(viewConstructorArguments.viewClassName, viewConstructorArguments);
        } catch ( e ) {
            throw new Error('[ViewInstanceContainer]' + viewConstructorArguments.viewClassName + " class is not defined. Please, check a JavaScript file is properly loaded with include or loadResource function.");
        }
        return view;
    };

    viewInstanceContainer.prototype._hasViewErrorState = function (viewInstance) {
        return viewInstance.getState() == viewInstance.STATE_DESTROYED || viewInstance.getState() == viewInstance.STATE_ERROR
    }

    viewInstanceContainer.prototype.createRootView = function () {
        A.assert(A.isNil(this._viewTree._rootNode), "[ViewInstanceContainer] Root is already instantiated.");

        var rootView = this._createView(this._makeViewConstructorArguments(window.document.getElementsByTagName('body')[ 0 ], 'aui.rootView'));

        this._viewTree.setRootNode(rootView);

        rootView.runInstantiationStep();
    };

    viewInstanceContainer.prototype.destroyView = function (targetInstanceID, parentNode) {
        this._viewTree.removeNode(targetInstanceID);
    };

    viewInstanceContainer.prototype.destroyAllChildView = function (targetInstanceID) {
        this._viewTree.removeAllChildNode(targetInstanceID);
    };

    viewInstanceContainer.prototype.displayTree = function () {
        this._viewTree.displayTree();
    };

    viewInstanceContainer.prototype.getRootView = function () {
        var rootNode = this._viewTree.getRootNode();

        if ( !A.isNil(rootNode) ) {
            return rootNode.viewInstance
        }

        return null;
    };

    viewInstanceContainer.prototype.getChildViews = function (instanceId) {
        var foundNode = this._viewTree.findNode(instanceId),
            result = [];

        A.forEach(foundNode.childNodes, function(node) {
            result.push(node.viewInstance);
        })

        return result;
    };

    viewInstanceContainer.prototype.getViewByID = function (instanceId) {
        var foundNode = this._viewTree.findNode(instanceId),
            result = null;

        if ( !A.isNil(foundNode) ) {
            result = foundNode.viewInstance;
        }

        return result;
    };

    core.moduleFactory.register('viewInstanceContainer', viewInstanceContainer);
})(Camellia);
(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }
    function communicationChannel() {
        this._subscriptionMap = {};
    }


    communicationChannel.prototype.construct = function() {
    };

    communicationChannel.prototype._isAlreadySubscripting = function(targetViewInstance, key) {

        var viewInfoList = this._subscriptionMap[ key ];

        if ( !viewInfoList ) {
            return false;
        }

        for ( var i = 0, max = viewInfoList.length; i < max; i++ ) {
            if ( viewInfoList[ i ].viewInstance.getViewInstanceID() === targetViewInstance.getViewInstanceID() ) {
                return true;
            }
        }

        return false;
    };

    communicationChannel.prototype.subscribe = function(viewInstance, key, func) {
        if ( !this._subscriptionMap[ key ] ) {
            this._subscriptionMap[ key ] = [];
        }

        this._subscriptionMap[ key ].push({
            viewInstance: viewInstance,
            callback: func
        });
    };

    communicationChannel.prototype.unsubscribe = function(targetViewInstance, key) {
        var subscriptions = this._subscriptionMap[ key ];

        if ( A.isNull(subscriptions) ) {
            A.debug("[CommunicationChannel] Cannot unsubscribe because key is not found in the subscription list.");
            throw new Error("[CommunicationChannel] Cannot unsubscribe because key is not found in the subscription list.");
        }


        A.remove(subscriptions, function(subscription) {
            return subscription.viewInstance.getViewInstanceID() === targetViewInstance.getViewInstanceID();
        });
    };

    communicationChannel.prototype.publish = function(key, message) {
        var args = Array.prototype.slice.call(arguments);
        var subscriptions;

        subscriptions = this._subscriptionMap[ key ];

        if ( !subscriptions || subscriptions.length == 0 ) {
            return false;
        }

        A.forEach(subscriptions, function(subscription, index) {
            if(!A.isNil(subscription))  { 
                subscription.callback.apply(subscription.viewInstance, args.slice(1));
            }
        });

        return true;
    };

    communicationChannel.prototype.sendMessageByElement = function(element, funcName, message) {
        var args = Array.prototype.slice.call(arguments);
        var targetInstance = core.viewInstanceContainer.getViewByID(core.util.view.getViewInstanceIDFromElement(element));

        if ( A.isNil(targetInstance) ) {
            A.debug("Fail to sendViewMessage. View is not found. ", element);
            throw new Error("Fail to sendViewMessage. View is not found." );
        }

        if ( !targetInstance.__proto__.hasOwnProperty(funcName) ) {
            A.debug("Fail to sendViewMessage. View's callback function is not found - " + funcName);
            throw new Error("Fail to sendViewMessage. View's callback function is not found - " + funcName);
        }

        targetInstance[ funcName ].apply(targetInstance, args.slice(2));
    };


    core.moduleFactory.register('communicationChannel', communicationChannel);
})(Camellia);


(function (_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    A.inherit(view, core.moduleFactory.get('ModuleObject'));

    function view(viewContstructorArguments, moduleContext) {
        if ( view._super_proto_ !== undefined ) {
            view._super_constructor(this, arguments);
        }

        var that = this;

        this._view = {
            initParam: viewContstructorArguments.initParam,
            type: view.prototype.AUI_VIEW_CONST.VIEW_TYPE_DEFAULT,

            $host: null,
            viewInstanceID: '',
            viewClassName: '',

            subscriptions: [],
            eventMap: {},
            widgets: [],

            cachedFoundElements : {},

            localize: {
                language: "",
                element: []
            },

            i18nBindItemPool: [],  
            bindModelPool: [], 
            modelInstancePool: {},
            bindInfoPool: {},

            moduleContext: moduleContext,

            viewModel: null,

            state: this.STATE_PREPARING,
        };

        this._view.viewClassName = viewContstructorArguments.viewClassName;
        this._view.modelInstancePool = {};
        this._view.$host = $(viewContstructorArguments.element);
        this._view.viewModel = this._createViewModel();
    }

    A.extendif(view.prototype,
        {

            construct: function () {
            },

            _context: null, 

            init: function (initParam) {
                return null;
            },

            render: function () {
                return null;
            },

            destroy: function () {
                core.viewInstanceContainer.destroyView(this.getViewInstanceID());
            },

            _createViewModel: function () {
                return core.moduleFactory.createModule('ViewModel');
            },

            getViewModel: function () {
                return this._view.viewModel;
            },

            getBindModel: function (element, attributeName) {
                if ( element instanceof jQuery ) { 
                    element = element[ 0 ];
                } else if ( A.isString(element) ) { 
                    element = $(element)[ 0 ];
                }

                return this._getBindModel(element, attributeName);
            },

            _getBindModel: function (param_element, param_attributeName) {
                var ret = [];

                function isExistBindModel(bindModel) {
                    for ( var i = 0; i < ret.length; i++ ) {
                        if ( ret[ i ] === bindModel ) {
                            return true;
                        }
                    }
                    return false;
                }

                function hasAttribute(attrBindInfo, attrName) {
                    if ( !A.isNil(attrBindInfo) ) {
                        if ( A.isArray(attrBindInfo) ) { 
                            for ( var i = 0; i < attrBindInfo.length; i++ ) {
                                var attrObj = attrBindInfo[ i ];
                                for ( var a in attrObj ) {
                                    if ( attrName == a ) {
                                        return true;
                                    }
                                }
                            }
                        } else if ( A.isPlainObject(attrBindInfo) ) { 
                            for ( var a in attrBindInfo ) {
                                if ( attrName == a ) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }

                for ( var i = 0; i < this._view.bindModelPool.length; i++ ) {
                    var bindModel = this._view.bindModelPool[ i ];
                    var bindModel_elements = bindModel.targets;          
                    var bindModel_attrBindInfo = bindModel.attrBindInfo; 

                    if ( !A.isNil(param_element) ) {
                        for ( var j = 0; j < bindModel_elements.length; j++ ) {

                            if ( A.isNil(param_attributeName) ) {
                                if ( param_element === bindModel_elements[ j ]
                                    && !isExistBindModel(bindModel) ) {
                                    ret.push(bindModel);
                                }
                            } else {
                                if ( param_element === bindModel_elements[ j ]
                                    && hasAttribute(bindModel_attrBindInfo, param_attributeName)
                                    && !isExistBindModel(bindModel) ) {
                                    ret.push(bindModel);
                                }
                            }

                        }
                    }
                }

                return ret;
            },

            getState: function () {
                return this._view.state;
            },
            _setState: function (state) {
                this._view.state = state;
            },

            getChildViews: function () {
                return core.viewInstanceContainer.getChildViews(this.getViewInstanceID());
            },

            _publishViewUpdating: function () {
                this.publish(this.VIEW_UPDATING, {
                    viewClassName: this.getClassName(),
                    viewInstanceID: this.getViewInstanceID()
                });
            },

            _publishViewUpdateComplete: function () {
                this.publish(this.VIEW_UPDATE_COMPLETE, {
                    viewClassName: this.getClassName(),
                    viewInstanceID: this.getViewInstanceID()
                });
            },

            getViewInstanceID: function () {
                return this._view.viewInstanceID;
            },

            _setViewInstanceID: function (id) {
                if ( A.isEmpty(this._view.viewInstanceID.trim()) ) {
                    this._view.viewInstanceID = id;

                    if ( A.runAttributes.debug ) {
                        this.getHost().attr(core.DDA_VIEW_INST_ID, id);
                    }

                    this.getHost()[ 0 ].viewInstanceID = id;
                }
            },

            getParentViewInstanceID: function () {
                return core.util.view.parseParentViewInstanceID(this.getViewInstanceID());
            },

            getClassName: function () {
                return this._view.viewClassName;
            },

            getParentView: function () {
                return core.viewInstanceContainer.getViewByID(this.getParentViewInstanceID());
            },

            _getModelInstance: function (modelClassName) {
                if ( !this._view.modelInstancePool[ modelClassName ] ) {
                    throw new Error("ModelClass(" + modelClassName + ") does not exist in View's ModelInstancePool");
                }
                return this._view.modelInstancePool[ modelClassName ];

            },

            _setViewType: function (type) {
                this._view.type = type;
            },

            _getViewType: function () {
                return this._view.type;
            }
        });

    A.extendif(view.prototype,
        {
            find: function (where, isReSearch) {
                var findUid, targetObj, foundJqueryObject, isJqueryLoaded = !A.isNil(window.jQuery), isCacheableSearch;
                isCacheableSearch = core.page.getConfig('cacheableSelector') || false; 
                isCacheableSearch = A.isBoolean(this.cacheableSelector) ? this.cacheableSelector : isCacheableSearch; 

                if(isJqueryLoaded) {
                    if(A.isString(where)) {
                        foundJqueryObject = this.getHost().find(where);
                        if(foundJqueryObject.length > 0) { 
                            foundJqueryObject[0]._findUid = foundJqueryObject[0]._findUid || A.generateUUID();
                            findUid = foundJqueryObject[0]._findUid;
                            targetObj = foundJqueryObject;
                        }
                    } else if(where instanceof jQuery && where.length > 0) {
                        where[0]._findUid = where[0]._findUid || A.generateUUID();
                        findUid = where[0]._findUid;
                        targetObj = where;
                    }
                } else if(where instanceof Element) {
                    where._findUid = where._findUid || A.generateUUID();
                    findUid = where._findUid;
                    targetObj = where;
                }

                if(isCacheableSearch) {
                    if(isReSearch ||
                        A.isNil(this._view.cachedFoundElements[findUid]) ||
                        (isJqueryLoaded && this._view.cachedFoundElements[findUid] instanceof jQuery && this._view.cachedFoundElements[findUid].length == 0)) {

                        this._view.cachedFoundElements[findUid] = this.getHost().find(targetObj);
                    }
                    return this._view.cachedFoundElements[findUid];
                }
                return this.getHost().find(where);
            },



            getChildViewCount: function () {
                return this.getChildViews().length;
            },

            createView: function (viewClassName, viewInitParam) {
                A.debug("[WARN][Experiment] createView is an experimental function.");

                var $viewTemplate = $('<div {0}="'.format(core.DDA_VIEW) + viewClassName + '">');

                core.viewInstanceContainer.createView(this, {
                    viewClassName: viewClassName,
                    element: $viewTemplate[ 0 ]
                }, viewInitParam);

                return core.viewInstanceContainer.getViewByID(core.util.view.getViewInstanceIDFromElement($viewTemplate[ 0 ]));
            },
            findView: function (where) {
                var targetInstanceID = core.util.view.getViewInstanceIDFromElement($(where)[ 0 ]),
                    found = core.viewInstanceContainer.getViewByID(targetInstanceID);
                if ( A.isNil(found) ) {
                    return null;
                }
                return found;
            },
            hasView: function (where) {
                var $where = this.find(where);
                if ( $where.length == 0 ) {
                    return false;
                }
                return $where[ 0 ].hasAttribute(core.DDA_VIEW_INST_ID);
            },

            removeAllView: function () {
                core.viewInstanceContainer.destroyAllChildView(this.getViewInstanceID()); 
            },

            removeView: function (path) {
                var $target = this.find(path),
                    instanceId = '',
                    instance = null;

                A.assert($target.length > 0, 'Cannot find a view instance. Fail to destroy the target view.');

                instanceId = core.util.view.getViewInstanceIDFromElement($target[ 0 ]);

                A.assert(instanceId, 'Cannot find a view instance. Fail to destroy a target view.');

                core.viewInstanceContainer.destroyView(instanceId);
            },
            getHost: function () {
                return this._view.$host;
            },
            hasModel: function (modelClassName) {
                if ( this._view.modelInstancePool[ modelClassName ] ) {
                    return true;
                }

                return false;
            },
            _findAppendPosition: function (where) {
                var $where = this.getHost();

                if ( where ) {
                    $where = this.find(where);
                }
                return $where;
            },

            showView: function() {
                this.getHost().show();
                this.fire(this.SHOW);
            },

            hideView: function() {
                this.getHost().hide();
                this.fire(this.HIDE);
            },

            prependView: function(viewClassName, where, viewInitParam, attributes) {
                var attributesStr = '';
                var viewTemplate = '';

                if( !A.isNil(attributes)) {
                    A.forEach(attributes, function(value, key){
                        attributesStr += key + '="' + value + '"' ;
                    })
                }

                viewTemplate = '<div {0}="'.format(core.DDA_VIEW) + viewClassName + '"' + attributesStr + '>';

                var $viewTemplate = $(viewTemplate)
                this.prependTemplate($viewTemplate, where, viewInitParam);

                return core.viewInstanceContainer.getViewByID($viewTemplate[0].viewInstanceID);
            },

            prependTemplate: function(templateStr, where, viewInitParam){ 
                var $where = this.find(where), 
                    $wrapper = $("<div>");

                A.assert($where.length != 0, 'Fail to append view instance. Path is not found - ', where);

                $wrapper.append(templateStr);
                $where.before($wrapper);

                core.builder._build(this, core.parser.parse($wrapper[ 0 ]), viewInitParam);

                $where.before($wrapper.children().detach());
                $wrapper.remove();
            },

            replaceView: function (viewClassName, viewInitParam, attributes) {  
                var attributesStr = '';
                var viewTemplate = '';

                if( !A.isNil(attributes)) {
                    A.forEach(attributes, function(value, key){
                        attributesStr += key + '="' + value + '"' ;
                    })
                }

                viewTemplate = '<div {0}="'.format(core.DDA_VIEW) + viewClassName + '"' + attributesStr + '>';

                var parentView = this.getParentView();
                var appendPoint = null;

                var $currentViewSel = this.getHost();

                var $nextSibling = $currentViewSel.next();

                var $template = $(viewTemplate);

                if ( $nextSibling.length == 1 ) {
                    parentView.prependTemplate($template, $nextSibling, viewInitParam, attributes);
                } else {
                    var $parent = $currentViewSel.parent();

                    if ( _.isNil($parent[ 0 ].viewInstanceID) ) {
                        appendPoint = $parent;
                    }

                    parentView.appendTemplate($template, appendPoint, viewInitParam, attributes);
                }
                this.destroy();

                return core.viewInstanceContainer.getViewByID($template[0].viewInstanceID);
            },

            appendView: function (viewClassName, where, viewInitParam, attributes,  historyContext) {
                var template = '',
                    attributesStr = '',
                    $where = null;

                if( !A.isNil(attributes)) {
                    A.forEach(attributes, function(value, key){
                        attributesStr += key + '="' + value + '"' ;
                    })
                }

                template = '<div {0}="'.format(core.DDA_VIEW) + viewClassName + '"' + attributesStr + '>';

                var $template = $(template);

                this.appendTemplate($template, where, viewInitParam, historyContext);

                return core.viewInstanceContainer.getViewByID($template[0].viewInstanceID);
            },

            appendTemplate: function (htmlStr, where, viewInitParam, historyContext) {
                var $div = $("<div>");
                $div.html(htmlStr);

                var _firstViewDOM = core.util.$dom.findFirstView($div);

                if ( !A.isNull(_firstViewDOM) ) {
                    var viewClassName = core.util.dom.getViewClass(_firstViewDOM); 
                    core.page.getHistory().pushHistory(this, viewClassName, where, viewInitParam, historyContext);
                }

                this._appendTemplate(htmlStr, where, viewInitParam);
            },

            _appendTemplate: function (htmlStr, where, viewInitParam) {
                var $where = this._findAppendPosition(where),
                    $wrapper = $("<div>");

                A.assert($where.length != 0, 'Fail to append view instance. Path is not found - ', where);

                $wrapper.append(htmlStr);
                $where.append($wrapper);

                core.builder._build(this, core.parser.parse($wrapper[ 0 ]), viewInitParam);

                $where.append($wrapper.children().detach());
                $wrapper.remove();
            },

            createModel: function (modelClassName, initializeParams) {
                var aframe = core.page.getFrame(),
                    modelClass = core.moduleFactory.get(modelClassName),
                    modelTargets = [ {
                        modelClassName: modelClassName
                    } ];

                if ( !modelClass ) {
                    throw new Error("ModelClass (" + modelClassName + ") is null or undefined.");
                }

                if ( !modelClass.sharable ) {
                    if ( this.hasModel(modelClassName) ) {
                        throw new Error("ModelClass (" + modelClassName + ") has already existed in view.");
                    }
                }

                core.builder._createModel(this, modelTargets, initializeParams);

                if ( modelClass.sharable ) {
                    return aframe.getSharableModelInstance(modelClassName);
                } else {
                    return this._getModelInstance(modelClassName);
                }
            },

            destroyModel: function(modelInstance) {
                var modelClassSetting = modelInstance._getModelClassDefinition();

                if ( !this.hasModel(modelClassSetting.className) ) {
                    throw new Error('ModelClass(' + modelClassSetting.className + ') does not exist.');
                }

                delete this._view.modelInstancePool[ modelClassSetting.className ];

                modelInstance._destroy();
            },

            getModel: function (modelClassName) {
                var aframe = core.page.getFrame();
                var loader = core.loader;
                var modelClass = loader.find(modelClassName);

                if ( !aframe ) {
                    throw new Error("AFrame is null or undefined.");
                }

                if ( !modelClass ) {
                    throw new Error("ModelClass (" + modelClassName + ") is null or undefined.");
                }

                if ( modelClass.sharable ) {
                    if ( !aframe.hasSharableModel(modelClassName) ) {
                        return null;
                    }

                    return aframe.getSharableModelInstance(modelClassName);
                } else {
                    if ( !this.hasModel(modelClassName) ) {
                        return null;
                    }

                    return this._getModelInstance(modelClassName);
                }
            },

            registerModel: function (modelInstance) {
                var modelClassSetting = modelInstance._getModelClassDefinition();

                if ( this.hasModel(modelClassSetting.className) ) {
                    throw new Error("ModelClass(" + modelClassSetting.className + ") has already existed in View's ModelInstancePool");
                }

                this._view.modelInstancePool[ modelClassSetting.className ] = modelInstance;
            },

            _createBindInfo: function(bindInfo, controlFlag) {
                var bindInfoInstance =  core.moduleFactory.createModule("bindInfo", {
                    bindingInfo: bindInfo,
                    controlFlag: controlFlag
                });

                return bindInfoInstance;
            },

            createBindModel: function (bindInfo_) {
                var bndmodel = null;

                if ( bindInfo_ ) {

                    if ( A.isNil(bindInfo_[ "model" ]) ) {
                        throw new Error("model is undefined or null");
                    }

                    var bndmodelType = bindInfo_[ "bindmodel" ] || bindInfo_[ "model" ].getModelType(),
                        options = {
                            src: bindInfo_[ "model" ].getDataset(),
                            targets: bindInfo_[ "target" ] ? [ bindInfo_[ "target" ] ] : [],
                            dataBindKey: bindInfo_[ "bindKey" ] || bindInfo_[ "bindkey" ]
                        };

                    if ( bndmodelType.indexOf("bindmodel") == -1 ) {
                        bndmodelType = "bindmodel" + '.' + bndmodelType;
                    }

                    bndmodel = A.createModule(bndmodelType, options);
                    this._registerBindModel(bndmodel);
                }

                return bndmodel;
            },

            removeBind: function(path, bindType) {
                A.assert(path && bindType, 'invalid arguments');

                var $widget = this.find(path), findUid, bindInfoInstance;

                A.assert($widget.length > 0, 'Cannot find widget instance.');

                var getWidgetName = function(widgets, uid) {
                    for ( var idx = 0, len = widgets.length; idx < len; idx++ ) {
                        if ( widgets[ idx ].$dom && widgets[ idx ].$dom[ 0 ]._findUid == uid ) {
                            return widgets[ idx ].widgetName;
                        }
                    }
                };

                findUid = $widget[ 0 ]._findUid;
                bindInfoInstance = this._view.bindInfoPool[ findUid ];
                var widgetName = getWidgetName(this._view.widgets, findUid), newDataBinders = {};

                if (A.isNil(bindInfoInstance)) {
                    A.debug('There is no [bindType: ' + bindType + '] binding.');
                }

                if ( A.indexOf([ 'jqxGrid', 'jqxDataTable', 'jqxTreeGrid' ], widgetName) > -1 ) {
                    $widget[ widgetName ]({ '$bindmodel$': null });

                } else {
                    newDataBinders[ bindType ] = null;
                    $widget[ widgetName ]({ '$dataBinders$': newDataBinders });
                }
            },

            setBind: function(path, bindInfo) {
                var $widget = this.find(path), findUid, bindInfoInstance, widgetName;

                A.assert($widget.length > 0, 'Cannot find widget instance.');

                var getWidgetName = function(widgets, uid) {
                    for ( var idx = 0, len = widgets.length; idx < len; idx++ ) {
                        if ( widgets[ idx ].$dom && widgets[ idx ].$dom[ 0 ]._findUid == uid ) {
                            return widgets[ idx ].widgetName;
                        }
                    }
                };

                findUid = $widget[ 0 ]._findUid;
                bindInfoInstance = this._view.bindInfoPool[ findUid ];
                widgetName = getWidgetName(this._view.widgets, findUid);

                var newDataBinders = {};

                if ( A.isNil(bindInfoInstance) ) {
                    var biArray = [];

                    if ( !A.isArray(bindInfo) ) {
                        biArray.push(bindInfo);
                    } else {
                        biArray = bindInfo;
                    }

                    bindInfoInstance = this._createBindInfo(biArray, true);
                    this._view.bindInfoPool[ findUid ] = bindInfoInstance;
                    newDataBinders = bindInfoInstance.getDataBinders();
                } else {

                    newDataBinders = bindInfoInstance.set(bindInfo);
                }

                if ( A.indexOf([ 'jqxGrid', 'jqxDataTable', 'jqxTreeGrid' ], widgetName) > -1 ) {
                    $widget[ widgetName ]({ '$bindmodel$': bindInfoInstance.getBindModels()[ 0 ] });

                } else {
                    $widget[ widgetName ]({ '$dataBinders$': newDataBinders });
                }
            },

            createWidget: function (path, widgetName, widgetSetting, bindInfo_) {
                var aframe = core.page.getFrame();

                widgetSetting = widgetSetting || {};

                var $target = this.find(path);

                if ( $target.length == 0 ) {
                    A.debug('Cannot find ' + path + ' in ' + this.getClassName() + ' scope.');
                    return $target;
                }

                if ( bindInfo_ ) {
                    var bindInfo = [],
                        sourceBindingList = [ 'jqxMenu', 'jqxTree', 'jqxListBox', 'jqxComboBox', 'jqxDropDownList' ],
                        exceptBindingList = [ 'jqxGrid', 'jqxDataTable', 'jqxTreeGrid' ]; 

                    if ( !A.isArray(bindInfo_) ) {
                        var newBindInfo = {
                            'model': bindInfo_[ 'model' ],
                            'bindKey': bindInfo_[ 'bindkey' ] || bindInfo_[ 'bindKey' ],
                            'bindmodel': bindInfo[ 'bindmodel' ]
                        };

                        if ( A.indexOf(sourceBindingList, widgetName) > -1 ) {
                            newBindInfo[ 'type' ] = 'source';
                        } else {
                            newBindInfo[ 'type' ] = 'value';
                        }

                        bindInfo.push(newBindInfo);
                    } else {
                        bindInfo = bindInfo_;
                    }

                    var bindInfoInstance = this._createBindInfo(bindInfo, true),
                        _findUID = $target[ 0 ]._findUid;

                    this._view.bindInfoPool[ _findUID ] = bindInfoInstance;

                    if ( A.indexOf(exceptBindingList, widgetName) > -1 ) {
                        widgetSetting[ '$bindmodel$' ] = bindInfoInstance.getBindModels()[ 0 ];
                    } else {
                        widgetSetting[ '$dataBinders$' ] = bindInfoInstance.getDataBinders();
                    }
                }

                if ( !$target[ widgetName ] ) {
                    A.debug('Cannot find widget - ' + widgetName);
                    return $target;
                }

                var widgetIndex = A.indexOf(core.page._i18n.widgets, widgetName);
                if ( widgetIndex > -1 ) {
                    widgetSetting[ 'localization' ] = core.page._i18n.getWidgetLocalization(widgetName);
                }

                var $widget = $target[ widgetName ](widgetSetting);
                var $widgetData = $widget.data();

                var widget = {
                    $dom: $widget,
                    widgetName: widgetName,
                    data: $widget.data()
                };

                this._view.widgets.push(widget);

                return $widget;
            },


            _registerBindModel: function (bndmodel) {
                this._view.bindModelPool = this._view.bindModelPool || [];

                this._view.bindModelPool.push(bndmodel);
            },

            destroyWidgets: function () {
                var that = this;
                A.forEachRight(this._view.widgets, function (widget) {
                    try {
                        widget.data.jqxWidget.destroy();
                    } catch ( e ) { 
                        A.debug('[WARN]' + that.getClassName() + " fail to destroy widgets. - " + widget.widgetName + ". Widgets created by 'createWidget' function should not be destroyed manually.");
                    }
                });

                this._view.widgets = [];
            },

            loadResource: function (urlOrList, successCallback) {
                var normalizedUrl = '',
                    urls = [],
                    actions = [],
                    newAction = null;

                if ( A.isString(urlOrList) ) {
                    urls.push(urlOrList);
                } else if ( A.isArray(urlOrList) ) {
                    urls = urlOrList;
                } else {
                    A.assert(false, 'First parameter type should be a string or an array');
                }

                A.forEach(urls, function (url, key) {

                    var url =  core.util.path.join(this._view.moduleContext.contextPath, url);
                    if(!url) {
                        throw new Error("[View] View's contextPath is not set by CamelliaJS F/W. If you define view as a plugin or native module, please, set isNative property true on your defineView function statements.")
                    }
                    newAction = core.moduleFactory.createModule("LEQBAction"
                        , "loadLayer"
                        , {url: url, async: true}
                    );

                    actions.push(newAction);
                }.bind(this));

                core.loadActionQueue.once('complete.' + this.getViewInstanceID(), function (event) {
                    if ( successCallback ) {
                        try{
                            successCallback.bind(this)();
                        } catch(e) {
                            core.page.fireApplicationError(e);
                        }
                    }
                }.bind(this), null, true);

                core.loadActionQueue.enqueue(actions);
            },

             refresh: function() {
                 this._publishViewUpdating();
                this._view.cachedFoundElements = [];

                for ( var bindmodel in this._view.bindModelPool ) {
                    this._view.bindModelPool[ bindmodel ].destroy();
                    this._view.bindModelPool[ bindmodel ] = null;
                }
                this._view.bindModelPool = [];

                for ( var bindInfo in this._view.bindInfoPool ) {
                    this._view.bindInfoPool[ bindInfo ].destroy();
                    this._view.bindInfoPool[ bindInfo ] = null;
                }
                this._view.bindInfoPool = [];

                this.removeAllView();
                this.destroyWidgets();

                this.getHost().empty();
                this.appendTemplate(this.template);

                if ( this.render ) {
                    this.render(this.getHost());
                }

                 this._publishViewUpdateComplete();
            }
        });

    core.moduleFactory.register("view", view);
})(Camellia);
(function (_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    A.extendif(core.moduleFactory.get('view').prototype, {
        runInstantiationStep: function () {
            var that = this;

            this._publishViewUpdating();

            try {
                if ( this.events && A.isPlainObject(this.events) ) {
                    for ( var key in this.events ) {
                        var eventFunc = this.events[ key ];
                        var eventName = this[ key ];

                        A.assert(!A.isUndefined(eventName), key + ' is not a proper event key of View instance.');

                        this.on(this[ key ], eventFunc, this, true);
                    }
                }

                var viewInitParam = this._view.initParam || {}; 
                viewInitParam.viewModel = this._view.viewModel;


                if ( !this._view.moduleContext.isNative ) {
                    if ( core.page._i18n.groupKeyMode == core.page._i18n.VIEWCLASS_GROUPKEY_MODE ) {
                        var i18nGroupKeyList = A.uniq(A.compact(A.concat([ this._view.viewClassName ], this.i18n)));

                        if ( !A.isEmpty(i18nGroupKeyList) ) {
                            core.page._i18n.loadSync(i18nGroupKeyList);
                        }
                    }
                }

                if(this.init){
                    this.init(viewInitParam);
                }

                if ( this.template ) {
                    this.getHost()[ 0 ].innerHTML = this.template;

                    core.page.getHistory().pushHistory(this, this._view.viewClassName, null);
                } else {
                    this.template = this.getHost().html();
                }

                var parsingResult = core.parser.parse(this.getHost()[ 0 ]);

                core.builder._build(this, parsingResult);  

                if ( !this._view.moduleContext.isNative ) {
                    if ( core.page._i18n.groupKeyMode == core.page._i18n.MANUAL_GROUPKEY_MODE ) {
                        if(this.i18n) {
                            core.page._i18n.enrollGroupKeys(this.i18n);
                        }
                        core.page._i18n.flushEnrollList(false);
                    }
                }

                if(this.render) {
                    this.render(this.getHost());
                }

                this._setState(that.STATE_INSTANTIATED);
                this.fire(this.READY, {viewInstanceID: this.getViewInstanceID()});
                this._publishViewUpdateComplete();


            } catch ( e ) {
                e.message = '[' + this.getClassName() + ']' + e.message;
                this._setState(this.STATE_ERROR);
                this._publishViewUpdateComplete(); 
                this.fire(this.ERROR, e); 
                A.application.fireApplicationError(e); 
            }
        },

        runDestroyStep: function () {
            if(this.userDestroy) {
                this.userDestroy();
            }
            this.destroyWidgets();
            this.unsubscribeAll();

            this.getHost().off().remove();

            this._view.$host = null;

            this._view.cachedFoundElements = null;

            for ( var bindmodel in this._view.bindModelPool ) {
                this._view.bindModelPool[ bindmodel ].destroy();
                this._view.bindModelPool[ bindmodel ] = null;
            }
            this._view.bindModelPool = null;

            for ( var bindInfo in this._view.bindInfoPool ) {
                this._view.bindInfoPool[ bindInfo ].destroy();
                this._view.bindInfoPool[ bindInfo ] = null;
            }
            this._view.bindInfoPool = null;

            for ( var modelInstance in this._view.modelInstancePool ) {
                if ( this._view.modelInstancePool[ modelInstance ]
                    && this._view.modelInstancePool.hasOwnProperty(modelInstance)
                    && this._view.modelInstancePool[ modelInstance ]._destroy
                    && typeof this._view.modelInstancePool[ modelInstance ]._destroy == 'function' ) {
                    this._view.modelInstancePool[ modelInstance ]._destroy();
                }
            }

            this.getViewModel().destroy();
            this._view.viewModel = null;
            this._view.modelInstancePool = null;
            this._setState(this.STATE_DESTROYED);
        }
    });
})(Camellia);


(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }
    var view = core.moduleFactory.get('view');

    view.prototype.AUI_VIEW_CONST = {};
    view.prototype.AUI_VIEW_CONST.VIEW_TYPE_DEFAULT = 'VIEW';
    view.prototype.AUI_VIEW_CONST.VIEW_TYPE_POPUP = 'POPUP_VIEW';               
    view.prototype.AUI_VIEW_CONST.EVENT = {};
    view.prototype.AUI_VIEW_CONST.EVENT.POPUP_CLOSE_REQUEST = 'AUI_POPUP_CLOSE_REQUEST';
    view.prototype.AUI_VIEW_CONST.EVENT.I18N_LANG_CHANGED = 'I18N_LANG_CHANGED';



    Object.defineProperties(view.prototype,
        {
        READY: {
            get: function () {
                return 'ready';
            }
        },
        ERROR: {
            get: function () {
                return 'error'
            }
        },

        SHOW: {
            get: function() {
                return 'show'
            }
        },
        HIDE: {
            get: function() {
                return 'hide'
            }
        },

        STATE_PREPARING: {
            get: function () {
                return 'preparing'
            }
        },
        STATE_INSTANTIATED: {
            get: function () {
                return 'instantiated'
            }
        },

        STATE_DESTROYED: {
            get: function () {
                return 'destroyed'
            }
        },
        STATE_ERROR: {
            get: function () {
                return 'error'
            }
        },

        "VIEW_TYPE_DEFAULT": {
            get: function() {
                return "VIEW";
            }
        }
        , "VIEW_TYPE_POPUP": {
            get: function() {
                return "POPUP_VIEW";
            }
        },

        VIEW_UPDATING: {
            get: function () {
                return 'viewUpdating'
            }
        },
        VIEW_UPDATE_COMPLETE: {
            get: function () {
                return 'viewUpdateComplete'
            }
        },

        "EVENT_POPUP_CLOSE_REQUEST": {
            get: function() {
                return "AUI_POPUP_CLOSE_REQUEST";
            }
        },

        "EVENT_I18N_LANG_CHANGED": {
            get: function() {
                return "I18N_LANG_CHANGED";
            }
        }
    });
})(Camellia);
(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    A.extendif(core.moduleFactory.get('view').prototype,
        {
        translate: function(key, substituteArray) {
            return core.page._i18n.translate(key, substituteArray, this._view.viewClassName);
        }
    });
})(Camellia);
(function (_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    A.extendif(core.moduleFactory.get('view').prototype,
        {
            _getEventHandler: function (eventName) {
                return this._view.eventMap[ eventName ];
            },

            _propagate: function (view, eventName, event, direction) {
                var goPropagation = true;
                var targetEventHandler = view._getEventHandler(eventName);

                if ( targetEventHandler ) {
                    goPropagation = targetEventHandler.apply(view, [ event ]);
                }

                if ( goPropagation === true || goPropagation === undefined ) {
                    view.emit(eventName, event, direction);
                }
            },

            emit: function (eventName, message, direction) { 
                var targetView = null;

                if ( direction == 'up' ) {
                    targetView = this.getParentView();

                    if ( targetView ) {
                        this._propagate(targetView, eventName, message, direction);
                    }
                } else {
                    var childViews = this.getChildViews();

                    for ( var i = 0, len = childViews.length; i < len; i++ ) {
                        targetView = childViews[ i ];

                        this._propagate(targetView, eventName, message, direction);
                    }
                }
            },

            emitAll: function(eventName, event) {
                var rootView = core.viewInstanceContainer.getRootView();
                rootView.emit(eventName, event);
            },

            listen: function(eventName, callback) {
                if ( eventName == '' || A.isNull(eventName) || A.isNull(callback) ) {
                    A.debug(this.getClassName() + " fail to listen. Required Parameter - eventName, callback");
                    throw new Error(this.getClassName() + " fail to listen. Required Parameter - eventName, callback");
                }

                this._view.eventMap[ eventName ] = callback;
            },

            _hasSubscription: function(key) {
                var hasSubscriptionKey = false;

                A.forEach(this._view.subscriptions, function(subscriptionKey) {

                    if ( subscriptionKey == key ) {
                        hasSubscriptionKey = true;
                        return false;
                    }
                });

                return hasSubscriptionKey;
            },

            subscribe: function(key, callback) {
                if ( key == '' || A.isNull(key) || A.isNull(callback) ) {
                    A.debug(this.getClassName() + " fail to subscribe. Required Parameter - key, callback");
                    throw new Error(this.getClassName() + " fail to subscribe. Required Parameter - key, callback");
                }

                if ( !this._hasSubscription(key) ) {
                    core.communicationChannel.subscribe(this, key, callback);

                    this._view.subscriptions.push(key);
                    return true;
                }

                return false;
            },

            unsubscribe: function(key) {
                if ( this._hasSubscription(key) ) {
                    core.communicationChannel.unsubscribe(this, key);
                    A.remove(this._view.subscriptions, function(keyCandidate) {
                        return keyCandidate == key;
                    });
                }
            },

            unsubscribeAll: function() {
                var that = this;
                A.forEach(this._view.subscriptions, function(key) {
                    core.communicationChannel.unsubscribe(that, key);
                });

                this._view.subscriptions = [];
            },

            publish: function(key, args) {
                var success = core.communicationChannel.publish.apply(core.communicationChannel, Array.prototype.slice.call(arguments));
                return success;
            },
            sendViewMessage: function(path, funcName, message) {
                var args = Array.prototype.slice.call(arguments);
                args[0] = $(path)[0];

                core.communicationChannel.sendMessageByElement.apply(this, args);
            }
        });
})(Camellia);
(function (_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    A.extendif(core.moduleFactory.get('view').prototype,
        {

            openPopupView: function(popupContentViewClass, popupSetting, viewInitParam) {
                var rootView = core.viewInstanceContainer.getRootView();

                var popupView = rootView.createPopupView(popupContentViewClass, popupSetting, viewInitParam, this.getViewInstanceID());

                popupView.openPopup();

                return popupView;
            },

            closePopupView: function() {
                if ( this._getViewType() === this.AUI_VIEW_CONST.VIEW_TYPE_POPUP ) {
                    this.closePopup();

                } else {
                    var event = {
                        callerViewInstanceID: this.getViewInstanceID(),
                        callerViewClassName: this.getClassName()
                    };

                    this.emit(this.AUI_VIEW_CONST.EVENT.POPUP_CLOSE_REQUEST, event, 'up');
                }
            },

            closeAllPopupView: function() {
                this.emitAll(this.AUI_VIEW_CONST.EVENT.POPUP_CLOSE_REQUEST);
            }

        });
})(Camellia);
(function (_A) {
    var core = _A.core;
    if (A.runAttributes.noframework) {
        return;
    }

    function ViewModel() {
        this._dataset = null;
    }

    A.extendif(ViewModel.prototype, {
        construct : function() {
            this._dataset = A.createModule('dataset.simple', {});
        },

        set : function (property, value) {
            if ( A.isUndefined(value) ) {
                throw new Error("property's value of ViewModel must not be undefined.");
            }
            if ( (A.isString(property) || A.isArray(property)) && !A.isNil(value) ) {
                if(!A.isArray(property)) {
                    property = [property];
                }
                this._dataset.set(property, value);
            } else {
                throw new Error("property or value of ViewModel is invalid.");
            }
        },

        get : function (property) {
            if(!A.isArray(property)) {
                property = [property];
            }
            return this._dataset.get(property);
        },

        remove : function (property) {
            if(!A.isArray(property)) {
                property = [property];
            }
            this._dataset.remove(property);
        },

        length : function () {
            return this._dataset.getCount();
        },

        isEmpty : function () {
            return this._dataset.getCount() == 0;
        },

        getKeys : function () {
            return this._dataset.getKeys();
        },

        getDataset : function() {
            return this._dataset;
        },

        destroy : function() {
            this._dataset.destroy();
        }
    });

    core.moduleFactory.register("ViewModel", ViewModel);
})(Camellia);

(function(_A) {

    var core = _A.core;
    if ( _A.runAttributes.noframework ) {
        return;
    }

    defineView('aui.popupView', {
        init: function(props) {
            var that = this;

            this.$popupContentViewProps = props.popupContentViewProps;

            this.$popupSetting = props.popupSetting;

            this.$preventKeydownEvent = this.$popupSetting.preventKeydownEvent == true || A.isNil(this.$popupSetting.preventKeydownEvent) ? true : false;

            this.$onOpen = this.$popupSetting.onOpen || function() {};
            this.$onClose = this.$popupSetting.onClose || function() {};
            this.$jqxWindow = null;

            this._setViewType(this.AUI_VIEW_CONST.VIEW_TYPE_POPUP);

            this.listen(this.AUI_VIEW_CONST.EVENT.POPUP_CLOSE_REQUEST, function(e) {
                that.closePopup();
                return false;
            });
        },

        render: function() {
            this.$renderPopupTemplate();
            this.$appendPopupContentView();
            this.$createJQXWindowWidget();
            this.$addJQXWindowWidgetEventHandler();
        },
        destroy: function() {
            this.$jqxWindow.off();
        },

        $appendPopupContentView: function() {
            var popupContentViewClassName = this.$popupContentViewProps.popupContentViewClassName,
                popupContentViewInitParam = this.$popupContentViewProps.popupContentViewInitParam;

            this.appendView(popupContentViewClassName, '.aui-popup-content > .aui-popup-content-main', popupContentViewInitParam);
        },

        $renderPopupTemplate: function() {
            this.appendTemplate('<div class="aui-popup">' +
                '<div class="aui-popup-title"></div>' +
                '<div class="aui-popup-content">' +

                '<div class="aui-popup-content-main"></div>' +
                '</div>' + 
                '</div>');
        },

        $createJQXWindowWidget: function() {
            var jqxWindowSetting = {};

            jqxWindowSetting.autoOpen = false;
            jqxWindowSetting.title = this.$popupSetting.title ?  this.$popupSetting.title : "";
            jqxWindowSetting.height = this.$popupSetting.height ? this.$popupSetting.height : 300;
            jqxWindowSetting.headerHeight = this.$popupSetting.headerHeight ? this.$popupSetting.headerHeight : null;
            jqxWindowSetting.width = this.$popupSetting.width ? this.$popupSetting.width : 300;
            jqxWindowSetting.maxHeight = this.$popupSetting.maxHeight ? this.$popupSetting.maxHeight : 600;
            jqxWindowSetting.maxWidth = this.$popupSetting.maxWidth ? this.$popupSetting.maxWidth : 600;
            jqxWindowSetting.minHeight = this.$popupSetting.minHeight ? this.$popupSetting.minHeight : 50;
            jqxWindowSetting.minWidth = this.$popupSetting.minWidth ? this.$popupSetting.minWidth : 50;

            jqxWindowSetting.isModal = this.$popupSetting.isModal != undefined ? this.$popupSetting.isModal : false;
            jqxWindowSetting.draggable = this.$popupSetting.draggable != undefined ? this.$popupSetting.draggable : true;
            jqxWindowSetting.position = this.$popupSetting.position ? this.$popupSetting.position : 'center';
            jqxWindowSetting.resizable = this.$popupSetting.resizable != undefined ? this.$popupSetting.resizable : true;
            jqxWindowSetting.showCloseButton = this.$popupSetting.showCloseButton != undefined ? this.$popupSetting.showCloseButton : true;
            jqxWindowSetting.theme = this.$popupSetting.theme ? this.$popupSetting.theme : "";

            jqxWindowSetting.showAnimationDuration = this.$popupSetting.showAnimationDuration ? this.$popupSetting.showAnimationDuration : 350;
            jqxWindowSetting.animationType = this.$popupSetting.animationType ? this.$popupSetting.animationType : 'fade';

            jqxWindowSetting.keyboardCloseKey = this.$popupSetting.keyboardCloseKey ? this.$popupSetting.keyboardCloseKey : 'esc';

            jqxWindowSetting.okButton = '.aui-popup-ok_button';
            jqxWindowSetting.cancelButton = '.aui-popup-cancel_button';

            if ( this.$popupSetting.zIndex != undefined && this.$popupSetting.zIndex != null ) {
                if ( jqxWindowSetting.isModal ) {
                    jqxWindowSetting.modalZIndex = this.$popupSetting.zIndex;
                } else {
                    jqxWindowSetting.zIndex = this.$popupSetting.zIndex;
                }
            }


            this.find('.aui-popup').css('display','none');
            this.$jqxWindow = this.createWidget('.aui-popup', 'jqxWindow', jqxWindowSetting);
        },

        $addJQXWindowWidgetEventHandler: function() {
            var that = this;

            this.$jqxWindow.on('close', function(e) {
                that.destroy();  
                that.$onClose(); 
            });

            this.$jqxWindow.on('open', function(e) {
                that.$onOpen(); 
                that.$jqxWindow.focus();
            });

            this.$jqxWindow.on('resize', function(e) {
                e.stopPropagation();
            });

            if(this.$preventKeydownEvent) {
                this.$jqxWindow.on('keydown', function(e) {
                    e.stopPropagation();
                });
            }
        },

        openPopup: function() {
            this.$jqxWindow.jqxWindow('open');
        },

        closePopup: function() {
            var that = this;
            setTimeout(function() {
                that.$jqxWindow.jqxWindow('close');
            });
        }
    }, true);

})(Camellia);

(function(_A) {

    var core = _A.core;
    if ( _A.runAttributes.noframework ) {
        return;
    }

    function ViewUpdatingChecker(rootView) {
        var rootView = rootView,
            intervalID = null,
            changingViewCount = 0,
            timeout = 20000, 
            isStarted = false;

        this.increase = function() {
            changingViewCount++;
            if ( !this._isStarted() ) {
                rootView.fire(rootView.ROOTVIEW_EVENT_VIEW_UPDATING);
                this._checkTimeout();
            }
        };

        this.decrease = function() {
            var that = this;

            setTimeout(function() {
                changingViewCount--;
                if ( that.getCount() == 0 ) {
                    rootView.fire(rootView.ROOTVIEW_EVENT_VIEW_UPDATE_COMPLETE);
                    that._done();
                }
            })

        };

        this.getCount = function() {
            return changingViewCount;
        };

        this._isStarted = function() {
            return isStarted;
        };
        this._checkTimeout = function() {
            var that = this;
            if ( A.isNull(intervalID) ) {
                isStarted = true;
                intervalID = setInterval(function() {
                    if ( changingViewCount != 0 ) {
                        that._error();
                    }
                }, timeout)
            }
        };

        this._clear = function() {
            clearInterval(intervalID);
            intervalID = null;
            changingViewCount = 0;
            isStarted = false;
        };

        this._done = function() {
            this._clear();
        };

        this._error = function() {
            this._clear();
            rootView.fire(rootView.ROOTVIEW_EVENT_VIEW_UPDATE_TIMEOUT);
        }
    }

    defineView('aui.rootView', {

        init: function() {

            this.ROOTVIEW_EVENT_VIEW_UPDATING = "aui.rootView#viewIsUpdating";
            this.ROOTVIEW_EVENT_VIEW_UPDATE_COMPLETE = "aui.rootView#viewUpdateComplete";
            this.ROOTVIEW_EVENT_VIEW_UPDATE_TIMEOUT = "aui.rootView#viewUpdateTimeout";


            this._viewUpdatingChecker = new ViewUpdatingChecker(this);


            this._listenPopupEvent();
            this._listenViewUpdateEvent();
        },

        render: function() {
        },

        destroy: function() {
        },

        _listenPopupEvent: function() {
            this.listen(this.AUI_VIEW_CONST.EVENT.POPUP_CLOSE_REQUEST, function(e) {
                A.debug('Fail to close popup. The caller view is not an innner view of aui.popupView instance.', e);
            });
        },

        _listenViewUpdateEvent: function() {
            var that = this;

            this.subscribe(this.VIEW_UPDATING, function(arg) {
                if ( arg.viewClassName == 'aui.rootView' ) {
                    return;
                }
                that._viewUpdatingChecker.increase();
            });

            this.subscribe(this.VIEW_UPDATE_COMPLETE, function(arg) {
                if ( arg.viewClassName == 'aui.rootView' ) {
                    return;
                }
                that._viewUpdatingChecker.decrease();
            });
        },

        _generatePopupUID: function() {
            return 'popup' + A.generateUUID();
        },

        createPopupView: function(viewClassName, popupSetting, viewInitParam, callerViewInstanceId) {


            var popupUID = this._generatePopupUID();

            var poupContentViewProps = {
                popupContentViewClassName: viewClassName,
                popupContentViewInitParam: viewInitParam
            };

            var popupViewProps = {
                popupUID: popupUID,
                popupContentViewProps: poupContentViewProps,
                popupSetting: popupSetting || {}
            };

            var popupViewHtml = '<div {0}="'.format(core.DDA_POPUP_ID) + popupUID + '" ' + '{0} = "'.format(core.DDA_CALLER_VIEW) + callerViewInstanceId + '"' + ' {0}="aui.popupView"></div>'.format(core.DDA_VIEW);
            this.appendTemplate(popupViewHtml, null, popupViewProps);

            return core.viewInstanceContainer.getViewByID($('div[{0}="'.format(core.DDA_POPUP_ID) + popupUID + '"]')[0 ].viewInstanceID);
        }
    }, true);

})(Camellia);
(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    A.inherit(model, core.moduleFactory.get("ModuleObject"));

    function model(initializeParameter, moduleContext) {

        if ( model._super_proto_ !== undefined ) {
            model._super_constructor(this, arguments);
        }

        this._model = this._model || {};

        this._model.modelClassSetting = moduleContext;

        this._model.modelClassSetting.data = this._model.modelClassSetting.data || null;
        this._model.modelClassSetting.sharable = this._model.modelClassSetting.sharable || false;
        this._model.modelClassSetting.autoload = this._model.modelClassSetting.autoload || false;
        this._model.modelClassSetting.url = this._model.modelClassSetting.url || null;

        this._model.modelClassSetting.reference = this._model.modelClassSetting.reference || null;
        this._model.instanceId = this._generateModelInstanceId(this._model.modelClassSetting);
        this._model.dataset = null;
        this._model.events = null;
        this._model.type = this._model.modelClassSetting.type;

    }

    A.extendif(model.prototype,
        {

            _generateModelInstanceId: function(modelClassDefinition) {
                return modelClassDefinition.className + '_' + new Date().getTime();
            },

            _createModelEvent: function() {
                if ( !this._model.events ) {
                    this._model.events = A.createModule("events", model.MODEL_EVENT);
                }

                if ( this.events && A.isPlainObject(this.events) ) {
                    for ( var eventName in this.events ) {
                        var eventFunc = this.events[ eventName ];

                        if ( A.MODEL_EVENT[ eventName ] && A.isFunction(eventFunc) ) {
                            this.on(A.MODEL_EVENT[ eventName ], eventFunc);
                        }
                    }
                }
            },

            _getDataProtocolType: function() {
                return this._model.dataProtocolType || (core.page.getConfig('dataProtocolType') || 'comm');
            },

            _getDataProtocolOptions: function() {
                return this._model.dataProtocolOptions || {  };
            },

            _createDataset: function(modelClassDefinition) {
                var deleteConflictingModelPropertiesWithDataset = function(options) {
                    var conflictingModelPropertiesWithDataset = [ 'data', 'events', 'type' ]; 

                    for ( var index in conflictingModelPropertiesWithDataset ) {
                        var propertyName = conflictingModelPropertiesWithDataset[ index ];
                        delete options[ propertyName ];
                    }

                    return options;
                };

                if ( modelClassDefinition.reference ) {
                    return;
                }

                var datasetType = "dataset." + modelClassDefinition.type;
                var options = A.copyObject(modelClassDefinition) || {};
                options = deleteConflictingModelPropertiesWithDataset(options);
                options.events = this._getDatasetEventDefinitions(modelClassDefinition);
                options.reqobject = options.reqobject || {};

                var reqobject = { async: true };

                if ( !A.isUndefined(modelClassDefinition.async) ) {
                    reqobject[ "async" ] = modelClassDefinition.async;
                }
                if ( !A.isUndefined(modelClassDefinition.readtype) ) {
                    reqobject[ "readtype" ] = modelClassDefinition.readtype;
                }
                if ( !A.isUndefined(modelClassDefinition.readindex) ) {
                    reqobject[ "readindex" ] = modelClassDefinition.readindex;
                }
                if ( !A.isUndefined(modelClassDefinition.readcount) ) {
                    reqobject[ "readcount" ] = modelClassDefinition.readcount;
                }

                A.extendif(options.reqobject, reqobject, "OEMC");

                if ( A.isNil(modelClassDefinition.data) ) {
                    options.localmode = false;
                } else {
                }

                this._model.dataset = A.createModule(datasetType, options, this._getDataProtocolType(), this._getDataProtocolOptions());
                if ( modelClassDefinition.data ) {
                    this._model.dataset.set([], modelClassDefinition.data);
                }
            },

            _checkEventPropagation: function(e) {
                var _ds = this._model.dataset,
                    referenceModel = this._getReferenceModel();

                if ( A.isNil(referenceModel) ) {
                    return true;
                }

                if ( e && A.isModule(_ds, "dataset.table") && (e[ "rowindex" ] != _ds.getCurrentRowIndex()) ) {
                    return false;
                } else if ( e && A.isModule(_ds, "dataset.tree") &&
                    _ds._getIndexById(e[ "id" ]) != _ds._getSelectedIndex() ) {
                    return false;
                } else {
                    return true;
                }
            },

            _checkPath: function(path) {
                var path = path || [],
                    _ds = this._model.dataset,
                    type = this._model.type,
                    referenceModel = this._getReferenceModel(),
                    selectedIndex,
                    newPath = [];

                if ( A.isNil(referenceModel) ) {
                    return path;
                }

                if ( type != 'simple' ) {
                    return path;
                }

                if ( A.isModule(_ds, "dataset.table") ) {
                    selectedIndex = _ds.getCurrentRowIndex();
                    newPath.push(selectedIndex);
                } else if ( A.isModule(_ds, "dataset.tree") ) {
                    selectedIndex = _ds._getSelectedIndex();
                    newPath.push(selectedIndex);
                }

                for ( var idx in path ) {
                    newPath.push(path[ idx ]);
                }

                return newPath;
            },

            _getModelClassDefinition: function() {
                return this._model.modelClassSetting;
            }
        }, 'OEMC');


    A.extendif(model.prototype,
        {
            construct: function() {},

            on: function() {
                var ename = arguments[ 0 ],
                    efunc = arguments[ 1 ],
                    ctx = arguments[ 2 ] || this,
                    async = arguments[ 3 ] || false;

                this._model.events.on(ename, efunc, ctx, async);
            },

            once: function(ename, efunc, ctx, async) {
                ctx = ctx || this;
                this._model.events.once(ename, efunc, ctx, async);
            },

            off: function() {
                var ename = arguments[ 0 ],
                    efunc = arguments[ 1 ],
                    ctx = arguments[ 2 ] || this;

                this._model.events.off(ename, efunc, ctx);
            },

            fire: function(evtname) {
                var eventObject = {
                    args: A.copyObject(arguments[ 1 ]) || {},
                    currentModel: this,
                    eventType: evtname,
                    modelType: this.getModelType(),
                    timestamp: this._getTimeStamp()
                };

                arguments[ 1 ] = eventObject;
                this._model.events.fire.apply(this._model.events, arguments);
            },

            callDataset: function(functionName) {

                var func = this.getDataset()[ functionName ];

                if ( functionName.substr(0, 1) == '_' ) {
                    throw new Error('you cannot call private method (' + functionName + ')');
                }

                if ( !func ) {
                    throw new Error("'" + functionName + "' does not exist in dataset.");
                }

                if ( !A.isFunction(func) ) {
                    throw new Error("'" + functionName + "' is not function.");
                }

                return func.apply(this.getDataset(), Array.prototype.slice.call(arguments).slice(1));
            },

            getDataset: function() {
                return this._model.dataset;
            },

            clear: function() {
                this.getDataset().clear.apply(this.getDataset(), arguments);
            },

            set: function() {
                var retArgs = [];

                if ( arguments.length == 1 ) {
                    retArgs[ 0 ] = this._checkPath();
                    retArgs[ 1 ] = arguments[ 0 ];
                } else {
                    var path = arguments[ 0 ];

                    retArgs[ 0 ] = this._checkPath(path);
                    retArgs[ 1 ] = arguments[ 1 ];
                }

                this.getDataset().set.apply(this.getDataset(), retArgs);
            },

            get: function() {
                var path = arguments[ 0 ],
                    retArgs = [];

                retArgs[ 0 ] = this._checkPath(path);

                return this.getDataset().get.apply(this.getDataset(), retArgs);
            },

            remove: function(path) {
                var path = arguments[ 0 ] || [],
                    retArgs = [];

                A.assert(A.isArray(path), "path must be array type.");

                retArgs[ 0 ] = this._checkPath(path);

                this.getDataset().remove.apply(this.getDataset(), retArgs);
            },

            requestTransaction: function(reqObject ) {
                var dataProtocolType, dataProtocolOptions;

                if ( A.isObject(arguments[ 1 ]) ) {
                    dataProtocolType = this._getDataProtocolType();
                    dataProtocolOptions = arguments[ 1 ];
                } else {
                    dataProtocolType = arguments[ 1 ] || this._getDataProtocolType();
                    dataProtocolOptions = arguments[ 2 ] || this._getDataProtocolOptions();
                }

                return this.getDataset().requestTransaction.apply(this.getDataset(), [ reqObject, dataProtocolType, dataProtocolOptions ]);
            },

            clearTransaction: function() {
                return this.getDataset().clearTransaction.apply(this.getDataset(), arguments);
            },

            getModelType: function() {
                return this._model.modelClassSetting.type;
            }
        }, 'OEMC');

    core.moduleFactory.register("model", model);
})(Camellia);

(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    A.extendif(core.moduleFactory.get('model').prototype, {

        _init: function(modelClassDefinition) {

            this._createModelEvent();
            this._createDataset(modelClassDefinition);

            this._log('Model initialized (instanceId:' + this._model.instanceId + ')');
        },

        _destroy: function() {
            if ( this.destroy && A.isFunction(this.destroy) ) {
                this.destroy();
            }

            this.getDataset().destroy();

            this._model.events.destroy();
            this._model.events = null;

            this._log('Model destroyed (instanceId:' + this._model.instanceId + ')');
        }

    }, 'OEMC');
})(Camellia);



(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }
    var model = core.moduleFactory.get('model');

    var _CONSTANT_VARIABLES = {
        MODEL_TYPE: {
            SIMPLE: 'simple',
            TABLE: 'table',
            TREE: 'tree'
        },

        MODEL_EVENT: {
            CHANGED: 'modelChanged',
            DATA_LOADED: 'modelDataLoaded',
            LOADED: 'modelLoaded',
            DYNAMIC_LOADED: 'modelDynamicLoadComplete',
            ERROR: 'modelError',
            TRANSACTION_BEFORE: 'transactionBefore',
            TRANSACTION_AFTER: 'transactionAfter'
        }
    };

    Object.defineProperties(model, {
        'MODEL_TYPE': {
            get: function() {
                return _CONSTANT_VARIABLES.MODEL_TYPE;
            }
        },

        'MODEL_EVENT': {
            get: function() {
                return _CONSTANT_VARIABLES.MODEL_EVENT;
            }
        }
    }, 'OEMC');

    A.MODEL_TYPE = A.copyObject(model.MODEL_TYPE);
    A.MODEL_EVENT = A.copyObject(model.MODEL_EVENT);
})(Camellia);


(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }
    var model = core.moduleFactory.get('model');

    A.extendif(model.prototype, {

        _eventModelChanged: function(e) {
            if ( !this._checkEventPropagation(e) ) {
                return;
            }
            e = e || {};
            e.extraArgs = e.extraArgs || {};

            var args = this.getModelType() == model.MODEL_TYPE.SIMPLE ? A.copyObject(e.extraArgs) : A.copyObject(e);

            this.fire(model.MODEL_EVENT.CHANGED, args);
        },

        _eventDynamicLoadComplete: function(e) {
            var args = A.copyObject(e) || {};

            this.fire(model.MODEL_EVENT.DYNAMIC_LOADED, args);
        },

        _eventModelLoaded: function(e) {
            var args = A.copyObject(e) || {};

            this.fire(model.MODEL_EVENT.LOADED, args);
        },

        _eventDataLoaded: function(e) {
            var args = {};

            if ( this.getModelType() == model.MODEL_TYPE.TABLE ) {
                args = A.copyObject(e) || {};
                args.data = {};
                args.data.cols = A.copyObject(args.cols);
                args.data.rows = A.copyObject(args.rows);
                delete args.cols;
                delete args.rows;
            } else {
                args.data = e.data;
            }

            this.fire(model.MODEL_EVENT.DATA_LOADED, args);
        },

        _eventModelError: function(response, ajaxErrorArguments) {
            var args = {
                response: A.copyObject(response),
                ajaxErrorArguments: A.copyObject(ajaxErrorArguments)
            };

            this.fire(model.MODEL_EVENT.ERROR, args);
        },

        _eventModelTransactionBefore: function(data) {
            this._model.events.fire.apply(this._model.events, [ model.MODEL_EVENT.TRANSACTION_BEFORE, data ]);
        },

        _eventModelTransactionAfter: function(data) {
            this._model.events.fire.apply(this._model.events, [ model.MODEL_EVENT.TRANSACTION_AFTER, data ]);
        },

        _getDatasetEventDefinitions: function(modelClassDefinition) {
            var events = [
                {
                    ename: A.DS_EVENT.LOADCOMPLETE,
                    efunc: this._eventDataLoaded,
                    epath: [],
                    econtext: this
                },
                {
                    ename: A.DS_EVENT.DYNAMICLOADCOMPLETE,
                    efunc: this._eventDynamicLoadComplete,
                    econtext: this
                },
                {
                    ename: A.DS_EVENT.CHANGED_ROWDATA,
                    efunc: this._eventModelChanged,
                    epath: [],
                    econtext: this
                },
                {
                    ename: A.DS_EVENT.ADDED_ROWDATA,
                    efunc: this._eventModelChanged,
                    epath: [],
                    econtext: this
                },
                {
                    ename: A.DS_EVENT.DELETED_ROWDATA,
                    efunc: this._eventModelChanged,
                    epath: [],
                    econtext: this
                },
                {
                    ename: A.DS_EVENT.TRANSACTION_ERROR,
                    efunc: this._eventModelError,
                    epath: [],
                    econtext: this
                },
                {
                    ename: A.DS_EVENT.TRANSACTION_END,
                    efunc: this._eventModelLoaded,
                    epath: [],
                    econtext: this
                },
                {
                    ename: A.DS_EVENT.RESETDATASET,
                    efunc: this._eventModelChanged,
                    epath: [],
                    econtext: this
                },
                {
                    ename: A.DS_EVENT.TRANSACTION_REQUEST,
                    efunc: this._eventModelTransactionBefore,
                    epath: [],
                    econtext: this
                },
                {
                    ename: A.DS_EVENT.TRANSACTION_RESPONSE,
                    efunc: this._eventModelTransactionAfter,
                    epath: [],
                    econtext: this
                }
            ];

            return events;
        }

    }, 'OEMC');
})(Camellia);


(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    A.extendif(core.moduleFactory.get('model').prototype, {

        _changeRefDataset: function(refModelInstance) {
            var changedDataset = refModelInstance.getDataset(),
                eventsDefinitions = this._getDatasetEventDefinitions();

            this._model.dataset = changedDataset;

            for ( var i in eventsDefinitions ) {
                var eventDef = eventsDefinitions[ i ];

                if ( A.isModule(changedDataset, "dataset.simple") ) {
                    changedDataset.on(eventDef.ename, [], eventDef.efunc, eventDef.econtext || this, false);
                } else {
                    changedDataset.on(eventDef.ename, eventDef.efunc, eventDef.econtext || this, false);
                }
            }
        },

        _getReferenceModel: function() {
            return this._model.modelClassSetting.reference;
        }

    }, 'OEMC');
})(Camellia);

(function(_A) {
    var core = _A.core;
    if ( A.runAttributes.noframework ) {
        return;
    }

    A.extendif(core.moduleFactory.get('model').prototype, {

        _getTimeStamp: function() {
            return Date.now();
        },

        _log : function() {
            if ( Camellia && Camellia.debug ) {
            }
        }

    }, 'OEMC');
})(Camellia);



(function(_A) {
    var core = _A.core;
    if ( _A.runAttributes.noframework ) {
        if (_A.core) {
            delete _A.core;
        }
        return;
    }

    if ( core.executeFramework && _A.isFunction(core.executeFramework) ) {
        core.executeFramework();

        _A.application = core.page;
        delete _A.core;
    }
})(Camellia);