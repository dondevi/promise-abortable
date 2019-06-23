# promise-abortable

## Usage

```javascript
const promise = new AbortablePromise((resolve, reject, signal) => {
  const xhr = ...;
  signal.onabort = reason => xhr.abort(reson);
});

...

promise.abort();
```
