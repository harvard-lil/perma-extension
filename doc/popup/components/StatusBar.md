<a name="module_popup/components/StatusBar"></a>

## popup/components/StatusBar
`<status-bar>` custom element.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [popup/components/StatusBar](#module_popup/components/StatusBar)
    * [.StatusBar](#module_popup/components/StatusBar.StatusBar)
        * [new exports.StatusBar()](#new_module_popup/components/StatusBar.StatusBar_new)
        * _instance_
            * [.connectedCallback()](#module_popup/components/StatusBar.StatusBar+connectedCallback)
            * [.attributeChangedCallback(name, oldValue, newValue)](#module_popup/components/StatusBar.StatusBar+attributeChangedCallback)
            * [.handleSignOutClick()](#module_popup/components/StatusBar.StatusBar+handleSignOutClick)
            * [.renderInnerHTML()](#module_popup/components/StatusBar.StatusBar+renderInnerHTML)
        * _static_
            * [.observedAttributes](#module_popup/components/StatusBar.StatusBar.observedAttributes)

<a name="module_popup/components/StatusBar.StatusBar"></a>

### popup/components/StatusBar.StatusBar
Custom Element: `<status-bar>`. 
Informs users on the extension's current state (is loading, error messages ...).

Available HTML attributes:
- `is-authenticated`: If "true", will show the "Sign out" button if not loading.
- `is-loading`: If "true", will show a loading spinner.
- `message`: Should be a key accessible via `browser.i18n`.

**Kind**: static class of [<code>popup/components/StatusBar</code>](#module_popup/components/StatusBar)  

* [.StatusBar](#module_popup/components/StatusBar.StatusBar)
    * [new exports.StatusBar()](#new_module_popup/components/StatusBar.StatusBar_new)
    * _instance_
        * [.connectedCallback()](#module_popup/components/StatusBar.StatusBar+connectedCallback)
        * [.attributeChangedCallback(name, oldValue, newValue)](#module_popup/components/StatusBar.StatusBar+attributeChangedCallback)
        * [.handleSignOutClick()](#module_popup/components/StatusBar.StatusBar+handleSignOutClick)
        * [.renderInnerHTML()](#module_popup/components/StatusBar.StatusBar+renderInnerHTML)
    * _static_
        * [.observedAttributes](#module_popup/components/StatusBar.StatusBar.observedAttributes)

<a name="new_module_popup/components/StatusBar.StatusBar_new"></a>

#### new exports.StatusBar()
On instantiation: 
- Bind local methods to `this` so they can easily be passed around

<a name="module_popup/components/StatusBar.StatusBar+connectedCallback"></a>

#### statusBar.connectedCallback()
Upon injection into the DOM:
- First render.

**Kind**: instance method of [<code>StatusBar</code>](#module_popup/components/StatusBar.StatusBar)  
<a name="module_popup/components/StatusBar.StatusBar+attributeChangedCallback"></a>

#### statusBar.attributeChangedCallback(name, oldValue, newValue)
On HTML attribute update:
- Re-render if value changed.

**Kind**: instance method of [<code>StatusBar</code>](#module_popup/components/StatusBar.StatusBar)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| oldValue | <code>\*</code> | 
| newValue | <code>\*</code> | 

<a name="module_popup/components/StatusBar.StatusBar+handleSignOutClick"></a>

#### statusBar.handleSignOutClick()
On "click" on the "Sign out" button:
- Send `AUTH_SIGN)_OUT` message to the service worker.

**Kind**: instance method of [<code>StatusBar</code>](#module_popup/components/StatusBar.StatusBar)  
<a name="module_popup/components/StatusBar.StatusBar+renderInnerHTML"></a>

#### statusBar.renderInnerHTML()
Assembles a template and injects it into `innerHTML`
Binds event listeners to the elements that were injected.

**Kind**: instance method of [<code>StatusBar</code>](#module_popup/components/StatusBar.StatusBar)  
<a name="module_popup/components/StatusBar.StatusBar.observedAttributes"></a>

#### StatusBar.observedAttributes
Defines which HTML attributes should be observed by `attributeChangedCallback`.

**Kind**: static property of [<code>StatusBar</code>](#module_popup/components/StatusBar.StatusBar)  
