<a name="module_popup/components/ArchiveTimelineItem"></a>

## popup/components/ArchiveTimelineItem
`<archive-timeline-item>` custom element.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [popup/components/ArchiveTimelineItem](#module_popup/components/ArchiveTimelineItem)
    * [.ArchiveTimelineItem](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem)
        * [new exports.ArchiveTimelineItem()](#new_module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem_new)
        * _instance_
            * [.CAPTURE_STATUSES](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+CAPTURE_STATUSES)
            * [.connectedCallback()](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+connectedCallback)
            * [.attributeChangedCallback(name, oldValue, newValue)](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+attributeChangedCallback)
            * [.handleCopyButtonClick(e)](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+handleCopyButtonClick)
            * [.renderInnerHTML()](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+renderInnerHTML)
        * _static_
            * [.observedAttributes](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem.observedAttributes)

<a name="module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem"></a>

### popup/components/ArchiveTimelineItem.ArchiveTimelineItem
Custom Element: `<archive-timeline-item>`. 
Represents a single archive in the `<archive-timeline>` element.

Available HTML attributes:
- `guid`
- `archived-url`: Url that was actually captured (from `PermaArchive.url`).
- `creation-timestamp`: String representation of Data object.
- `capture-status`: From `PermaCapture.status`. Can be "pending", "failed" or "success".

**Kind**: static class of [<code>popup/components/ArchiveTimelineItem</code>](#module_popup/components/ArchiveTimelineItem)  

* [.ArchiveTimelineItem](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem)
    * [new exports.ArchiveTimelineItem()](#new_module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem_new)
    * _instance_
        * [.CAPTURE_STATUSES](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+CAPTURE_STATUSES)
        * [.connectedCallback()](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+connectedCallback)
        * [.attributeChangedCallback(name, oldValue, newValue)](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+attributeChangedCallback)
        * [.handleCopyButtonClick(e)](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+handleCopyButtonClick)
        * [.renderInnerHTML()](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+renderInnerHTML)
    * _static_
        * [.observedAttributes](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem.observedAttributes)

<a name="new_module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem_new"></a>

#### new exports.ArchiveTimelineItem()
On instantiation: 
- Bind local methods to `this` so they can easily be passed around

<a name="module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+CAPTURE_STATUSES"></a>

#### archiveTimelineItem.CAPTURE\_STATUSES
Possible values for `capture-status`.

**Kind**: instance property of [<code>ArchiveTimelineItem</code>](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem)  
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

<a name="module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+handleCopyButtonClick"></a>

#### archiveTimelineItem.handleCopyButtonClick(e)
Adds a reference to the Perma link that was clicked to the clipboard, in a "cite-ready" format.

Example: "https://lil.law.harvard.edu, archived at https://perma.cc/{guid}".

**Kind**: instance method of [<code>ArchiveTimelineItem</code>](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem)  

| Param | Type |
| --- | --- |
| e | <code>Event</code> | 

<a name="module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem+renderInnerHTML"></a>

#### archiveTimelineItem.renderInnerHTML()
Assembles a template and injects it into `innerHTML`
Binds event listeners to the elements that were injected.

**Kind**: instance method of [<code>ArchiveTimelineItem</code>](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem)  
<a name="module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem.observedAttributes"></a>

#### ArchiveTimelineItem.observedAttributes
Defines which HTML attributes should be observed by `attributeChangedCallback`.

**Kind**: static property of [<code>ArchiveTimelineItem</code>](#module_popup/components/ArchiveTimelineItem.ArchiveTimelineItem)  
