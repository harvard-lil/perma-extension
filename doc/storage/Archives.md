<a name="module_storage/Archives"></a>

## storage/Archives
Data class used to interact with the "archives" key in storage (`browser.storage.local`).

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [storage/Archives](#module_storage/Archives)
    * [.Archives](#module_storage/Archives.Archives)
        * _instance_
            * [.KEY](#module_storage/Archives.Archives+KEY)
            * [.byUrl](#module_storage/Archives.Archives+byUrl)
            * [.save()](#module_storage/Archives.Archives+save) ⇒ <code>Promise.&lt;boolean&gt;</code>
            * [.reset()](#module_storage/Archives.Archives+reset) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * _static_
            * [.fromStorage()](#module_storage/Archives.Archives.fromStorage) ⇒ <code>Promise.&lt;Archives&gt;</code>

<a name="module_storage/Archives.Archives"></a>

### storage/Archives.Archives
This class directly interacts with `browser.storage.local` to push / pull and manage the "archives" key.

**Kind**: static class of [<code>storage/Archives</code>](#module_storage/Archives)  

* [.Archives](#module_storage/Archives.Archives)
    * _instance_
        * [.KEY](#module_storage/Archives.Archives+KEY)
        * [.byUrl](#module_storage/Archives.Archives+byUrl)
        * [.save()](#module_storage/Archives.Archives+save) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.reset()](#module_storage/Archives.Archives+reset) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * _static_
        * [.fromStorage()](#module_storage/Archives.Archives.fromStorage) ⇒ <code>Promise.&lt;Archives&gt;</code>

<a name="module_storage/Archives.Archives+KEY"></a>

#### archives.KEY
Key given to this object in `browser.storage.local`.

**Kind**: instance property of [<code>Archives</code>](#module_storage/Archives.Archives)  
<a name="module_storage/Archives.Archives+byUrl"></a>

#### archives.byUrl
**Kind**: instance property of [<code>Archives</code>](#module_storage/Archives.Archives)  

| Param | Type |
| --- | --- |
| newValue | <code>Object</code> | 

<a name="module_storage/Archives.Archives+save"></a>

#### archives.save() ⇒ <code>Promise.&lt;boolean&gt;</code>
Saves the current object in store.
Checks and validates `this.#byUrl` before saving to make sure it is an object of PermaArchive, indexed by url.

**Kind**: instance method of [<code>Archives</code>](#module_storage/Archives.Archives)  
<a name="module_storage/Archives.Archives+reset"></a>

#### archives.reset() ⇒ <code>Promise.&lt;boolean&gt;</code>
Replaces the current object in store with an "empty" one.

**Kind**: instance method of [<code>Archives</code>](#module_storage/Archives.Archives)  
<a name="module_storage/Archives.Archives.fromStorage"></a>

#### Archives.fromStorage() ⇒ <code>Promise.&lt;Archives&gt;</code>
Creates and returns an instance of `Folders` using data from storage.
Use this static method to load "folders" from storage.

Usage:
```
const status = await Folders.fromStorage();
```

**Kind**: static method of [<code>Archives</code>](#module_storage/Archives.Archives)  
