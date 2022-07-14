<a name="module_storage/Status"></a>

## storage/Status
Data class used to interact with the "status" key in storage (`browser.storage.local`).

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [storage/Status](#module_storage/Status)
    * [.Status](#module_storage/Status.Status)
        * _instance_
            * [.KEY](#module_storage/Status.Status+KEY)
            * [.isLoading](#module_storage/Status.Status+isLoading)
            * [.lastLoadingInit](#module_storage/Status.Status+lastLoadingInit)
            * [.message](#module_storage/Status.Status+message)
            * [.save()](#module_storage/Status.Status+save) ⇒ <code>Promise.&lt;boolean&gt;</code>
            * [.reset()](#module_storage/Status.Status+reset) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * _static_
            * [.fromStorage()](#module_storage/Status.Status.fromStorage) ⇒ <code>Promise.&lt;Status&gt;</code>

<a name="module_storage/Status.Status"></a>

### storage/Status.Status
This class directly interacts with `browser.storage.local` to push / pull and manage the "status" key.

**Kind**: static class of [<code>storage/Status</code>](#module_storage/Status)  

* [.Status](#module_storage/Status.Status)
    * _instance_
        * [.KEY](#module_storage/Status.Status+KEY)
        * [.isLoading](#module_storage/Status.Status+isLoading)
        * [.lastLoadingInit](#module_storage/Status.Status+lastLoadingInit)
        * [.message](#module_storage/Status.Status+message)
        * [.save()](#module_storage/Status.Status+save) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.reset()](#module_storage/Status.Status+reset) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * _static_
        * [.fromStorage()](#module_storage/Status.Status.fromStorage) ⇒ <code>Promise.&lt;Status&gt;</code>

<a name="module_storage/Status.Status+KEY"></a>

#### status.KEY
Key given to this object in `browser.storage.local`.

**Kind**: instance property of [<code>Status</code>](#module_storage/Status.Status)  
<a name="module_storage/Status.Status+isLoading"></a>

#### status.isLoading
**Kind**: instance property of [<code>Status</code>](#module_storage/Status.Status)  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>any</code> | Will be cast into a boolean |

<a name="module_storage/Status.Status+lastLoadingInit"></a>

#### status.lastLoadingInit
**Kind**: instance property of [<code>Status</code>](#module_storage/Status.Status)  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>any</code> | Will try to read date from string if not null. |

<a name="module_storage/Status.Status+message"></a>

#### status.message
**Kind**: instance property of [<code>Status</code>](#module_storage/Status.Status)  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>any</code> | Will be cast into a string. |

<a name="module_storage/Status.Status+save"></a>

#### status.save() ⇒ <code>Promise.&lt;boolean&gt;</code>
Saves the current object in store.

Note:
Automatically sets `lastLoadingInit` is `isLoading` is `true`.

**Kind**: instance method of [<code>Status</code>](#module_storage/Status.Status)  
<a name="module_storage/Status.Status+reset"></a>

#### status.reset() ⇒ <code>Promise.&lt;boolean&gt;</code>
Replaces the current object in store with an "empty" one.

**Kind**: instance method of [<code>Status</code>](#module_storage/Status.Status)  
<a name="module_storage/Status.Status.fromStorage"></a>

#### Status.fromStorage() ⇒ <code>Promise.&lt;Status&gt;</code>
Creates and returns an instance of `Status` using data from storage.
Use this static method to load "status" from storage.

Usage:
```
const status = await Status.fromStorage();
```

**Kind**: static method of [<code>Status</code>](#module_storage/Status.Status)  
