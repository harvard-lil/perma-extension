<a name="module_database/tables/archives"></a>

## database/tables/archives
Data class and utility functions for the `archives` table.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [database/tables/archives](#module_database/tables/archives)
    * [.Archive](#module_database/tables/archives.Archive)
        * [.guid](#module_database/tables/archives.Archive+guid) : <code>string</code>
        * [.url](#module_database/tables/archives.Archive+url) : <code>string</code>
        * [.data](#module_database/tables/archives.Archive+data) : <code>PermaArchive</code>
        * [.save()](#module_database/tables/archives.Archive+save) ⇒ <code>Promise.&lt;number&gt;</code>
    * [.INDEXES](#module_database/tables/archives.INDEXES)
    * [.getTable()](#module_database/tables/archives.getTable) ⇒ <code>Dexie.Table</code>
    * [.clearAll()](#module_database/tables/archives.clearAll) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.getByUrl(url, [timelineMode])](#module_database/tables/archives.getByUrl) ⇒ <code>Promise.&lt;Array.&lt;Archive&gt;&gt;</code>
    * [.add(archiveData)](#module_database/tables/archives.add) ⇒ <code>Promise.&lt;Archive&gt;</code>

<a name="module_database/tables/archives.Archive"></a>

### database/tables/archives.Archive
Data class for the "archives" database store.

**Kind**: static class of [<code>database/tables/archives</code>](#module_database/tables/archives)  

* [.Archive](#module_database/tables/archives.Archive)
    * [.guid](#module_database/tables/archives.Archive+guid) : <code>string</code>
    * [.url](#module_database/tables/archives.Archive+url) : <code>string</code>
    * [.data](#module_database/tables/archives.Archive+data) : <code>PermaArchive</code>
    * [.save()](#module_database/tables/archives.Archive+save) ⇒ <code>Promise.&lt;number&gt;</code>

<a name="module_database/tables/archives.Archive+guid"></a>

#### archive.guid : <code>string</code>
Should be taken from PermaArchive.guid.

**Kind**: instance property of [<code>Archive</code>](#module_database/tables/archives.Archive)  
<a name="module_database/tables/archives.Archive+url"></a>

#### archive.url : <code>string</code>
Should be taken from PermaArchive.url.

**Kind**: instance property of [<code>Archive</code>](#module_database/tables/archives.Archive)  
<a name="module_database/tables/archives.Archive+data"></a>

#### archive.data : <code>PermaArchive</code>
**Kind**: instance property of [<code>Archive</code>](#module_database/tables/archives.Archive)  
<a name="module_database/tables/archives.Archive+save"></a>

#### archive.save() ⇒ <code>Promise.&lt;number&gt;</code>
Saves the current `Log` entry in the database.

**Kind**: instance method of [<code>Archive</code>](#module_database/tables/archives.Archive)  
**Returns**: <code>Promise.&lt;number&gt;</code> - - Id of the new entry  
<a name="module_database/tables/archives.INDEXES"></a>

### database/tables/archives.INDEXES
Describes the indexes used by the `archives` table. 
See Dexie's documentation: https://dexie.org/docs/Version/Version.stores()#schema-syntax

**Kind**: static constant of [<code>database/tables/archives</code>](#module_database/tables/archives)  
<a name="module_database/tables/archives.getTable"></a>

### database/tables/archives.getTable() ⇒ <code>Dexie.Table</code>
Returns a reference to the `archives` table from the database.

**Kind**: static method of [<code>database/tables/archives</code>](#module_database/tables/archives)  
<a name="module_database/tables/archives.clearAll"></a>

### database/tables/archives.clearAll() ⇒ <code>Promise.&lt;void&gt;</code>
Clears the `archives` table.

**Kind**: static method of [<code>database/tables/archives</code>](#module_database/tables/archives)  
<a name="module_database/tables/archives.getByUrl"></a>

### database/tables/archives.getByUrl(url, [timelineMode]) ⇒ <code>Promise.&lt;Array.&lt;Archive&gt;&gt;</code>
Pulls all entries by url.

**Kind**: static method of [<code>database/tables/archives</code>](#module_database/tables/archives)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| url | <code>string</code> |  |  |
| [timelineMode] | <code>boolean</code> | <code>true</code> | If true, will sort entries by data.creation_timestamp desc. |

<a name="module_database/tables/archives.add"></a>

### database/tables/archives.add(archiveData) ⇒ <code>Promise.&lt;Archive&gt;</code>
Adds an entry to the `archives` table.

**Kind**: static method of [<code>database/tables/archives</code>](#module_database/tables/archives)  

| Param | Type |
| --- | --- |
| archiveData | <code>PermaArchive</code> | 

