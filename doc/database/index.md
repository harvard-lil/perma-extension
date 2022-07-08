<a name="module_database"></a>

## database
Entry point for the shared database module. Uses Dexie to define and manage IndexedDB tables.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [database](#module_database)
    * _static_
        * [.database](#module_database.database)
        * [.getDatabase(databaseName)](#module_database.getDatabase) ⇒ <code>Dexie</code>
        * [.deleteDatabase(databaseName)](#module_database.deleteDatabase) ⇒ <code>Promise.&lt;void&gt;</code>
    * _inner_
        * [~dbRef](#module_database..dbRef) : <code>Dexie</code>

<a name="module_database.database"></a>

### database.database
Reference to individual table modules, containing data classes and functions to help work with database tables.

These modules automatically connect to the app's database.

Usage example:
```
import { database } from './database/index.js';

// Using a utility function
const logs = await database.logs.getAll();

// Direct access to the database table (`Dexie.Table` reference)
const table = database.logs.getTable();
```

See `database.tables` for more information about each table.

**Kind**: static constant of [<code>database</code>](#module_database)  
<a name="module_database.getDatabase"></a>

### database.getDatabase(databaseName) ⇒ <code>Dexie</code>
Returns a Dexie database instance, initialized using the app's schema.
Uses a module-level reference to prevent unnecessary duplicate connections. 

See `shared.database.tables` for details about each table.

**Kind**: static method of [<code>database</code>](#module_database)  
**Returns**: <code>Dexie</code> - Database instance.  

| Param | Type | Description |
| --- | --- | --- |
| databaseName | <code>string</code> | If not given, `shared.constants.DATABASE_NAME` will be used by default. |

<a name="module_database.deleteDatabase"></a>

### database.deleteDatabase(databaseName) ⇒ <code>Promise.&lt;void&gt;</code>
Deletes a given Dexie-managed IndexedDB.
Will also clear out module-level reference to the database.

**Kind**: static method of [<code>database</code>](#module_database)  

| Param | Type | Description |
| --- | --- | --- |
| databaseName | <code>string</code> | If not given, `shared.constants.DATABASE_NAME` will be used by default. |

<a name="module_database..dbRef"></a>

### database~dbRef : <code>Dexie</code>
Local reference to a database instance.

**Kind**: inner property of [<code>database</code>](#module_database)  
