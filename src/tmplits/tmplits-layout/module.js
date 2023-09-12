/*Example Layout usage
*/

import * as util from "../tmplits-utilities/module.js"

export function TmplitLayoutHeader(context, args) {
    let {
        headerType='static', backgroundColor='', columnNumber=1, ..._args
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

    return `<div class="navbar ${classList.join(' ')}" ${attr}" style="background-color:${backgroundColor}; position: ${headerType}; top: 10px;>
                <div class="navbar-inner">
                    <div class="nav">
                            <div class="row">
                                ${childrenString}
                            </div>
                    </div>
                </div>
            </div>`
}

export function TmplitLayoutBody(context, args) {

    let nodes = util.htmlToElements(args.children)
    let children = 'hello world!'
    let count = 0

    for( let i in nodes){
        let el = nodes[i]
        switch (el.tagName) {
            case undefined:
                break
            default:
            children += el.outerHTML     
            count++;
        }
    }
    return `<div>${children}</div>`
}

export function TmplitLayoutFooter(context, args) {
    let {
        backgroundColor='', columnNumber=1, ..._args
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

    return `<div class="${classList.join(' ')}" ${attr}" style="background-color:${backgroundColor}; position: fixed; bottom: 10px; left: 0px; width: 100%;">
                            <div class="row ${classList.join(' ')}" ${attr}" >
                                ${childrenString}
                            </div>
            </div>`
}