function WidgetDropdownTableText(context, args) {

    let {
        set = true, 
        style = '', 
        ['data-var-name']:dataVarName,
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
    let options = ''
    let index = 0
    let children = ''

    let nodes = htmlToElements(trimmed)

    for( let i in nodes){
        let el = nodes[i]        
        switch (el.tagName) {
            case 'FIELD':
                el.childNodes.forEach((e) => {
                    if (e.classList) {
                        e.classList.add('form-control')
                        if (set) {
                            e.classList.add('selected-item-text')
                        }
                        field += e.outerHTML
                    }
                })                    
                break;
            case 'OPTION':
                let e = el
                let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`
                e = htmlToElement(`<tr><td> ${e.innerHTML} </td></tr>`)
                for( let i = 0; i < el.attributes.length; i++){
                    let elAttr = el.attributes[i].name
                    if( typeof elAttr == 'string' ){
                        e.setAttribute( elAttr, el.getAttribute(elAttr));
                    }
                }
                e.setAttribute('onclick', click)
                e.setAttribute('data-index', index++)
                e.classList.add('option')
                options += e.outerHTML    
                break;
            case 'OPTIONS':
                el.childNodes.forEach((e) => {
                    if (e.getAttribute) {
                        let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`
                        e = htmlToElement(`<tr><td> ${e.outerHTML} </td></tr>`)
                        e.setAttribute('onclick', click)
                        e.setAttribute('data-index', index++)
                        e.classList.add('option')
                        options += e.outerHTML
                    }
                })    
            break;
            case undefined:

            break
            default:
                children += el.outerHTML? el.outerHTML: el.textContent
                break;
        }
    }
    
    if( field == '') {
        field = `<input ${dataVarNameField ? 'data-var-name="' + dataVarNameField + '"' : '' } class='form-control${set ?"":' noset'} lui-select-text${dataVarNameField ? ' webhmi-text-value' : ''}'>`
    }
    if( dataVarName ){
        field += `<invisible-input class='webhmi-text-value lui-select-value' style='display:none' data-var-name='${dataVarName}' ></invisible-input>`
    }

    let delegate = args.delegate ? `onclick="${args.delegate}?.willOpen?.()"` : ''
    return `
<div class='select-scope'>
    <div class="${classList.join(' ')}" style="${style}" >
        <div class="input-group-btn">
            <button type="button" 
            ${delegate}
            class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="caret"></span>
            </button>
            <div class="dropdown-menu" >
                <table class="table">
                    <tbody>
                    ${options}
                    </tbody>
                </table>            
            </div>
        </div>
        ${field}
    </div>
    ${children}
</div>
`
}