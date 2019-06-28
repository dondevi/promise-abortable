# promise-abortable

Promise lib for abortable.



## Basic Usage

```javascript
const promise = new AbortablePromise((resolve, reject, signal) => {
  signal.onabort = reason => {};  // reason from abort(reason)
});

promise.abort(reason);  // execute signal.onabort(reason)
```



## Basic Examples

### Abort Promise

```javascript
const promise1 = new AbortablePromise((resolve, reject, signal) => {
  setTimeout(resolve, 1000, "resolve");
  signal.onabort = reject;
});

const promise2 = promise1.then(value => {
  console.log(value);  // no execute
}).catch(reason => {
  console.log(reason);  // output "abort promise"
});

promise1.abort("abort promise");
// or
promise2.abort("abort promise");
```


### Abort AJAX

```javascript
const promise = new AbortablePromise((resolve, reject, signal) => {
  const url = `/`;
  const xhr = $.ajax({ url, success: resolve, error: reject });
  signal.onabort = xhr.abort.bind(xhr);
});

promise.then(data => {
  console.log(data);  // no execute
}).catch(xhr => {
  console.log(xhr);  // output `{ ... statusText: "abort ajax" }`
});

promise.abort("abort ajax");
```


### Abort axios

```javascript
const promise = new AbortablePromise((resolve, reject, signal) => {
  const url = `/`;
  const source = axios.CancelToken.source();
  axios({ url, cancelToken: source.token }).then(resolve, reject);
  signal.onabort = source.cancel.bind(source);
});

promise.then(response => {
  console.log(response);  // no execute
}).catch(error => {
  console.log(error);  // output `{ message: "abort axios" }`
});

promise.abort("abort axios");
```


### Abort fetch

```javascript
const promise = new AbortablePromise((resolve, reject, signal) => {
  const url = `/`;
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(resolve, reject);
  signal.onabort = controller.abort.bind(controller);
});

promise.then(response => {
  console.log(response);  // no execute
}).catch(error => {
  console.log(error);  // output `DOMException`
});

promise.abort("abort fetch");
```



## More Examples

```javascript
/**
 * Timeout Promise: resolved after delay, abortable
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
```


### Duplicate abort

```javascript
const promise = AbortableDelay("resolve", 1000);

promise.catch(reason => {
  console.log(reason);  // output "abort 1"
});

promise.abort("abort 1").abort("abort 2");
```


### Nesting abort

```javascript
const promise1 = AbortableDelay("resolve at 1s", 1000);
const promise2 = AbortableDelay("resolve at 2s", 2000);
const promise3 = AbortableDelay("resolve at 3s", 3000);
const promise4 = AbortableDelay("resolve at 4s", 4000);

promise1.then(value => {
  console.log("promise1:", value);  // output "promise1: resolve at 1s"
  return promise2;
}).catch(reason => {
  console.log("promise2:", reason);  // output "promise2: abort at 1.5s"
  return promise3;
}).then(value => {
  console.log("promise3:", value);  // output "promise3: resolve at 3s"
  return promise4;
}).catch(reason => {
  console.log("promise4:", reason);  // output "promise4: abort at 3.5s"
});

setTimeout(() => {
  promise1.abort("abort at 1.5s");
}, 1500);

setTimeout(() => {
  promise1.abort("abort at 3.5s");
}, 3500);
```


### Promise after abort

```javascript
const promise = AbortableDelay("resolve", 1000);

const promise1 = promise.catch(reason => {
  console.log("promise1:", reason);  // output "promise1: abort"
  return "catch abort 1";
});

const promise2 = promise.catch(reason => {
  console.log("promise2:", reason);  // output "promise2: abort"
  return "catch abort 2";
});

promise1.abort("abort").then(value => {
  console.log(value);  // output "catch abort 1"
});
```


### Promise.all abort

```javascript
const promise1 = AbortableDelay("resolve at 1s", 1000);
const promise2 = AbortableDelay("resolve at 2s", 2000);
const promiseAll = AbortablePromise.all([promise1, promise2]);

promise1.then(value => {
  console.log("promise1:", value);  // output "promise1: resolve at 1s"
}).catch(reason => {
  console.log("promise1:", reason);  // no execute
});

promise2.then(value => {
  console.log("promise2:", value);  // no execute
}).catch(reason => {
  console.log("promise2:", reason);  // output "promise2: abort at 1.5s"
});

promiseAll.then(value => {
  console.log("promiseAll:", value);  // no execute
}).catch(reason => {
  console.log("promiseAll:", reason);  // output "promiseAll: abort at 1.5s"
});

setTimeout(() => {
  promiseAll.abort("abort at 1.5s");
}, 1500);
```


### Promise.race abort

```javascript
const promise1 = AbortableDelay("resolve at 1s", 1000);
const promise2 = AbortableDelay("resolve at 2s", 2000);
const promiseRace = AbortablePromise.race([promise1, promise2]);

promise1.then(value => {
  console.log("promise1:", value);  // output "promise1: resolve at 1s"
}).catch(reason => {
  console.log("promise1:", reason);  // no execute
});

promise2.then(value => {
  console.log("promise2:", value);  // no execute
}).catch(reason => {
  console.log("promise2:", reason);  // output "promise2: abort at 1.5s"
});

promiseRace.then(value => {
  console.log("promiseRace:", value);  // output "promiseRace: resolve at 1s"
}).catch(reason => {
  console.log("promiseRace:", reason);  // no execute
});

setTimeout(() => {
  promiseRace.abort("abort at 1.5s");
}, 1500);
```

<script src="./dist/index.iife.js"></script>
<script>
  function AbortableDelay (value, delay = 0) {
    return new AbortablePromise((resolve, reject, signal) => {
      setTimeout(resolve, delay, value);
      signal.onabort = reject;
    });
  }
</script>
