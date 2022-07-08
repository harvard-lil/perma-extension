<a name="module_database/tables/appState"></a>

## database/tables/appState
Data class and utility functions for the `appState` table.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [database/tables/appState](#module_database/tables/appState)
    * [.AppState](#module_database/tables/appState.AppState)
        * [.key](#module_database/tables/appState.AppState+key) : <code>string</code>
        * [.value](#module_database/tables/appState.AppState+value) : <code>any</code>
        * [.save()](#module_database/tables/appState.AppState+save) ⇒ <code>Promise.&lt;number&gt;</code>
    * [.KEYS](#module_database/tables/appState.KEYS)
    * [.INDEXES](#module_database/tables/appState.INDEXES)
    * [.getTable()](#module_database/tables/appState.getTable) ⇒ <code>Dexie.Table</code>
    * [.getAll()](#module_database/tables/appState.getAll) ⇒ <code>Promise.&lt;Array.&lt;AppState&gt;&gt;</code>
    * [.get(key)](#module_database/tables/appState.get) ⇒ <code>Promise.&lt;?AppState&gt;</code>
    * [.clearAll()](#module_database/tables/appState.clearAll) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.set(key, value)](#module_database/tables/appState.set) ⇒ <code>Promise.&lt;AppState&gt;</code>

<a name="module_database/tables/appState.AppState"></a>

### database/tables/appState.AppState
Data class for the "appState" database store. Represents a single piece of app state information.

**Kind**: static class of [<code>database/tables/appState</code>](#module_database/tables/appState)  

* [.AppState](#module_database/tables/appState.AppState)
    * [.key](#module_database/tables/appState.AppState+key) : <code>string</code>
    * [.value](#module_database/tables/appState.AppState+value) : <code>any</code>
    * [.save()](#module_database/tables/appState.AppState+save) ⇒ <code>Promise.&lt;number&gt;</code>

<a name="module_database/tables/appState.AppState+key"></a>

#### appState.key : <code>string</code>
Key used as an index to store this piece of user information.
Must be a key of `database.appState.KEYS

**Kind**: instance property of [<code>AppState</code>](#module_database/tables/appState.AppState)  
<a name="module_database/tables/appState.AppState+value"></a>

#### appState.value : <code>any</code>
Value associated with this entry.

**Kind**: instance property of [<code>AppState</code>](#module_database/tables/appState.AppState)  
<a name="module_database/tables/appState.AppState+save"></a>

#### appState.save() ⇒ <code>Promise.&lt;number&gt;</code>
Saves the current `AppState` entry in the database.
- If an entry already exists for the current key, the record will be replaced.

**Kind**: instance method of [<code>AppState</code>](#module_database/tables/appState.AppState)  
**Returns**: <code>Promise.&lt;number&gt;</code> - - Id of the entry that was created.  
<a name="module_database/tables/appState.KEYS"></a>

### database/tables/appState.KEYS
Lists keys that can be used to store data in the `appState` table, alongside their suggested type.
`AppState` uses this object to enforce key names checks.
There can only be 1 entry for a given key from list in the `appState` table.

Keys detail:
- `apiKey`: API key for Perma.cc, as provided by the user.
- `apiKeyChecked`: If true, indicates that the API key currently in store has been checked. 
- `lastApiKeyCheck`: Date (+time) at which the API key was checked for the last time.
- `loadingBlocking`: If `true`, indicates that the app is currently performing an operation that should be considered blocking.
- `loadingBackground`: If `true`, indicates that the app is currently performing an operation that should be considered a non-blocking.
- `folders`: Sorted array containing key/value associations (id -> name) of folders the user can write into.
- `currentFolder`: Id of the folder the user selected (last) as a destination.
- `currentTabUrl`: Url of the current tab.
- `currentTabTitle`: Title of the current tab.

**Kind**: static constant of [<code>database/tables/appState</code>](#module_database/tables/appState)  
<a name="module_database/tables/appState.INDEXES"></a>

### database/tables/appState.INDEXES
Describes the indexes used by the `appState` table. 
See Dexie's documentation: https://dexie.org/docs/Version/Version.stores()#schema-syntax

**Kind**: static constant of [<code>database/tables/appState</code>](#module_database/tables/appState)  
<a name="module_database/tables/appState.getTable"></a>

### database/tables/appState.getTable() ⇒ <code>Dexie.Table</code>
Returns a reference to the `appState` table from the database.

**Kind**: static method of [<code>database/tables/appState</code>](#module_database/tables/appState)  
<a name="module_database/tables/appState.getAll"></a>

### database/tables/appState.getAll() ⇒ <code>Promise.&lt;Array.&lt;AppState&gt;&gt;</code>
Returns all entries from the `appState` table.

**Kind**: static method of [<code>database/tables/appState</code>](#module_database/tables/appState)  
<a name="module_database/tables/appState.get"></a>

### database/tables/appState.get(key) ⇒ <code>Promise.&lt;?AppState&gt;</code>
Return a specific entry from user entry by key.

**Kind**: static method of [<code>database/tables/appState</code>](#module_database/tables/appState)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Must be a key of `database.appState.KEYS |

<a name="module_database/tables/appState.clearAll"></a>

### database/tables/appState.clearAll() ⇒ <code>Promise.&lt;void&gt;</code>
Clears the `appState` table.

**Kind**: static method of [<code>database/tables/appState</code>](#module_database/tables/appState)  
<a name="module_database/tables/appState.set"></a>

### database/tables/appState.set(key, value) ⇒ <code>Promise.&lt;AppState&gt;</code>
Creates or updates a single entry in the `appState` table.

**Kind**: static method of [<code>database/tables/appState</code>](#module_database/tables/appState)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Must be a key of `database.appState.KEYS. |
| value | <code>any</code> |  |

