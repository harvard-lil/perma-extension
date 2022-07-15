<a name="module_background/statusCleanUp"></a>

## background/statusCleanUp
Handler for the `STATUS_CLEAN_UP` runtime message.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  
<a name="module_background/statusCleanUp.statusCleanUp"></a>

### background/statusCleanUp.statusCleanUp()
Handler for the `STATUS_CLEAN_UP` runtime message: 
Clean up utility for the "status" object. Useful to recover from hangs.
Resets `isLoading` and `message` if stuck.

**Kind**: static method of [<code>background/statusCleanUp</code>](#module_background/statusCleanUp)  

| Param | Type |
| --- | --- |
|  | <code>Promise.&lt;void&gt;</code> | 

