<a name="module_popup/components/IntroHeader"></a>

## popup/components/IntroHeader
`<app-header>` custom element.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [popup/components/IntroHeader](#module_popup/components/IntroHeader)
    * [.AppHeader](#module_popup/components/IntroHeader.AppHeader)
        * _instance_
            * [.connectedCallback()](#module_popup/components/IntroHeader.AppHeader+connectedCallback)
            * [.attributeChangedCallback(name, oldValue, newValue)](#module_popup/components/IntroHeader.AppHeader+attributeChangedCallback)
            * [.renderInnerHTML()](#module_popup/components/IntroHeader.AppHeader+renderInnerHTML)
        * _static_
            * [.observedAttributes](#module_popup/components/IntroHeader.AppHeader.observedAttributes)

<a name="module_popup/components/IntroHeader.AppHeader"></a>

### popup/components/IntroHeader.AppHeader
Custom Element: `<app-header>`.

Available HTML attributes: 
- `tab-url`: Url of the current tab.
- `tab-title`: Title of the current tab.

**Kind**: static class of [<code>popup/components/IntroHeader</code>](#module_popup/components/IntroHeader)  

* [.AppHeader](#module_popup/components/IntroHeader.AppHeader)
    * _instance_
        * [.connectedCallback()](#module_popup/components/IntroHeader.AppHeader+connectedCallback)
        * [.attributeChangedCallback(name, oldValue, newValue)](#module_popup/components/IntroHeader.AppHeader+attributeChangedCallback)
        * [.renderInnerHTML()](#module_popup/components/IntroHeader.AppHeader+renderInnerHTML)
    * _static_
        * [.observedAttributes](#module_popup/components/IntroHeader.AppHeader.observedAttributes)

<a name="module_popup/components/IntroHeader.AppHeader+connectedCallback"></a>

#### appHeader.connectedCallback()
Upon injection into the DOM:
- First render
- Enforce singleton pattern

**Kind**: instance method of [<code>AppHeader</code>](#module_popup/components/IntroHeader.AppHeader)  
<a name="module_popup/components/IntroHeader.AppHeader+attributeChangedCallback"></a>

#### appHeader.attributeChangedCallback(name, oldValue, newValue)
On HTML attribute update:
- Re-render if value changed.

**Kind**: instance method of [<code>AppHeader</code>](#module_popup/components/IntroHeader.AppHeader)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| oldValue | <code>\*</code> | 
| newValue | <code>\*</code> | 

<a name="module_popup/components/IntroHeader.AppHeader+renderInnerHTML"></a>

#### appHeader.renderInnerHTML()
Assembles a template and injects it into `innerHTML`

**Kind**: instance method of [<code>AppHeader</code>](#module_popup/components/IntroHeader.AppHeader)  
<a name="module_popup/components/IntroHeader.AppHeader.observedAttributes"></a>

#### AppHeader.observedAttributes
Defines which HTML attributes should be observed by `attributeChangedCallback`.

**Kind**: static property of [<code>AppHeader</code>](#module_popup/components/IntroHeader.AppHeader)  
