import * as util from "../widgets-utilities/module.js"

export function WidgetColumnsBs(context, args) {

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