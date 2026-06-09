/**
 * perma-extension
 * @module tests/mocks
 * @author The Harvard Library Innovation Lab
 * @license MIT
 * @description Ad-hoc mocks to be used in the browser-based test suite.
 */

/**
 * Valid mock for the folder cascade, as consumed by `<archive-form>`'s `folders-cascade` attribute
 * (see `storage/Folders`). A single opened level (top-level folders) with "Blog Posts" picked.
 * @constant
 */
export const MOCK_FOLDERS_CASCADE = {
  levels: [
    [
      { id: 1, name: "Personal Links", hasChildren: false },
      { id: 3, name: "Blog Posts", hasChildren: false },
      { id: 2, name: "Other links", hasChildren: false },
    ],
  ],
  path: [3],
  pick: 3,
};

/**
 * Valid mock for archive timeline.
 * Only mocks the strict necessary to render `<archive-timeline-item>` elements.
 * @constant
 */
export const MOCK_ARCHIVE_TIMELINE = [
  {
    guid: "ABCD-1234",
    url: "https://lil.law.harvard.edu",
    captures: [{ status: "pending" }],
    creation_timestamp: new Date().toISOString()
  },
  {
    guid: "DCBA-4321",
    url: "https://lil.law.harvard.edu",
    captures: [{ status: "success" }],
    creation_timestamp: new Date().toISOString()
  },
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
export const MOCK_TAB_URL = "https://lil.law.harvard.edu/";