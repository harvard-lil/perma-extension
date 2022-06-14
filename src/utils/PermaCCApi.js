/**
 * perma-extension
 * @module utils/PermaCCAPI
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Utility for interacting with Perma.cc's REST API.
 */

/**
 * Perma.cc's default base url.
 * @constant
 */
export const DEFAULT_BASE_URL = "https://api.perma.cc";

/**
 * Utility class for interacting with Perma.cc's REST API.
 * 
 * API Documentation: https://perma.cc/docs/developer
 */
export default class PermaCCAPI {

  /**
   * API key to be used to access restricted featured.
   * @type {?string}
   */
  apiKey

  /**
   * Base url of the Perma.cc API. 
   * Defaults to `DEFAULT_BASE_URL`.
   * @type {string}
   */
  baseUrl = DEFAULT_BASE_URL

  /**
   *
   * @param {string} apiKey -
   * @param {?string} forceBaseUrl -  
   */
  constructor(apiKey = "", forceBaseUrl = null) {
  }

}