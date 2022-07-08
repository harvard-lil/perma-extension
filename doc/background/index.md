<a name="module_background"></a>

## background
Entrypoint of the extension's service worker. Handles incoming runtime messages and time-based background tasks.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [background](#module_background)
    * [~backgroundMessageHandler(message, [sender], [sendResponse])](#module_background..backgroundMessageHandler) ⇒ <code>Promise</code>
    * [~tabSwitch(url, title)](#module_background..tabSwitch)
    * [~authSignIn(apiKey)](#module_background..authSignIn) ⇒ <code>Promise.&lt;void&gt;</code>
    * [~authSignOut()](#module_background..authSignOut) ⇒ <code>Promise.&lt;void&gt;</code>
    * [~authCheck()](#module_background..authCheck) ⇒ <code>Promise.&lt;void&gt;</code>
    * [~foldersPullList()](#module_background..foldersPullList) ⇒ <code>Promise.&lt;void&gt;</code>
        * [~recursivePull(folderId, folders, api, [depth])](#module_background..foldersPullList..recursivePull)
    * [~foldersPick(folderId)](#module_background..foldersPick) ⇒ <code>Promise.&lt;void&gt;</code>
    * [~archivePullTimeline()](#module_background..archivePullTimeline) ⇒ <code>Promise.&lt;void&gt;</code>
    * [~archiveCreate([isPrivate])](#module_background..archiveCreate) ⇒ <code>Promise.&lt;void&gt;</code>
    * [~archiveTogglePrivacyStatus(guid, [isPrivate])](#module_background..archiveTogglePrivacyStatus) ⇒ <code>Promise.&lt;void&gt;</code>
    * [~archiveDelete(guid)](#module_background..archiveDelete) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="module_background..backgroundMessageHandler"></a>

### background~backgroundMessageHandler(message, [sender], [sendResponse]) ⇒ <code>Promise</code>
Handles incoming messages.
This function runs for every incoming `runtime` message.
See `constants.MESSAGE_IDS` for details regarding the messages handled.

**Kind**: inner method of [<code>background</code>](#module_background)  

| Param | Type |
| --- | --- |
| message | <code>Object</code> | 
| [sender] | <code>chrome.runtime.MessageSender</code> | 
| [sendResponse] | <code>function</code> | 

<a name="module_background..tabSwitch"></a>

### background~tabSwitch(url, title)
Updates `appState.currentTabUrl` and `appState.currentTabTitle` if:
- Provided and valid.
- `appState.loadingBlocking` and `appState.loadingBackground` are not true.

Called on `TAB_SWITCH`.

**Kind**: inner method of [<code>background</code>](#module_background)  

| Param | Type |
| --- | --- |
| url | <code>string</code> | 
| title | <code>string</code> | 
|  | <code>Promise.&lt;void&gt;</code> | 

<a name="module_background..authSignIn"></a>

### background~authSignIn(apiKey) ⇒ <code>Promise.&lt;void&gt;</code>
Verifies and stores a Perma API key (`appState.apiKey`).
Called on `AUTH_SIGN_IN`.

**Kind**: inner method of [<code>background</code>](#module_background)  

| Param | Type |
| --- | --- |
| apiKey | <code>string</code> | 

<a name="module_background..authSignOut"></a>

### background~authSignOut() ⇒ <code>Promise.&lt;void&gt;</code>
Clears personal information from the database.
Called on `AUTH_SIGN_OUT`.

**Kind**: inner method of [<code>background</code>](#module_background)  
<a name="module_background..authCheck"></a>

### background~authCheck() ⇒ <code>Promise.&lt;void&gt;</code>
Checks that the Perma API key stored in the database is valid. 
Clears user data (and throws) otherwise.
Called on `AUTH_CHECK`.

**Kind**: inner method of [<code>background</code>](#module_background)  
<a name="module_background..foldersPullList"></a>

### background~foldersPullList() ⇒ <code>Promise.&lt;void&gt;</code>
Pulls and stores the list of all the folders the user can write into. 
This data is stored in `appState.folders`
Called on `FOLDERS_PULL_LIST`.

`folders` format:
```
[
  { id: 158296, name: 'Personal Links' },
  { id: 161019, name: '- Foo' },
  { id: 161022, name: '- Lorem' },
  { id: 161020, name: '-- Bar' },
  { id: 161021, name: '-- Baz' },
  { id: 161023, name: '-- Ipsum' },
  { id: 161026, name: '--- Amet' },
  { id: 161024, name: '--- Dolor' },
  { id: 161025, name: '--- Sit' },
  { id: 161029, name: '---- Consequentur' }
]
```

**Kind**: inner method of [<code>background</code>](#module_background)  
<a name="module_background..foldersPullList..recursivePull"></a>

#### foldersPullList~recursivePull(folderId, folders, api, [depth])
Utility function to recursively traverse the folders tree and append info to the `folders` array.

**Kind**: inner method of [<code>foldersPullList</code>](#module_background..foldersPullList)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| folderId | <code>number</code> |  | Folder id of the parent |
| folders | <code>array</code> |  | Reference to the `folders` array to append to |
| api | <code>PermaAPI</code> |  | PermaAPI instance to use |
| [depth] | <code>number</code> | <code>1</code> | Used to represent the nesting level of the folders. |

<a name="module_background..foldersPick"></a>

### background~foldersPick(folderId) ⇒ <code>Promise.&lt;void&gt;</code>
Sets `appState.currentFolder`.
Called on `FOLDERS_PICK`.

**Kind**: inner method of [<code>background</code>](#module_background)  

| Param | Type |
| --- | --- |
| folderId | <code>number</code> | 

<a name="module_background..archivePullTimeline"></a>

### background~archivePullTimeline() ⇒ <code>Promise.&lt;void&gt;</code>
Pulls and stores a list archives created by the user for the current tab.
Clears user data (and throws) otherwise.
Called on `ARCHIVE_PULL_TIMELINE`.

**Kind**: inner method of [<code>background</code>](#module_background)  
<a name="module_background..archiveCreate"></a>

### background~archiveCreate([isPrivate]) ⇒ <code>Promise.&lt;void&gt;</code>
Creates a new archive.
Automatically calls `archivePullTimeline` to update the timeline for the current tab.
Called on `ARCHIVE_CREATE_PUBLIC` and `ARCHIVE_CREATE_PRIVATE`.

**Kind**: inner method of [<code>background</code>](#module_background)  

| Param | Type | Default |
| --- | --- | --- |
| [isPrivate] | <code>boolean</code> | <code>false</code> | 

<a name="module_background..archiveTogglePrivacyStatus"></a>

### background~archiveTogglePrivacyStatus(guid, [isPrivate]) ⇒ <code>Promise.&lt;void&gt;</code>
Tries to toggle the privacy status of a given archive.
Automatically calls `archivePullTimeline` to update the timeline for the current tab.
Called on `ARCHIVE_PRIVACY_STATUS_TOGGLE`.

**Kind**: inner method of [<code>background</code>](#module_background)  

| Param | Type | Default |
| --- | --- | --- |
| guid | <code>string</code> |  | 
| [isPrivate] | <code>boolean</code> | <code>false</code> | 

<a name="module_background..archiveDelete"></a>

### background~archiveDelete(guid) ⇒ <code>Promise.&lt;void&gt;</code>
Tries to delete an archive.
Automatically calls `archivePullTimeline` to update the timeline for the current tab.
Called on `ARCHIVE_DELETE`.

**Kind**: inner method of [<code>background</code>](#module_background)  

| Param | Type |
| --- | --- |
| guid | <code>string</code> | 

