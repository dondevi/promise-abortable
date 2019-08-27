/**
 * Custom AbortController
 *
 * @return {Object} abortController
 */
export default function getAbortController () {
  var abortSignal = getAbortSignal();
  var abort = function (reason) {
    if (abortSignal.aborted) { return; }
    abortSignal.aborted = true;
    abortSignal.dispatchEvent(reason);  // Different from AbortSignal
  };
  return {
    signal: abortSignal,
    abort: abort
  };
}

/**
 * Custom AbortSignal
 *
 * @return {Object} abortSignal
 */
function getAbortSignal () {
  var abortSignal = {
    aborted: false,
    onabort: null
  };
  abortSignal.dispatchEvent = function (event) {
    if ("function" === typeof abortSignal.onabort) {
      abortSignal.onabort(event);
    }
  };
  return abortSignal;
}
