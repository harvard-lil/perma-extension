<a name="module_storage/Auth"></a>

## storage/Auth
Data class used to interact with the "auth" key in storage (`browser.storage.local`).

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [storage/Auth](#module_storage/Auth)
    * [.Auth](#module_storage/Auth.Auth)
        * _instance_
            * [.KEY](#module_storage/Auth.Auth+KEY)
            * [.apiKey](#module_storage/Auth.Auth+apiKey)
            * [.isChecked](#module_storage/Auth.Auth+isChecked)
            * [.lastCheck](#module_storage/Auth.Auth+lastCheck)
            * [.save()](#module_storage/Auth.Auth+save) ⇒ <code>Promise.&lt;boolean&gt;</code>
            * [.reset()](#module_storage/Auth.Auth+reset) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * _static_
            * [.fromStorage()](#module_storage/Auth.Auth.fromStorage) ⇒ <code>Promise.&lt;Auth&gt;</code>

<a name="module_storage/Auth.Auth"></a>

### storage/Auth.Auth
This class directly interacts with `browser.storage.local` to push / pull and manage the "auth" key.

**Kind**: static class of [<code>storage/Auth</code>](#module_storage/Auth)  

* [.Auth](#module_storage/Auth.Auth)
    * _instance_
        * [.KEY](#module_storage/Auth.Auth+KEY)
        * [.apiKey](#module_storage/Auth.Auth+apiKey)
        * [.isChecked](#module_storage/Auth.Auth+isChecked)
        * [.lastCheck](#module_storage/Auth.Auth+lastCheck)
        * [.save()](#module_storage/Auth.Auth+save) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.reset()](#module_storage/Auth.Auth+reset) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * _static_
        * [.fromStorage()](#module_storage/Auth.Auth.fromStorage) ⇒ <code>Promise.&lt;Auth&gt;</code>

<a name="module_storage/Auth.Auth+KEY"></a>

#### auth.KEY
Key given to this object in `browser.storage.local`.

**Kind**: instance property of [<code>Auth</code>](#module_storage/Auth.Auth)  
<a name="module_storage/Auth.Auth+apiKey"></a>

#### auth.apiKey
**Kind**: instance property of [<code>Auth</code>](#module_storage/Auth.Auth)  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>any</code> | Will be cast into a string. |

<a name="module_storage/Auth.Auth+isChecked"></a>

#### auth.isChecked
**Kind**: instance property of [<code>Auth</code>](#module_storage/Auth.Auth)  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>any</code> | Will be cast into a boolean |

<a name="module_storage/Auth.Auth+lastCheck"></a>

#### auth.lastCheck
**Kind**: instance property of [<code>Auth</code>](#module_storage/Auth.Auth)  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>any</code> | Will try to read date from string if not null. |

<a name="module_storage/Auth.Auth+save"></a>

#### auth.save() ⇒ <code>Promise.&lt;boolean&gt;</code>
Saves the current object in store.

**Kind**: instance method of [<code>Auth</code>](#module_storage/Auth.Auth)  
<a name="module_storage/Auth.Auth+reset"></a>

#### auth.reset() ⇒ <code>Promise.&lt;boolean&gt;</code>
Replaces the current object in store with an "empty" one.

**Kind**: instance method of [<code>Auth</code>](#module_storage/Auth.Auth)  
<a name="module_storage/Auth.Auth.fromStorage"></a>

#### Auth.fromStorage() ⇒ <code>Promise.&lt;Auth&gt;</code>
Creates and returns an instance of `Auth` using data from storage.
Use this static method to load "auth" from storage.

Usage:
```
const auth = await Auth.fromStorage();
```

**Kind**: static method of [<code>Auth</code>](#module_storage/Auth.Auth)  
