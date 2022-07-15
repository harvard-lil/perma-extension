<a name="module_storage/Folders"></a>

## storage/Folders
Data class used to interact with the "folders" key in storage (`browser.storage.local`).

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [storage/Folders](#module_storage/Folders)
    * [.Folders](#module_storage/Folders.Folders)
        * _instance_
            * [.KEY](#module_storage/Folders.Folders+KEY)
            * [.pick](#module_storage/Folders.Folders+pick)
            * [.available](#module_storage/Folders.Folders+available)
            * [.save()](#module_storage/Folders.Folders+save) ⇒ <code>Promise.&lt;boolean&gt;</code>
            * [.reset()](#module_storage/Folders.Folders+reset) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * _static_
            * [.fromStorage()](#module_storage/Folders.Folders.fromStorage) ⇒ <code>Promise.&lt;Folders&gt;</code>

<a name="module_storage/Folders.Folders"></a>

### storage/Folders.Folders
This class directly interacts with `browser.storage.local` to push / pull and manage the "folders" key.

**Kind**: static class of [<code>storage/Folders</code>](#module_storage/Folders)  

* [.Folders](#module_storage/Folders.Folders)
    * _instance_
        * [.KEY](#module_storage/Folders.Folders+KEY)
        * [.pick](#module_storage/Folders.Folders+pick)
        * [.available](#module_storage/Folders.Folders+available)
        * [.save()](#module_storage/Folders.Folders+save) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.reset()](#module_storage/Folders.Folders+reset) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * _static_
        * [.fromStorage()](#module_storage/Folders.Folders.fromStorage) ⇒ <code>Promise.&lt;Folders&gt;</code>

<a name="module_storage/Folders.Folders+KEY"></a>

#### folders.KEY
Key given to this object in `browser.storage.local`.

**Kind**: instance property of [<code>Folders</code>](#module_storage/Folders.Folders)  
<a name="module_storage/Folders.Folders+pick"></a>

#### folders.pick
**Kind**: instance property of [<code>Folders</code>](#module_storage/Folders.Folders)  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>any</code> | Will be run through `parseInt`. |

<a name="module_storage/Folders.Folders+available"></a>

#### folders.available
**Kind**: instance property of [<code>Folders</code>](#module_storage/Folders.Folders)  

| Param | Type |
| --- | --- |
| newValue | <code>Array</code> | 

<a name="module_storage/Folders.Folders+save"></a>

#### folders.save() ⇒ <code>Promise.&lt;boolean&gt;</code>
Saves the current object in store.
Checks and validates `this.#available` before saving to make sure it is an array of objects containing `id` and `name`.

**Kind**: instance method of [<code>Folders</code>](#module_storage/Folders.Folders)  
<a name="module_storage/Folders.Folders+reset"></a>

#### folders.reset() ⇒ <code>Promise.&lt;boolean&gt;</code>
Replaces the current object in store with an "empty" one.

**Kind**: instance method of [<code>Folders</code>](#module_storage/Folders.Folders)  
<a name="module_storage/Folders.Folders.fromStorage"></a>

#### Folders.fromStorage() ⇒ <code>Promise.&lt;Folders&gt;</code>
Creates and returns an instance of `Folders` using data from storage.
Use this static method to load "folders" from storage.

Usage:
```javascript
const status = await Folders.fromStorage();
```

**Kind**: static method of [<code>Folders</code>](#module_storage/Folders.Folders)  
