# promise-abortable

[![NPM version](https://img.shields.io/npm/v/promise-abortable.svg?style=flat-square)](https://npmjs.org/package/promise-abortable)
[![node version](https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square)](http://nodejs.org/download/)
<!-- [![build status](https://img.shields.io/travis/avwo/promise-abortable.svg?style=flat-square)](https://travis-ci.org/avwo/promise-abortable) -->
<!-- [![Test coverage](https://codecov.io/gh/avwo/promise-abortable/branch/master/graph/badge.svg?style=flat-square)](https://codecov.io/gh/avwo/promise-abortable) -->
<!-- [![Install size](https://packagephobia.now.sh/badge?p=promise-abortable)](https://packagephobia.now.sh/result?p=promise-abortable) -->
[![NPM download](https://img.shields.io/npm/dm/promise-abortable.svg?style=flat-square)](https://npmjs.org/package/promise-abortable)
[![NPM count](https://img.shields.io/npm/dt/promise-abortable.svg?style=flat-square)](https://www.npmjs.com/package/promise-abortable)
[![License](https://img.shields.io/npm/l/promise-abortable.svg?style=flat-square)](https://www.npmjs.com/package/promise-abortable)

Promise lib for aborting in chain.



## Features

- Abort promise
- Abort in promise chain
- Abort nesting promise
- Return promise after abort



## Browser Support

Any browser that supports <a href="http://caniuse.com/#feat=promises" target="_blank">Promise</a>.

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) |
--- | --- | --- | --- | --- |
33 ✔ | 29 ✔ | 8 ✔ | 20 ✔ | 12 ✔ |

<small>If run in others, use <a herf="https://babeljs.io/" target="\_blank">Babel</a>, or include script `polyfill.min.js` below.</small>



## Install

```bash
$ npm install promise-abortable
```

The IIFE build is also available on unpkg:

```html
<script src="https://unpkg.com/promise-abortable/dist/es5.min.js"></script> <!-- 1KB, recommend -->
<script src="https://unpkg.com/promise-abortable/dist/es6.min.js"></script> <!-- 1KB -->
<script src="https://unpkg.com/promise-abortable/dist/polyfill.min.js"></script> <!-- 19KB -->
```



## Usage

```javascript
// 1. Ininstantiation
const promise = new AbortablePromise((resolve, reject, signal) => {
  // 2. Set abort handler
  signal.onabort = reason => {
    // 4. `reason` is from `promise.abort(reason)`
  };
});
// 3. Invoke `signal.onabort(reason)`
promise.abort(reason);
```



## Pseudo code
> See full examples <a href="./examples.md" target="\_blank">here</a>.

### Promise abort

```javascript
const promise = new AbortablePromise(...);
promise.abort();
```


### Clain abort

```javascript
const promise = new AbortablePromise(...).then(...).catch(...);
promise.abort();
```


### Nesting abort

```javascript
const promise = new AbortablePromise(...).catch(value => {
  return new AbortablePromise(...);
});
// promise1 pending
promise.abort();  // abort promise1 and run catch
// promise2 pending
promise.abort();  // abort promise2
```


### Promise after abort

```javascript
const promise = new AbortablePromise(...);
promise.abort().then(...).catch(...);
```


### Promise.all abort

```javascript
const promise = AbortablePromise.all([...]);
promise.abort();
```


### Promise.race abort

```javascript
const promise = AbortablePromise.race([...]);
promise.abort();
```
