<a name="module_popup/components/ArchiveTimeline"></a>

## popup/components/ArchiveTimeline
`<archive-timeline>` custom element.

**Author**: The Harvard Library Innovation Lab  
**License**: MIT  

* [popup/components/ArchiveTimeline](#module_popup/components/ArchiveTimeline)
    * [.ArchiveTimeline](#module_popup/components/ArchiveTimeline.ArchiveTimeline)
        * _instance_
            * [.connectedCallback()](#module_popup/components/ArchiveTimeline.ArchiveTimeline+connectedCallback)
            * [.attributeChangedCallback(name, oldValue, newValue)](#module_popup/components/ArchiveTimeline.ArchiveTimeline+attributeChangedCallback)
            * [.addArchives(archives)](#module_popup/components/ArchiveTimeline.ArchiveTimeline+addArchives)
            * [.renderInnerHTML()](#module_popup/components/ArchiveTimeline.ArchiveTimeline+renderInnerHTML)
        * _static_
            * [.observedAttributes](#module_popup/components/ArchiveTimeline.ArchiveTimeline.observedAttributes)

<a name="module_popup/components/ArchiveTimeline.ArchiveTimeline"></a>

### popup/components/ArchiveTimeline.ArchiveTimeline
Custom Element: `<archive-timeline>`. 
Shows the user the list of archives that they created for the current page.
Accepts `<archive-timeline-item>` elements as direct children (+ `<h3>` intro), filters out other elements.

Note:
- Use `addArchives()` to feed this component an array of archive objects (See: PermaArchive objects from `perma-js-sdk`).

Available HTML attributes:
- `is-authenticated`: If not "true", this component is hidden.
- `is-loading`: If "true", disables all nested form elements.

Note: 
- Singleton pattern is enforced. Only 1 element of this type can be present in a given document.

**Kind**: static class of [<code>popup/components/ArchiveTimeline</code>](#module_popup/components/ArchiveTimeline)  

* [.ArchiveTimeline](#module_popup/components/ArchiveTimeline.ArchiveTimeline)
    * _instance_
        * [.connectedCallback()](#module_popup/components/ArchiveTimeline.ArchiveTimeline+connectedCallback)
        * [.attributeChangedCallback(name, oldValue, newValue)](#module_popup/components/ArchiveTimeline.ArchiveTimeline+attributeChangedCallback)
        * [.addArchives(archives)](#module_popup/components/ArchiveTimeline.ArchiveTimeline+addArchives)
        * [.renderInnerHTML()](#module_popup/components/ArchiveTimeline.ArchiveTimeline+renderInnerHTML)
    * _static_
        * [.observedAttributes](#module_popup/components/ArchiveTimeline.ArchiveTimeline.observedAttributes)

<a name="module_popup/components/ArchiveTimeline.ArchiveTimeline+connectedCallback"></a>

#### archiveTimeline.connectedCallback()
Upon injection into the DOM:
- First render
- Enforce singleton pattern

**Kind**: instance method of [<code>ArchiveTimeline</code>](#module_popup/components/ArchiveTimeline.ArchiveTimeline)  
<a name="module_popup/components/ArchiveTimeline.ArchiveTimeline+attributeChangedCallback"></a>

#### archiveTimeline.attributeChangedCallback(name, oldValue, newValue)
On HTML attribute update:
- Re-render if value changed.

**Kind**: instance method of [<code>ArchiveTimeline</code>](#module_popup/components/ArchiveTimeline.ArchiveTimeline)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| oldValue | <code>\*</code> | 
| newValue | <code>\*</code> | 

<a name="module_popup/components/ArchiveTimeline.ArchiveTimeline+addArchives"></a>

#### archiveTimeline.addArchives(archives)
Creates and inject `<archive-timeline-item>` elements using a list of `PermaArchive` objects.
Re-renders.

**Kind**: instance method of [<code>ArchiveTimeline</code>](#module_popup/components/ArchiveTimeline.ArchiveTimeline)  

| Param | Type |
| --- | --- |
| archives | <code>Array.&lt;PermaArchive&gt;</code> | 

<a name="module_popup/components/ArchiveTimeline.ArchiveTimeline+renderInnerHTML"></a>

#### archiveTimeline.renderInnerHTML()
Assembles a template and injects it into `innerHTML`.

**Kind**: instance method of [<code>ArchiveTimeline</code>](#module_popup/components/ArchiveTimeline.ArchiveTimeline)  
<a name="module_popup/components/ArchiveTimeline.ArchiveTimeline.observedAttributes"></a>

#### ArchiveTimeline.observedAttributes
Defines which HTML attributes should be observed by `attributeChangedCallback`.

**Kind**: static property of [<code>ArchiveTimeline</code>](#module_popup/components/ArchiveTimeline.ArchiveTimeline)  
