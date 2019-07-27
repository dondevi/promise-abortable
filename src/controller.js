/**
 * Custom AbortController
 *
 * @return {Object} abortController
 */
export default function getAbortController () {
  const abortSignal = getAbortSignal();
  const abort = reason => {
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
  const abortSignal = {
    aborted: false,
    onabort: null
  };
  abortSignal.dispatchEvent = event => {
    if ("function" === typeof abortSignal.onabort) {
      abortSignal.onabort(event);
    }
  };
  return abortSignal;
}
