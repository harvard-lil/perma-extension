<a name="module_database/tables/logs"></a>

## database/tables/logs
Data class and utility functions for the `logs` table.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [database/tables/logs](#module_database/tables/logs)
    * [.INDEXES](#module_database/tables/logs.INDEXES)
    * [.getTable()](#module_database/tables/logs.getTable) ⇒ <code>Dexie.Table</code>
    * [.getAll([timelineMode])](#module_database/tables/logs.getAll) ⇒ <code>Promise.&lt;Array.&lt;Log&gt;&gt;</code>
    * [.getMostRecent()](#module_database/tables/logs.getMostRecent) ⇒ <code>Promise.&lt;?Log&gt;</code>
    * [.clearAll()](#module_database/tables/logs.clearAll) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.add(messageKey, [isError])](#module_database/tables/logs.add) ⇒ <code>Promise.&lt;Log&gt;</code>

<a name="module_database/tables/logs.INDEXES"></a>

### database/tables/logs.INDEXES
Describes the indexes used by the `appState` table. 
See Dexie's documentation: https://dexie.org/docs/Version/Version.stores()#schema-syntax

**Kind**: static constant of [<code>database/tables/logs</code>](#module_database/tables/logs)  
<a name="module_database/tables/logs.getTable"></a>

### database/tables/logs.getTable() ⇒ <code>Dexie.Table</code>
Returns a reference to the `logs` table from the database.

**Kind**: static method of [<code>database/tables/logs</code>](#module_database/tables/logs)  
<a name="module_database/tables/logs.getAll"></a>

### database/tables/logs.getAll([timelineMode]) ⇒ <code>Promise.&lt;Array.&lt;Log&gt;&gt;</code>
Returns all entries from the `logs` table.

**Kind**: static method of [<code>database/tables/logs</code>](#module_database/tables/logs)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [timelineMode] | <code>boolean</code> | <code>true</code> | If true, will sort entries by createdAt desc. |

<a name="module_database/tables/logs.getMostRecent"></a>

### database/tables/logs.getMostRecent() ⇒ <code>Promise.&lt;?Log&gt;</code>
Returns the most recent entry from the `log` table.

**Kind**: static method of [<code>database/tables/logs</code>](#module_database/tables/logs)  
<a name="module_database/tables/logs.clearAll"></a>

### database/tables/logs.clearAll() ⇒ <code>Promise.&lt;void&gt;</code>
Clears the `logs` table.

**Kind**: static method of [<code>database/tables/logs</code>](#module_database/tables/logs)  
<a name="module_database/tables/logs.add"></a>

### database/tables/logs.add(messageKey, [isError]) ⇒ <code>Promise.&lt;Log&gt;</code>
Creates a new log entry.

**Kind**: static method of [<code>database/tables/logs</code>](#module_database/tables/logs)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| messageKey | <code>string</code> |  | Should match a key from `browser.i18n`. |
| [isError] | <code>boolean</code> | <code>false</code> |  |

