<a name="module_background/tabSwitch"></a>

## background/tabSwitch
Handler for the `TAB_SWITCH` runtime message.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  
<a name="module_background/tabSwitch.tabSwitch"></a>

### background/tabSwitch.tabSwitch(url, title)
Handler for the `TAB_SWITCH` runtime message:
Updates the current tab in storage.
Will not go through if the extension is busy.

**Kind**: static method of [<code>background/tabSwitch</code>](#module_background/tabSwitch)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | Must be a valid url |
| title | <code>string</code> |  |
|  | <code>Promise.&lt;void&gt;</code> |  |

