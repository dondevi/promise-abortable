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
      const promise = new AbortablePromise(() => {});
      assertAbortable(promise);
    });

    it("Execute 'abort()' without setting 'signal.onabort'", () => {
      const promise = new AbortablePromise((resolve) => {
        setTimeout(resolve, 10, "timeout resolve");
      }).then(value => {
        assert.equal(value, "timeout resolve");
        return "value form then";
      });
      const promise2 = promise.abort("abort");
      const promise3 = promise2.then(value => {
        assert.equal(value, "value form then");
      });
      assertAbortable(promise2);
      assertAbortable(promise3);
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
    // PromiseAbortable.resolve("resolve").then(console.log).abort("abort")

    // var p = new PromiseAbortable((resolve, reject, signal) => {
    //   signal.onabort = () => {
    //     console.log("onabort 1")
    //   };
    //   resolve();
    // }).then(v => {
    //   console.log("then 1")
    //   return new PromiseAbortable((resolve, reject, signal) => {
    //     signal.onabort = () => {
    //       console.log("onabort 2")
    //     };
    //     setTimeout(e=>resolve("timeout 1"), 1000)
    //   });
    // }).then(v => {
    //   console.log("then 2")
    //   return new PromiseAbortable((resolve, reject, signal) => {
    //     signal.onabort = () => {
    //       console.log("onabort 3")
    //     };
    //     setTimeout(e=>resolve("timeout 2"), 2000)
    //   });
    // }).catch(e => {
    //   console.log("catch 1")
    //   return new PromiseAbortable((resolve, reject, signal) => {
    //     signal.onabort = () => {
    //       console.log("onabort 4")
    //     };
    //     setTimeout(e=>resolve("timeout 3"), 3000)
    //   });
    // })
    // .catch(e=>(console.log("catch 2", e), "catch 2"))
    // .then(v=>(console.log("then 3", v), "then 2"))

    // setTimeout(e=>{
    //   p.abort("abort 1")
    //   .then(v=>console.log("then 4", v))
    //   .catch(e=>console.log("catch 3", e))
    // },1500)

    // setTimeout(e=>{
    //   p.abort("abort 2")
    //   .then(v=>console.log("then 5", v))
    //   .catch(e=>console.log("catch 4", e))
    // },2500)

    // function PromiseDelay (delay) {
    //   return new PromiseAbortable(resolve => setTimeout(q=>resolve(22), delay));
    // }

    // PromiseDelay(1000)
    // .then(v=>console.log("then"))
    // .catch(e=>(console.log(e), "catch"))
    // .abort("abort")
    // .then(v=>console.log(v))\
    //

    // var a = PromiseAbortable.race([
    //   PromiseDelay(1000).then(v=>"delay 1"),//.catch(e=>console.log("catch 1", e)),
    //   PromiseDelay(2000).then(v=>"delay 2").catch(e=>console.log("catch 2", e)),
    //   PromiseDelay(3000).then(v=>"delay 3").catch(e=>console.log("catch 3", e)),
    // ]).then(v=>console.log("then", v)).catch(e=>console.log("catch", e))//.abort(1)
    // PromiseDelay(2500).then(v=>a.abort("abort"))
  });

});

/**
 * Assert a promise is abortable
 * @param  {*} promise
 */
function assertAbortable (promise) {
  assert.ok(promise instanceof AbortablePromise);
  assert.ok(promise instanceof Promise);
  assert.equal(typeof promise.abort, "function");
}

