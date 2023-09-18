
/* Example Column (BootStrap) Usage
    {{#tmplit 'ColumnsBs' 'label' maxColumns=2}}
        <div style="text-align:center">Column 1 Header</div>
        <div style="text-align:center">Column 2 Header</div>
        {{tmplit 'NumericOutput' '<label>' data-var-name='<var>'}}
        {{tmplit 'NumericOutput' '<label>' data-var-name='<var>'}}
        {{tmplit 'NumericOutput' '<label>' data-var-name='<var>'}}
        {{tmplit 'NumericOutput' '<label>' data-var-name='<var>'}}
    {{/tmplit}}

* Bootstrap divides the page into a 12 columns. This will take the maxColumns attribute and check it against the maxColumns. 
From there it will decide how many columns out of 12 will be created
* This Tmplit will create the maxColumn amount of columns and add the children elements in order from left to right.
* The Columns will be equally spaced by the "margin: auto" styling.
*/


import * as util from "../tmplits-utilities/module.js"

export function TmplitColumnsBs(context, args) {

    let {
        style = '', maxColumns = 3, ..._args
    } = args.hash

    //Get cleaned values
    let {
        classList,
        attr
    } = util.cleanArgs(_args)

    let nodes = util.htmlToElements(args.children)
    let count = 0
    for( let e in nodes){
        let el = nodes[e]        
        switch (el.tagName) {
        case undefined:
        break
        default:
            count++
        }
    }

    maxColumns = maxColumns > 12 ? 12 : maxColumns
    let columns = count > maxColumns ? maxColumns : count
    let columnSize = Math.floor(12 / columns)
    let rows = Math.ceil(count / columns)
    classList.push(`col-sm-${columnSize}`)

    let children = ''
    let i=0;
    for( let e in nodes){
        let el = nodes[e]        
        switch (el.tagName) {
        case undefined:
            break
        default:
            if (i % columns == 0) {
                children += `<div class="row">`
            }
            children += `<div class="${classList.join(' ')}" style='${style}'>${el.outerHTML}</div>`
            if (i % columns == (columns - 1)) {
                children += `</div>`
            }
            i++;
        break;
        }
    }
    return `${children}`
}