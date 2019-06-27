/**
 * Abortable Promise
 *
 * @author dondevi
 * @create 2019-05-27
 */
export default class AbortablePromise extends Promise {

  constructor (executor, abortController) {
    super((resolve, reject) => {
      if (!abortController) {
        abortController = getAbortController();
      }
      executor(resolve, reject, abortController.signal);
    });
    this.abortController = abortController;
  }

  then (onFulfilled, onRejected) {
    return new AbortablePromise((resolve, reject, signal) => {
      const onSettled = (status, value, callback) => {
        if ("function" === typeof callback) {
          value = callback(value);
          if (value instanceof AbortablePromise) {
            Object.assign(signal, value.abortController.signal);
          }
          return resolve(value);
        }
        "resolved" === status && resolve(value);
        "rejected" === status && reject(value);
      }
      super.then(
        value => onSettled("resolved", value, onFulfilled),
        reason => onSettled("rejected", reason, onRejected)
      );
    }, this.abortController);
  }

  // Equivalent to this.then(undefined, onRejected)
  // catch (onRejected) {}

  abort (reason) {
    return new AbortablePromise((resolve, reject) => {
      setTimeout(() => {
        this.abortController.abort(reason);
        this.then(resolve, reject);
      });
    }, this.abortController);
  }

};

AbortablePromise.all = function (promises) {
  return new AbortablePromise((resolve, reject, signal) => {
    signal.onabort = reason => {
      promises.forEach((promise) => {
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
  return new AbortablePromise((resolve, reject, signal) => {
    signal.onabort = reason => {
      promises.forEach((promise) => {
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
  const abortSignal = {
    aborted: false,
    onabort: null
  };
  const abort = reason => {
    if (abortSignal.aborted) { return; }
    const { onabort } = abortSignal;
    "function" === typeof onabort && onabort(reason);
    abortSignal.aborted = true;
  };
  const abortController = {
    signal: abortSignal,
    abort: abort
  };
  return abortController;
}

