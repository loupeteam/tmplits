function WidgetMultiSelectText(context, args) {

    let {        
        ['data-var-name']:dataVarName,
        style = '', ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = cleanArgs(args.hash)
    style = 'margin:auto;' + style;
    classList = classList.concat(['input-group', 'select-scope'])

    let trimmed = args.children.trim()
    let options = ''
    let index = 0


    let nodes = htmlToElements(trimmed)
    for( let i in nodes){
        let el = nodes[i]
        if (el.tagName == 'OPTION') {
            let e = el
            let dataValue = e.getAttribute('data-value')
            let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`

            e = htmlToElement(`<div class="option"> ${e.innerHTML} </div>`)
            if( dataValue != null ){
                e.setAttribute('data-value', dataValue)            
            }
            e.setAttribute('onclick', click)            
            e.setAttribute('data-index', index)
            index++
            options += e.outerHTML
        }
        if (el.tagName == 'OPTIONS') {
            el.childNodes.forEach((e) => {
                if (e.getAttribute) {
                    let dataValue = e.getAttribute('data-value')
                    let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`
                    e = htmlToElement(`<div class="option"> ${e.outerHTML} </div>`)
                    if( dataValue != null){
                        e.setAttribute('data-value', dataValue)            
                    }
                    e.setAttribute('onclick', click)
                    e.setAttribute('data-index', index)
                    index++
                    options += e.outerHTML
                }
            })
        }
    }

    options += `<invisible-input class="lui-select-value webhmi-text-value" style="display:none" value="${context}" ${dataVarName?'data-var-name="' + dataVarName +'"':''} ></invisible-input>`

    args.children = options
    let inner = WidgetColumns( context, args)
    return `
<div class="${classList.join(' ')}">${inner}</div>    
    ` 
}