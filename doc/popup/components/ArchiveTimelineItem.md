<a name="module_popup/components/ArchiveTimelineItem"></a>

## popup/components/ArchiveTimelineItem
`<archive-timeline-item>` custom element.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [popup/components/ArchiveTimelineItem](#module_popup/components/ArchiveTimelineItem)
    * [.ArchiveTimelineItem](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem)
        * [new exports.ArchiveTimelineItem()](#new_module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem_new)
        * _instance_
            * [.connectedCallback()](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+connectedCallback)
            * [.attributeChangedCallback(name, oldValue, newValue)](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+attributeChangedCallback)
            * [.handlePrivacyToggleClick(button)](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+handlePrivacyToggleClick)
            * [.renderInnerHTML()](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+renderInnerHTML)
        * _static_
            * [.observedAttributes](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem.observedAttributes)

<a name="module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem"></a>

### popup/components/ArchiveTimelineItem.ArchiveTimelineItem
Custom Element: `<archive-timeline-item>`. 
Represents a single archive in the `<archive-timeline>` element.

Available HTML attributes:
- `guid`
- `creation-timestamp`
- `is-private`

Note:
- Probes parent's `is-loading` attribute to determine if buttons should be disabled.

**Kind**: static class of [<code>popup/components/ArchiveTimelineItem</code>](#module_popup/components/ArchiveTimelineItem)  

* [.ArchiveTimelineItem](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem)
    * [new exports.ArchiveTimelineItem()](#new_module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem_new)
    * _instance_
        * [.connectedCallback()](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+connectedCallback)
        * [.attributeChangedCallback(name, oldValue, newValue)](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+attributeChangedCallback)
        * [.handlePrivacyToggleClick(button)](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+handlePrivacyToggleClick)
        * [.renderInnerHTML()](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+renderInnerHTML)
    * _static_
        * [.observedAttributes](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem.observedAttributes)

<a name="new_module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem_new"></a>

#### new exports.ArchiveTimelineItem()
On instantiation: 
- Bind local methods to `this` so they can easily be passed around

<a name="module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+connectedCallback"></a>

#### archiveTimelineItem.connectedCallback()
Upon injection into the DOM:
- First render

**Kind**: instance method of [<code>ArchiveTimelineItem</code>](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem)  
<a name="module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+attributeChangedCallback"></a>

#### archiveTimelineItem.attributeChangedCallback(name, oldValue, newValue)
On HTML attribute update:
- Re-render if value changed.

**Kind**: instance method of [<code>ArchiveTimelineItem</code>](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| oldValue | <code>\*</code> | 
| newValue | <code>\*</code> | 

<a name="module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+handlePrivacyToggleClick"></a>

#### archiveTimelineItem.handlePrivacyToggleClick(button)
On click on the "toggle privacy" button of a given item:
- Send `ARCHIVE_PRIVACY_STATUS_TOGGLE` message to the service worker.

**Kind**: instance method of [<code>ArchiveTimelineItem</code>](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem)  

| Param | Type | Description |
| --- | --- | --- |
| button | <code>HTMLElement</code> | Reference to the button that was clicked |

<a name="module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+renderInnerHTML"></a>

#### archiveTimelineItem.renderInnerHTML()
Assembles a template and injects it into `innerHTML`
Binds event listeners to the elements that were injected.

**Kind**: instance method of [<code>ArchiveTimelineItem</code>](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem)  
<a name="module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem.observedAttributes"></a>

#### ArchiveTimelineItem.observedAttributes
Defines which HTML attributes should be observed by `attributeChangedCallback`.

**Kind**: static property of [<code>ArchiveTimelineItem</code>](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem)  
