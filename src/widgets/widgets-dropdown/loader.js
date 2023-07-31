/*
Create a dropdown and field
The user supplies the drop down and marks the option with an option class

For a custom form you must have at least one item with class="selected-item-text" 
or we will assume one for you..

Options:
Set=false to disable setting the field to the selection


<button><-----------------field---------->
<dropdown>
    USER DROPDOWN
    <el class='option'> -> will be set to field
</dropdown>

Example drop down usage:
    {{#widget 'dropdown' [set=false/true]}}
    <field>
        <input placeholder="Select Operation" class='webhmi-dropdown'/>        
    </field>
    <dropdown>
       <div></div>         
       <div class="option"></div>         
       <div></div>         
       <div class="option"></div>         
    <dropdown>
    {{/widget}}
*/
function WidgetDropdown(context, args) {

    let {
        set = true, style = '', 
        willOpen,
        ['data-var-name']:dataVarName,
        ['data-var-name-willopen'] : willOpenPV,
        ['data-var-name-field'] : dataVarNameField,
        ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)
    style = 'margin:auto;' + style;
    classList = classList.concat(['input-group'])

    let trimmed = args.children.trim()

    let field = ''
    let index = 0
    let dropdown = 'missing &lt;dropdown&gt;'
    let children = ''
    let nodes = htmlToElements(trimmed)

    for( let i in nodes){
        let el = nodes[i]        

        switch (el.tagName) {
        case 'FIELD':
            el.childNodes.forEach((e) => {
                if (e.classList) {
                    e.classList.add('form-control')

                    if (set && e.querySelectorAll(".lui-select-text").length == 0) {
                        e.classList.add('lui-select-text')
                    }
                    field += e.outerHTML
                }
            })
        break
        case 'DROPDOWN':
            index = updateSelectOptions(el, index)
            dropdown = el.innerHTML
        break;
        case undefined:

        break;
        default:
            children += el.outerHTML? el.outerHTML: el.textContent
        break;
        }
    }
    if (field == '') {
        field = `<input ${dataVarNameField ? 'data-var-name="' + dataVarNameField + '"' : '' } class='form-control${set ?"":' noset'} lui-select-text${dataVarNameField ? ' webhmi-text-value' : ''}'>`
    }
    if( dataVarName ){
        field += `<invisible-input class='webhmi-num-value lui-select-value' style='display:none' data-var-name='${dataVarName}' ></invisible-input>`
    }
    let delegate = args.delegate ? `onclick="${args.delegate}?.willOpen?.();"` : ''

    let willOpenButton  = 'onclick="'
    if( args.delegate ){
        willOpenButton += `args.delegate?.willOpen?.();`;
    }
    if( willOpen ){
        willOpenButton = `evalInContext(${willOpen})`
    }
    willOpenButton += '"'
    return `
<div class='select-scope'>    
    <div class="${classList.join(' ')}" style="${style}" >
        <div class="input-group-btn">
            <button type="button" 
            ${willOpenButton}
            class="btn dropdown-toggle${willOpenPV ? " webhmi-btn-set" : ''}" ${willOpenPV ? "data-var-name='" + willOpenPV +"'" : ''} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="caret"></span>
            </button>
            <div class="dropdown-menu" >
                ${dropdown}
            </div>
        </div>
        ${field}
    </div>
    ${children}
</div>    
`
}