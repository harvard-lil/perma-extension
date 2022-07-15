<a name="module_background"></a>

## background
Entrypoint of the extension's service worker. Handles incoming runtime messages and time-based background tasks.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  
<a name="module_background..backgroundMessageHandler"></a>

### background~backgroundMessageHandler(message, [sender], [sendResponse])
Handles incoming messages.
This function runs for every incoming `runtime` message.
See `constants.MESSAGE_IDS` for details regarding the messages handled.

**Kind**: inner method of [<code>background</code>](#module_background)  

| Param | Type |
| --- | --- |
| message | <code>Object</code> | 
| [sender] | <code>chrome.runtime.MessageSender</code> | 
| [sendResponse] | <code>function</code> | 

