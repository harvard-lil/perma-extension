<a name="module_popup/handlers/onPopupOpen"></a>

## popup/handlers/onPopupOpen
Function run when the popup UI is open.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [popup/handlers/onPopupOpen](#module_popup/handlers/onPopupOpen)
    * _static_
        * [.onPopupOpen(e)](#module_popup/handlers/onPopupOpen.onPopupOpen)
    * _inner_
        * [~sendMessageIfAuth(messageId)](#module_popup/handlers/onPopupOpen..sendMessageIfAuth) ⇒ <code>Promise.&lt;void&gt;</code>

<a name="module_popup/handlers/onPopupOpen.onPopupOpen"></a>

### popup/handlers/onPopupOpen.onPopupOpen(e)
Function run when the popup UI is open.
- Updates tab-related information
- Hydrates the app using data from storage (first hydration)
- Checks authentication as needed
- Schedule runtime messages 

Called on `DOMContentLoaded`.

**Kind**: static method of [<code>popup/handlers/onPopupOpen</code>](#module_popup/handlers/onPopupOpen)  

| Param | Type |
| --- | --- |
| e | <code>Event</code> | 

<a name="module_popup/handlers/onPopupOpen..sendMessageIfAuth"></a>

### popup/handlers/onPopupOpen~sendMessageIfAuth(messageId) ⇒ <code>Promise.&lt;void&gt;</code>
Sends a given runtime message if user is authenticated.
Pulls latest Auth info from storage.

**Kind**: inner method of [<code>popup/handlers/onPopupOpen</code>](#module_popup/handlers/onPopupOpen)  

| Param | Type |
| --- | --- |
| messageId | <code>number</code> | 

