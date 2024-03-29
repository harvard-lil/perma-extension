<a name="module_constants"></a>

## constants
App-wide constants.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [constants](#module_constants)
    * [.MESSAGE_IDS](#module_constants.MESSAGE_IDS)
    * [.BROWSER](#module_constants.BROWSER) : <code>chrome</code>
    * [.PERMA_API_BASE_URL](#module_constants.PERMA_API_BASE_URL)

<a name="module_constants.MESSAGE_IDS"></a>

### constants.MESSAGE\_IDS
Identifiers for the runtime messages passed between the extension and its service worker. 
These are meant to be passed as `messageId`.

Usage example:
```javascript
import { MESSAGE_IDS, BROWSER } from './constants'

// Sending a message, at popup level.
BROWSER.runtime.sendMessage({
 messageId: MESSAGE_IDS.ARCHIVE_CREATE_PUBLIC,
 url: urlToArchive
});

// Receiving a message, at service-worker level.
BROWSER.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.messageId === MESSAGE_IDS.ARCHIVE_CREATE_PUBLIC) {
    // Code for handling the archive creation request
  }
});
```

Message identifiers detail:
- `TAB_SWITCH`: Request to update the current tab of interest. Params: `url`, `title`.
- `AUTH_SIGN_IN`: Request to register an API key. Params: `apiKey`.
- `AUTH_SIGN_OUT`: Request to remove the currently stored API key.
- `AUTH_CHECK`: Request to check that the API currently stored is (still) valid.
- `FOLDERS_PULL_LIST`: Request to pull the list of folders the user can create links into.
- `FOLDERS_PICK_ONE`: Request to update the "default" target folder. Params: `folderId`.
- `ARCHIVE_PULL_TIMELINE`: Request to pull the list of user-owned archives available for the current url.
- `ARCHIVE_CREATE_PUBLIC`: Request to create a public archive for a given url.
- `ARCHIVE_CREATE_PRIVATE`: Request to create a private archive for a given url.
- `ARCHIVE_PRIVACY_STATUS_TOGGLE`: Request to toggle the privacy status of a given archive. Params: `guid`, `isPrivate`.
- `ARCHIVE_DELETE`: Request the deletion of an archive. Params: `guid`.
- `STATUS_CLEAN_UP`: Request a clean up of "status" (i.e: recover from hanging loading state).

**Kind**: static constant of [<code>constants</code>](#module_constants)  
<a name="module_constants.BROWSER"></a>

### constants.BROWSER : <code>chrome</code>
Proxy for accessing the browser API, which in the case of Chromium-based browser, is vendor-specific.
Will be `null` if ran outside of a browser context.

**Kind**: static constant of [<code>constants</code>](#module_constants)  
<a name="module_constants.PERMA_API_BASE_URL"></a>

### constants.PERMA\_API\_BASE\_URL
Perma.cc API's base url

**Kind**: static constant of [<code>constants</code>](#module_constants)  
