<a name="module_background/archiveCreate"></a>

## background/archiveCreate
Handler for the `ARCHIVE_CREATE_PUBLIC` and `ARCHIVE_CREATE_PRIVATE` runtime messages.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  
<a name="module_background/archiveCreate.archiveCreate"></a>

### background/archiveCreate.archiveCreate([isPrivate]) ⇒ <code>Promise.&lt;void&gt;</code>
Handler for the `ARCHIVE_CREATE_PUBLIC` and `ARCHIVE_CREATE_PRIVATE` runtime messages: 
Creates a new archive.
Automatically updates timeline for the current tab.

Triggers a loading status.

**Kind**: static method of [<code>background/archiveCreate</code>](#module_background/archiveCreate)  

| Param | Type | Default |
| --- | --- | --- |
| [isPrivate] | <code>boolean</code> | <code>false</code> | 

