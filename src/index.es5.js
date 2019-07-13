/**
 * Abortable Promise
 *
 * @author dondevi
 * @create 2019-07-12
 */

function AbortablePromise (executor, abortController) {
  this.promise = new Promise(function (resolve, reject) {
    if (!abortController) {
      abortController = getAbortController();
    }
    executor(resolve, reject, abortController.signal);
  });
  this.abortController = abortController;
}

AbortablePromise.prototype = new Promise(function () {});
AbortablePromise.prototype.constructor = AbortablePromise;

AbortablePromise.prototype.then = function (onFulfilled, onRejected) {
  var that = this;
  return new AbortablePromise(function (resolve, reject, signal) {
    var onSettled = function (status, value, callback) {
      if ("function" === typeof callback) {
        value = callback(value);
        if (value instanceof AbortablePromise) {
          var superSignal = value.abortController.signal;
          signal.aborted = superSignal.aborted;
          signal.onabort = superSignal.onabort;
        }
        return resolve(value);
      }
      "resolved" === status && resolve(value);
      "rejected" === status && reject(value);
    }
    that.promise.then(
      function (value) { onSettled("resolved", value, onFulfilled) },
      function (reason) { onSettled("rejected", reason, onRejected) }
    );
  }, this.abortController);
};

AbortablePromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

AbortablePromise.prototype.abort = function (reason) {
  var that = this;
  return new AbortablePromise(function (resolve, reject) {
    setTimeout(function () {
      that.abortController.abort(reason);
      that.then(resolve, reject);
    });
  }, this.abortController);
};

AbortablePromise.resolve = function (value) {
  return new AbortablePromise(function (resolve, reject) {
    resolve(value);
  });
};

AbortablePromise.reject = function (value) {
  return new AbortablePromise(function (resolve, reject) {
    reject(value);
  });
};

AbortablePromise.all = function (promises) {
  return new AbortablePromise(function (resolve, reject, signal) {
    signal.onabort = function (reason) {
      promises.forEach(function (promise) {
        if (promise instanceof AbortablePromise) {
          promise.abort(reason).catch(reject);
        }
      });
      reject(reason);
    }
    Promise.all(promises).then(resolve, reject);
  });
}

AbortablePromise.race = function (promises) {
  return new AbortablePromise(function (resolve, reject, signal) {
    signal.onabort = function (reason) {
      promises.forEach(function (promise) {
        if (promise instanceof AbortablePromise) {
          promise.abort(reason).catch(reject);
        }
      });
      reject(reason);
    }
    Promise.race(promises).then(resolve, reject);
  });
}

/**
 * Custom AbortController
 *
 * @return {Object} abortController
 */
function getAbortController () {
  var abortSignal = {
    aborted: false,
    onabort: null
  };
  var abort = function (reason) {
    if (abortSignal.aborted) { return; }
    var { onabort } = abortSignal;
    "function" === typeof onabort && onabort(reason);
    abortSignal.aborted = true;
  };
  var abortController = {
    signal: abortSignal,
    abort: abort
  };
  return abortController;
}

module.exports = AbortablePromise;
