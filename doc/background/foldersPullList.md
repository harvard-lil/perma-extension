<a name="module_background/foldersPullList"></a>

## background/foldersPullList
Handler for the `FOLDERS_PULL_LIST` runtime message.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [background/foldersPullList](#module_background/foldersPullList)
    * _static_
        * [.foldersPullList()](#module_background/foldersPullList.foldersPullList) ⇒ <code>Promise.&lt;void&gt;</code>
    * _inner_
        * [~recursivePull(folderId, folders, api, [depth])](#module_background/foldersPullList..recursivePull)

<a name="module_background/foldersPullList.foldersPullList"></a>

### background/foldersPullList.foldersPullList() ⇒ <code>Promise.&lt;void&gt;</code>
Handler for the `FOLDERS_PULL_LIST` runtime message:
Pulls and stores the list of all the folders the user can write into, sorted hierarchically.

See `storage.Folders.#available` for information regarding the expected format.

**Kind**: static method of [<code>background/foldersPullList</code>](#module_background/foldersPullList)  
<a name="module_background/foldersPullList..recursivePull"></a>

### background/foldersPullList~recursivePull(folderId, folders, api, [depth])
Utility function to recursively traverse the folders tree and append info to the `folders` array.

**Kind**: inner method of [<code>background/foldersPullList</code>](#module_background/foldersPullList)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| folderId | <code>number</code> |  | Folder id of the parent |
| folders | <code>array</code> |  | Reference to the `folders` array to append to |
| api | <code>PermaAPI</code> |  | PermaAPI instance to use |
| [depth] | <code>number</code> | <code>1</code> | Used to represent the nesting level of the folders. |

