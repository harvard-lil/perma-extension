/**
 * perma-extension
 * @module constants
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description App-wide constants.
 */

/**
 * Base url for the Perma.cc API. 
 * Unless the `PERMA_API_TARGET` env variable is set to "local", will point to "https://api.perma.cc".
 * @constant
 */
export const PERMA_API_URL = (() => {
  if (typeof process !== "undefined" && process?.env?.PERMA_API_TARGET === "local") {
    return "https://api.perma.test:8000";
  }

  return "https://api.perma.cc";
})();