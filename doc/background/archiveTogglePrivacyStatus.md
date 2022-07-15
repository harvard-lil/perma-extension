<a name="module_background/archiveTogglePrivacyStatus"></a>

## background/archiveTogglePrivacyStatus
Handler for the `ARCHIVE_PRIVACY_STATUS_TOGGLE` runtime message.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  
<a name="module_background/archiveTogglePrivacyStatus.archiveTogglePrivacyStatus"></a>

### background/archiveTogglePrivacyStatus.archiveTogglePrivacyStatus(guid, [isPrivate]) ⇒ <code>Promise.&lt;void&gt;</code>
Handler for the `ARCHIVE_PRIVACY_STATUS_TOGGLE` runtime message: 
Tries to toggle the privacy status of a given archive.
Automatically updates timeline for the current tab.

Triggers a loading status.

**Kind**: static method of [<code>background/archiveTogglePrivacyStatus</code>](#module_background/archiveTogglePrivacyStatus)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| guid | <code>string</code> |  |  |
| [isPrivate] | <code>boolean</code> | <code>false</code> | State the archive should be in after the update (public or private) |

