/**
 * Test case
 *
 * @author dondevi
 * @create 2019-06-23
 */

const assert = require("assert");
const AbortablePromise = require("../dist/index.js");


describe("AbortablePromise", () => {


  describe("Base Usage", () => {

    it("new AbortablePromise", () => {
      const promise = new AbortablePromise(resolve => {});
      const promise_then = promise.then(vaule => {});
      const promise_catch = promise.catch(reson => {});
      const promise_abort = promise.abort();
      assertAbortable(promise);
      assertAbortable(promise_then);
      assertAbortable(promise_catch);
      assertAbortable(promise_abort);
    });

    it("Execute 'abort()' without setting 'signal.onabort'", () => {
      const promise = new AbortablePromise((resolve) => {
        setTimeout(resolve, 10, "timeout resolve");
      }).then(value => {
        assert.equal(value, "timeout resolve");
        return "value form then";
      });
      const promise3 = promise2.then(value => {
        assert.equal(value, "value form then");
      });
      return promise;
    });

    it("Execute 'abort()' with setting 'signal.onabort'", () => {
      const promise = new AbortablePromise((resolve, reject, signal) => {
        signal.onabort = reject;
        setTimeout(resolve, 10, "timeout resolve");
      }).then(value => {
        console.log("Do not execute then.");
      }).catch(reason => {
        assert.equal(reason, "trigger onabort");
      })
      promise.abort("trigger onabort");
      return promise;
    });

  });


  describe("More Usage", () => {
  });

});

/**
 * Assert a promise is abortable
 *
 * @param  {*} promise
 */
function assertAbortable (promise) {
  assert.ok(promise instanceof AbortablePromise);
  assert.ok(promise instanceof Promise);
  assert.equal(typeof promise.abort, "function");
}

/**
 * Timeout Promise, auto resolved after delay, abortable
 *
 * @param {*}      value
 * @param {Number} delay
 */
function AbortableDelay (value, delay = 0) {
  return new AbortablePromise((resolve, reject, signal) => {
    setTimeout(resolve, delay, value);
    signal.onabort = reject;
  });
}
