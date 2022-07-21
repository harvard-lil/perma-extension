/**
 * perma-extension
 * @module tests/mocks
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Ad-hoc mocks to be used in the browser-based test suite.
 */

/**
 * Valid mock for a folders list.
 * @constant
 */
export const MOCK_FOLDERS_LIST = [
  { "id": 1, "depth": 0, "name": "Personal Links" },
  { "id": 3, "depth": 0, "name": "Blog Posts" },
  { "id": 2, "depth": 0, "name": "Other links" },
];

/**
 * Valid mock for folder pick.
 * @constant
 */
export const MOCK_FOLDERS_PICK = 3;

/**
 * Valid mock for archive timeline.
 * Only mocks the strict necessary to render `<archive-timeline-item>` elements.
 * @constant
 */
export const MOCK_ARCHIVE_TIMELINE = [
  {guid: "ABCD-1234", creation_timestamp: new Date().toISOString(), is_private: false},
  {guid: "1234-ABCD", creation_timestamp: new Date().toISOString(), is_private: true},
];

/**
 * Valid mock for an API key.
 * @constant
 */
export const MOCK_API_KEY = "abcedfghijklmnopqrstuvwxyz12345678901234";


/**
 * Mocks a valid archive guid.
 * @constant
 */
export const MOCK_ARCHIVE_GUID = "AAAA-2222";

/**
 * Mocks a valid tab title.
 * @constant
 */
export const MOCK_TAB_TITLE = "LOREM IPSUM";

/**
 * Mocks a valid tab url.
 * @constant
 */
export const MOCK_TAB_URL = "https://lil.harvard.edu";