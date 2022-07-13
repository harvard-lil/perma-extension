<a name="module_popup/handlers/onPopupOpen"></a>

## popup/handlers/onPopupOpen
Function run when the popup UI is open.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [popup/handlers/onPopupOpen](#module_popup/handlers/onPopupOpen)
    * [.onPopupOpen(e)](#module_popup/handlers/onPopupOpen.onPopupOpen)
        * [~auth](#module_popup/handlers/onPopupOpen.onPopupOpen..auth) : <code>Auth</code>
        * [~status](#module_popup/handlers/onPopupOpen.onPopupOpen..status) : <code>Status</code>

<a name="module_popup/handlers/onPopupOpen.onPopupOpen"></a>

### popup/handlers/onPopupOpen.onPopupOpen(e)
Function run when the popup UI is open.
- Updates tab-related information
- Hydrates the app (first hydration)
- Checks authentication if needed
- Updates list of available folders and available archives for the current url

Called on `DOMContentLoaded`.

**Kind**: static method of [<code>popup/handlers/onPopupOpen</code>](#module_popup/handlers/onPopupOpen)  

| Param | Type |
| --- | --- |
| e | <code>Event</code> | 


* [.onPopupOpen(e)](#module_popup/handlers/onPopupOpen.onPopupOpen)
    * [~auth](#module_popup/handlers/onPopupOpen.onPopupOpen..auth) : <code>Auth</code>
    * [~status](#module_popup/handlers/onPopupOpen.onPopupOpen..status) : <code>Status</code>

<a name="module_popup/handlers/onPopupOpen.onPopupOpen..auth"></a>

#### onPopupOpen~auth : <code>Auth</code>
**Kind**: inner property of [<code>onPopupOpen</code>](#module_popup/handlers/onPopupOpen.onPopupOpen)  
<a name="module_popup/handlers/onPopupOpen.onPopupOpen..status"></a>

#### onPopupOpen~status : <code>Status</code>
**Kind**: inner property of [<code>onPopupOpen</code>](#module_popup/handlers/onPopupOpen.onPopupOpen)  
