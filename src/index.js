/**
 * Abortable Promise
 *
 * @author dondevi
 * @create 2019-05-27
 */

import getAbortController from "./controller.js";

export default class AbortablePromise extends Promise {

  constructor (executor, abortController = getAbortController()) {
    super((resolve, reject) => {
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
      Promise.resolve().then(() => {
        this.abortController.abort(reason);
        this.then(resolve, reject);
      });
    }, this.abortController);
  }

  static all (promises) {
    return new AbortablePromise((resolve, reject, signal) => {
      setPromisesAbort(promises, signal);
      Promise.all(promises).then(resolve, reject);
    });
  }

  static race (promises) {
    return new AbortablePromise((resolve, reject, signal) => {
      setPromisesAbort(promises, signal);
      Promise.race(promises).then(resolve, reject);
    });
  }

};

/**
 * Set promises abort
 * @param {Array} promises - list of promise
 * @param {Object} signal - abort signal
 */
function setPromisesAbort (promises, signal) {
  signal.onabort = reason => {
    promises.forEach((promise) => {
      if (promise instanceof AbortablePromise) {
        promise.abort(reason).catch(error => error);
      }
    });
  }
}
