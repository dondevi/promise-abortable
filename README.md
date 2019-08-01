# promise-abortable

[![NPM version](https://img.shields.io/npm/v/promise-abortable.svg?style=flat-square)](https://npmjs.org/package/promise-abortable)
[![node version](https://img.shields.io/badge/node.js-%3E=_0.12-green.svg?style=flat-square)](http://nodejs.org/download/)
<!-- [![build status](https://img.shields.io/travis/avwo/promise-abortable.svg?style=flat-square)](https://travis-ci.org/avwo/promise-abortable) -->
[![Test coverage](https://codecov.io/gh/avwo/promise-abortable/branch/master/graph/badge.svg?style=flat-square)](https://codecov.io/gh/avwo/promise-abortable)
<!-- [![Install size](https://packagephobia.now.sh/badge?p=promise-abortable)](https://packagephobia.now.sh/result?p=promise-abortable) -->
[![NPM download](https://img.shields.io/npm/dm/promise-abortable.svg?style=flat-square)](https://npmjs.org/package/promise-abortable)
[![NPM count](https://img.shields.io/npm/dt/promise-abortable.svg?style=flat-square)](https://www.npmjs.com/package/promise-abortable)
[![License](https://img.shields.io/npm/l/promise-abortable.svg?style=flat-square)](https://www.npmjs.com/package/promise-abortable)



## Concept

**abort != reject**, reject in abort maually rather than automatically.



## Features

- Abort in promise
- Abort in promise chain
- Abort for nesting promise
- Return promise after abort



## Use Cases
- Cancel request when component hide, unmount or destory
- Cancel long-running async operation
- Return promise with abort for common request function



## Browser Support

Any browser that supports <a href="http://caniuse.com/#feat=promises" target="_blank">Promise</a>.

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) |
--- | --- | --- | --- | --- |
33 ✔ | 29 ✔ | 8 ✔ | 20 ✔ | 12 ✔ |

<small>Use <a herf="https://babeljs.io/" target="_blank">Babel</a> for lower versions, or include script `iife.es3.js` below.</small>



## Install

```bash
$ npm install promise-abortable
```

The IIFE build is also available on unpkg:

```html
<script src="https://unpkg.com/promise-abortable/dist/iife.es5.js"></script> <!-- 1KB, recommend -->
<script src="https://unpkg.com/promise-abortable/dist/iife.es6.js"></script> <!-- 1KB -->
<script src="https://unpkg.com/promise-abortable/dist/iife.es3.js"></script> <!-- 16KB -->
```



## Usage

```javascript
// 1. Instantiate
const promise = new AbortablePromise((resolve, reject, signal) => {
  // 2. Set abort handler
  signal.onabort = reason => {
    // 4. Abort won't reject, but you can reject manually
  };
});
// 3. Invoke `signal.onabort(reason)`
promise.abort(reason);
```



## Pseudo code
> See full examples <a href="./examples.md" target="\_blank">here</a>.

### Abort in promise

```javascript
const promise = new AbortablePromise(...);
// or: const promise = AbortablePromise.resolve(...);
// or: const promise = AbortablePromise.reject(...);
// or: const promise = AbortablePromise.all([...]);
// or: const promise = AbortablePromise.race([...]);
promise.abort();
```


### Abort in promise chain

```javascript
const promise = new AbortablePromise(...).then(...).catch(...);
promise.abort();
```


### Abort for nesting promise

```javascript
const promise = AbortablePromise.resolve(...).then(value => {
  return new AbortablePromise(...);
});
promise.abort();
```


### Return promise after abort

```javascript
const promise = new AbortablePromise(...);
promise.abort().then(...).catch(...);
```


### Abort in async/await

```javascript
const promise = new AbortablePromise(...);
(async () => {
  try { await promise; } catch (error) {...}
})();
promise.abort();
```
