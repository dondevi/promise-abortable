define(['core-js/modules/web.dom.iterable', 'core-js/modules/es6.array.iterator', 'core-js/modules/es6.string.iterator', 'core-js/modules/es6.promise', 'core-js/modules/es6.object.to-string', 'core-js/modules/es6.object.assign'], function (web_dom_iterable, es6_array_iterator, es6_string_iterator, es6_promise, es6_object_toString, es6_object_assign) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  /**
   * Abortable Promise
   *
   * @author dondevi
   * @create 2019-05-27
   */
  var AbortablePromise =
  /*#__PURE__*/
  function (_Promise) {
    _inherits(AbortablePromise, _Promise);

    function AbortablePromise(executor, abortController) {
      var _this;

      _classCallCheck(this, AbortablePromise);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(AbortablePromise).call(this, function (resolve, reject) {
        if (!abortController) {
          abortController = getAbortController();
        }

        executor(resolve, reject, abortController.signal);
      }));
      _this.abortController = abortController;
      return _this;
    }

    _createClass(AbortablePromise, [{
      key: "then",
      value: function then(onFulfilled, onRejected) {
        var _this2 = this;

        return new AbortablePromise(function (resolve, reject, signal) {
          var onSettled = function onSettled(status, value, callback) {
            if ("function" === typeof callback) {
              value = callback(value);

              if (value instanceof AbortablePromise) {
                Object.assign(signal, value.abortController.signal);
              }

              return resolve(value);
            }

            "resolved" === status && resolve(value);
            "rejected" === status && reject(value);
          };

          _get(_getPrototypeOf(AbortablePromise.prototype), "then", _this2).call(_this2, function (value) {
            return onSettled("resolved", value, onFulfilled);
          }, function (reason) {
            return onSettled("rejected", reason, onRejected);
          });
        }, this.abortController);
      } // Equivalent to this.then(undefined, onRejected)
      // catch (onRejected) {}

    }, {
      key: "abort",
      value: function abort(reason) {
        var _this3 = this;

        return new AbortablePromise(function (resolve, reject) {
          setTimeout(function () {
            _this3.abortController.abort(reason);

            _this3.then(resolve, reject);
          });
        }, this.abortController);
      }
    }]);

    return AbortablePromise;
  }(_wrapNativeSuper(Promise));

  AbortablePromise.all = function (promises) {
    return new AbortablePromise(function (resolve, reject, signal) {
      signal.onabort = function (reason) {
        promises.forEach(function (promise) {
          if (promise instanceof AbortablePromise) {
            promise.abort(reason).catch(reject);
          }
        });
        reject(reason);
      };

      Promise.all(promises).then(resolve, reject);
    });
  };

  AbortablePromise.race = function (promises) {
    return new AbortablePromise(function (resolve, reject, signal) {
      signal.onabort = function (reason) {
        promises.forEach(function (promise) {
          if (promise instanceof AbortablePromise) {
            promise.abort(reason).catch(reject);
          }
        });
        reject(reason);
      };

      Promise.race(promises).then(resolve, reject);
    });
  };
  /**
   * Custom AbortController
   *
   * @return {Object} abortController
   */


  function getAbortController() {
    var abortSignal = {
      aborted: false,
      onabort: null
    };

    var abort = function abort(reason) {
      if (abortSignal.aborted) {
        return;
      }

      var onabort = abortSignal.onabort;
      "function" === typeof onabort && onabort(reason);
      abortSignal.aborted = true;
    };

    var abortController = {
      signal: abortSignal,
      abort: abort
    };
    return abortController;
  }

  return AbortablePromise;

});
