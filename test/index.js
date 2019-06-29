/**
 * Test case for AbortablePromise
 *
 * @author dondevi
 * @create 2019-06-23
 */

const assert = require("assert");
const AbortablePromise = require("../src/index.js");


describe("AbortablePromise", () => {

  it("should instanceof Promise, should abortable", () => {
    const promise = new AbortablePromise(resolve => {});
    const promise_then = promise.then(vaule => {});
    const promise_catch = promise.catch(reson => {});
    const promise_abort = promise.abort();
    const promise_resolve = AbortablePromise.resolve();
    const promise_reject = AbortablePromise.reject();
    const promise_all = AbortablePromise.all([]);
    const promise_race = AbortablePromise.race([]);
    assertAbortable(promise);
    assertAbortable(promise_then);
    assertAbortable(promise_catch);
    assertAbortable(promise_abort);
    assertAbortable(promise_resolve);
    assertAbortable(promise_reject);
    promise_reject.catch(reason => reason);
  });

  describe("#abort()", () => {

    it("should do nothing without setting signal", done => {
      new AbortablePromise((resolve) => {
        setTimeout(resolve, 30);
      }).then(done).abort();
    });

    it("should execute 'signal.onabort()' with setting signal", done => {
      new AbortablePromise((resolve, reject, signal) => {
        signal.onabort = done;
      }).abort();
    });

    it("should reject if 'reject()' set to signal", done => {
      new AbortablePromise((resolve, reject, signal) => {
        signal.onabort = reject;
      }).catch(done).abort();
    });

    it("should resolve if 'resolve()' set to signal", done => {
      new AbortablePromise((resolve, reject, signal) => {
        signal.onabort = resolve;
      }).then(done).abort();
    });

    it("should execute event if resolved", done => {
      new AbortablePromise((resolve, reject, signal) => {
        signal.onabort = reason => {
          assert.equal(reason, "abort");
        };
        resolve();
      }).then(done).abort("abort");
    });

    it("should execute event if rejected", done => {
      new AbortablePromise((resolve, reject, signal) => {
        signal.onabort = reason => {
          assert.equal(reason, "abort");
        };
        reject();
      }).catch(done).abort("abort");
    });

    it("should keep chain after abort", done => {
      new AbortablePromise((resolve, reject, signal) => {
        signal.onabort = reject;
      }).catch(reason => reason).abort("abort").then(value => {
        assert.equal(value, "abort");
        done();
      });
    });

    it("should not execute if aborted", done => {
      new AbortablePromise((resolve, reject, signal) => {
        signal.onabort = reason => {
          assert.equal(reason, 1);
          setTimeout(done, 30);
        };
      }).abort(1).abort(2);
    });

    it("should execute nesting abort", done => {
      AbortablePromise.resolve().then(value => {
        return new AbortablePromise((resolve, reject, signal) => {
          signal.onabort = reject;
        });
      }).catch(done).abort();
    });

    it("should execute nesting abort event if aborted", done => {
      const promise1 = AbortableDelay("resolve at 10ms", 10);
      const promise2 = AbortableDelay("resolve at 20ms", 20);
      const promise3 = AbortableDelay("resolve at 30ms", 30);
      const promise4 = AbortableDelay("resolve at 40ms", 40);
      promise1.then(value => {
        assert.equal(value, "resolve at 10ms");
        return promise2;
      }).catch(reason => {
        assert.equal(reason, "abort at 15ms");
        return promise3;
      }).then(value => {
        assert.equal(value, "resolve at 30ms");
        return promise4;
      }).catch(reason => {
        assert.equal(reason, "abort at 35ms");
        done();
      });
      setTimeout(() => {
        promise1.abort("abort at 15ms");
      }, 15);

      setTimeout(() => {
        promise1.abort("abort at 35ms");
      }, 35);
    });

  });

  describe("#all()", () => {
    it("should abort all that not resolved", done => {
      const promise1 = AbortableDelay("resolve at 10ms", 10);
      const promise2 = AbortableDelay("resolve at 20ms", 20);
      const promiseAll = AbortablePromise.all([promise1, promise2]);
      promise1.then(value => {
        assert.equal(value, "resolve at 10ms");
      });
      promise2.catch(reason => {
        assert.equal(reason, "abort at 15ms");
        done();
      });
      promiseAll.catch(reason => {
        assert.equal(reason, "abort at 15ms");
      });
      setTimeout(() => {
        promiseAll.abort("abort at 15ms").catch(reason => reason);
      }, 15);
    });
  });

  describe("#race()", () => {
    it("should abort all that not resolved", done => {
      const promise1 = AbortableDelay("resolve at 10ms", 10);
      const promise2 = AbortableDelay("resolve at 20ms", 20);
      const promiseRace = AbortablePromise.race([promise1, promise2]);
      promise1.then(value => {
        assert.equal(value, "resolve at 10ms");
      });
      promise2.catch(reason => {
        assert.equal(reason, "abort at 15ms");
        done();
      });
      promiseRace.catch(reason => {
        assert.equal(reason, "resolve at 10ms");
      });
      setTimeout(() => {
        promiseRace.abort("abort at 15ms").catch(reason => reason);
      }, 15);
    });
  });

});

/**
 * Assert a promise is abortable
 *
 * @param {*} promise
 */
function assertAbortable (promise) {
  assert.ok(promise instanceof AbortablePromise);
  assert.ok(promise instanceof Promise);
  assert.equal(typeof promise.then, "function");
  assert.equal(typeof promise.catch, "function");
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
