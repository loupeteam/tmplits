function WidgetTableSelect(context, args) {

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
        field = `<input ${dataVarNameField ? 'data-var-name="' + dataVarNameField + '"' : '' } class='${set ?"":' noset'} lui-select-text${dataVarNameField ? ' webhmi-text-value' : ''} list-viewer-selected-file-name'>`
    }
    if( dataVarName ){
        field += `<invisible-input class='webhmi-num-value lui-select-value list-viewer-selected-file-name' style='display:none' data-var-name='${dataVarName}' ></invisible-input>`
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
<div class='select-scope size-fill-parent'>    
    <div class="${classList.join(' ')} size-fill-parent" style="${style}" >
    <div style="overflow:auto;" class="list-view list-viewer-window">    
        ${dropdown}
    </div>
        <div class="input-group size-fill-parent">
            ${field} 
            <button type="button" 
                ${willOpenButton}
                class="input-group-addon dropdown-toggle${willOpenPV ? " webhmi-btn-set" : ''} list-viewer-refresh-button" ${willOpenPV ? "data-var-name='" + willOpenPV +"'" : ''} data-toggle="dropdown" aria-hidden="true">
                <span class="glyphicon glyphicon-refresh"></span>
            </button>
        </div>
    </div>
    ${children}
</div>    
`
}