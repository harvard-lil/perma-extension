<a name="module_popup/components/ArchiveForm"></a>

## popup/components/ArchiveForm
`<archive-form>` custom element.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [popup/components/ArchiveForm](#module_popup/components/ArchiveForm)
    * [.ArchiveForm](#module_popup/components/ArchiveForm.ArchiveForm)
        * [new exports.ArchiveForm()](#new_module_popup/components/ArchiveForm.ArchiveForm_new)
        * _instance_
            * [.connectedCallback()](#module_popup/components/ArchiveForm.ArchiveForm+connectedCallback)
            * [.attributeChangedCallback(name, oldValue, newValue)](#module_popup/components/ArchiveForm.ArchiveForm+attributeChangedCallback)
            * [.handleSignInFormSubmit()](#module_popup/components/ArchiveForm.ArchiveForm+handleSignInFormSubmit)
            * [.renderInnerHTML()](#module_popup/components/ArchiveForm.ArchiveForm+renderInnerHTML)
        * _static_
            * [.observedAttributes](#module_popup/components/ArchiveForm.ArchiveForm.observedAttributes)

<a name="module_popup/components/ArchiveForm.ArchiveForm"></a>

### popup/components/ArchiveForm.ArchiveForm
Custom Element: `<archive-form>`. 
Allows users to sign-in and create archives.

Available HTML attributes:
- `is-authenticated`: If "true", will show the archive creation form. Will show the sign-in form otherwise.
- `is-loading`: If "true", will "block" any form element.
- `tab-url`: Url of the current tab.
- `tab-title`: Title of the current tab.
- `folders-list`: JSON-serialized storage entry for "folders.available", if available. Should contain an array of objects (id, depth, name).
- `folders-pick`: Id of the folder the user has picked as a default, if any.

**Kind**: static class of [<code>popup/components/ArchiveForm</code>](#module_popup/components/ArchiveForm)  

* [.ArchiveForm](#module_popup/components/ArchiveForm.ArchiveForm)
    * [new exports.ArchiveForm()](#new_module_popup/components/ArchiveForm.ArchiveForm_new)
    * _instance_
        * [.connectedCallback()](#module_popup/components/ArchiveForm.ArchiveForm+connectedCallback)
        * [.attributeChangedCallback(name, oldValue, newValue)](#module_popup/components/ArchiveForm.ArchiveForm+attributeChangedCallback)
        * [.handleSignInFormSubmit()](#module_popup/components/ArchiveForm.ArchiveForm+handleSignInFormSubmit)
        * [.renderInnerHTML()](#module_popup/components/ArchiveForm.ArchiveForm+renderInnerHTML)
    * _static_
        * [.observedAttributes](#module_popup/components/ArchiveForm.ArchiveForm.observedAttributes)

<a name="new_module_popup/components/ArchiveForm.ArchiveForm_new"></a>

#### new exports.ArchiveForm()
On instantiation: 
- Bind local methods to `this` so they can easily be passed around

<a name="module_popup/components/ArchiveForm.ArchiveForm+connectedCallback"></a>

#### archiveForm.connectedCallback()
Upon injection into the DOM:
- First render.

**Kind**: instance method of [<code>ArchiveForm</code>](#module_popup/components/ArchiveForm.ArchiveForm)  
<a name="module_popup/components/ArchiveForm.ArchiveForm+attributeChangedCallback"></a>

#### archiveForm.attributeChangedCallback(name, oldValue, newValue)
On HTML attribute update:
- Re-render if value changed.

**Kind**: instance method of [<code>ArchiveForm</code>](#module_popup/components/ArchiveForm.ArchiveForm)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| oldValue | <code>\*</code> | 
| newValue | <code>\*</code> | 

<a name="module_popup/components/ArchiveForm.ArchiveForm+handleSignInFormSubmit"></a>

#### archiveForm.handleSignInFormSubmit()
On "submit" of the "Sign in" form:
- Send `AUTH_SIGN_IN` message to the service worker.
- If successful, also call `FOLDERS_PULL_LIST` and `ARCHIVE_PULL_TIMELINE`.

**Kind**: instance method of [<code>ArchiveForm</code>](#module_popup/components/ArchiveForm.ArchiveForm)  
<a name="module_popup/components/ArchiveForm.ArchiveForm+renderInnerHTML"></a>

#### archiveForm.renderInnerHTML()
Assembles a template and injects it into `innerHTML`.
Binds event listeners to the elements that were injected.

**Kind**: instance method of [<code>ArchiveForm</code>](#module_popup/components/ArchiveForm.ArchiveForm)  
<a name="module_popup/components/ArchiveForm.ArchiveForm.observedAttributes"></a>

#### ArchiveForm.observedAttributes
Defines which HTML attributes should be observed by `attributeChangedCallback`.

**Kind**: static property of [<code>ArchiveForm</code>](#module_popup/components/ArchiveForm.ArchiveForm)  
