/*Example Layout usage
*/

import * as util from "../tmplits-utilities/module.js"

export function TmplitLayoutHeader(context, args) {
    let {
        headerType='', headerColor='', columnNumber=1, ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr,
    } = util.cleanArgs(_args)

    let nodes = util.htmlToElements(args.children)
    let children = 'hello world!'
    let count = 0
    let childrenString = ''
    let rowWidth = 1;

    if(columnNumber!= 0){
        rowWidth = Math.floor(12/columnNumber)
    }

    for( let i in nodes){
        let el = nodes[i]
        switch (el.tagName) {
            case undefined:
                break
            default:
            children += el.outerHTML     
            childrenString += '<div class="col-md-'+rowWidth+'"> ' + el.outerHTML + '</div>'   
            count++;
        }
    }

    return `<div class="navbar ${classList.join(' ')}" ${attr}" style="background-color:${headerColor}; position: ${headerType}; top: 10px;>
                <div class="navbar-inner">
                    <div class="nav">
                            <div class="row">
                                ${childrenString}
                            </div>
                    </div>
                </div>
            </div>`
}
