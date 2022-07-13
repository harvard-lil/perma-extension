<a name="module_background/authCheck"></a>

## background/authCheck
Handler for the `AUTH_CHECK` runtime message.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  
<a name="module_background/authCheck.authCheck"></a>

### background/authCheck.authCheck() ⇒ <code>Promise.&lt;void&gt;</code>
Handler for the `AUTH_CHECK` runtime message:
Checks that the Perma API key currently stored is valid (if any). 
Clears user data (and throws) otherwise.

**Kind**: static method of [<code>background/authCheck</code>](#module_background/authCheck)  
