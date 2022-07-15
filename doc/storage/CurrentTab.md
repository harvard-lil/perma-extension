<a name="module_storage/CurrentTab"></a>

## storage/CurrentTab
Data class used to interact with the "currentTab" key in storage (`browser.storage.local`).

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [storage/CurrentTab](#module_storage/CurrentTab)
    * [.CurrentTab](#module_storage/CurrentTab.CurrentTab)
        * _instance_
            * [.KEY](#module_storage/CurrentTab.CurrentTab+KEY)
            * [.url](#module_storage/CurrentTab.CurrentTab+url)
            * [.title](#module_storage/CurrentTab.CurrentTab+title)
            * [.save()](#module_storage/CurrentTab.CurrentTab+save) ⇒ <code>Promise.&lt;boolean&gt;</code>
            * [.reset()](#module_storage/CurrentTab.CurrentTab+reset) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * _static_
            * [.fromStorage()](#module_storage/CurrentTab.CurrentTab.fromStorage) ⇒ <code>Promise.&lt;CurrentTab&gt;</code>

<a name="module_storage/CurrentTab.CurrentTab"></a>

### storage/CurrentTab.CurrentTab
This class directly interacts with `browser.storage.local` to push / pull and manage the "currentTab" key.

**Kind**: static class of [<code>storage/CurrentTab</code>](#module_storage/CurrentTab)  

* [.CurrentTab](#module_storage/CurrentTab.CurrentTab)
    * _instance_
        * [.KEY](#module_storage/CurrentTab.CurrentTab+KEY)
        * [.url](#module_storage/CurrentTab.CurrentTab+url)
        * [.title](#module_storage/CurrentTab.CurrentTab+title)
        * [.save()](#module_storage/CurrentTab.CurrentTab+save) ⇒ <code>Promise.&lt;boolean&gt;</code>
        * [.reset()](#module_storage/CurrentTab.CurrentTab+reset) ⇒ <code>Promise.&lt;boolean&gt;</code>
    * _static_
        * [.fromStorage()](#module_storage/CurrentTab.CurrentTab.fromStorage) ⇒ <code>Promise.&lt;CurrentTab&gt;</code>

<a name="module_storage/CurrentTab.CurrentTab+KEY"></a>

#### currentTab.KEY
Key given to this object in `browser.storage.local`.

**Kind**: instance property of [<code>CurrentTab</code>](#module_storage/CurrentTab.CurrentTab)  
<a name="module_storage/CurrentTab.CurrentTab+url"></a>

#### currentTab.url
**Kind**: instance property of [<code>CurrentTab</code>](#module_storage/CurrentTab.CurrentTab)  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>any</code> | Will be cast into a string. `<` and `>` will be encoded. |

<a name="module_storage/CurrentTab.CurrentTab+title"></a>

#### currentTab.title
**Kind**: instance property of [<code>CurrentTab</code>](#module_storage/CurrentTab.CurrentTab)  

| Param | Type | Description |
| --- | --- | --- |
| newValue | <code>any</code> | Will be cast into a string. `<` and `>` will be encoded. |

<a name="module_storage/CurrentTab.CurrentTab+save"></a>

#### currentTab.save() ⇒ <code>Promise.&lt;boolean&gt;</code>
Saves the current object in store.

**Kind**: instance method of [<code>CurrentTab</code>](#module_storage/CurrentTab.CurrentTab)  
<a name="module_storage/CurrentTab.CurrentTab+reset"></a>

#### currentTab.reset() ⇒ <code>Promise.&lt;boolean&gt;</code>
Replaces the current object in store with an "empty" one.

**Kind**: instance method of [<code>CurrentTab</code>](#module_storage/CurrentTab.CurrentTab)  
<a name="module_storage/CurrentTab.CurrentTab.fromStorage"></a>

#### CurrentTab.fromStorage() ⇒ <code>Promise.&lt;CurrentTab&gt;</code>
Creates and returns an instance of `CurrentTab` using data from storage.
Use this static method to load "currentTab" from storage.

Usage:
```
const status = await CurrentTab.fromStorage();
```

**Kind**: static method of [<code>CurrentTab</code>](#module_storage/CurrentTab.CurrentTab)  
