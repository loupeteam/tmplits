//DO NOT DELETE THIS FILE 
//- Doing so will cause 404 errors on the client side which will not break anything, but will throw errors in the console.

//This file will get loaded as a javascript module, meaning you can import other modules from here.
//You can also export functions from here, which will be available to the client side.

//import * from "./module2.js"//Import relative to this file inside node_modules/this-module-name/
//import * from "../widgets-some-other/module.js"//Import relative to this file inside node_modules/widgets-some-other/
//import * from "/somewhere.js"//Import from the root of the project

//Define your widget functions here and export them to make them globally available
//export function WidgetHelloWorld(context, args){
//    return `Hello ${context[0]}!`
//}

import * as util from "../widgets-utilities/module.js"

export function WidgetMultiSelect(context, args) {

    let {        
        ['data-var-name']:dataVarName,
        style = '', ..._args
    } = args.hash
    //Get cleaned up values from args
    let {
        classList,
        attr
    } = util.cleanArgs(args.hash)
    style = 'margin:auto;' + style;
    classList = classList.concat(['input-group', 'select-scope'])

    let trimmed = args.children.trim()
    let options = ''
    let index = 0


    let nodes = util.htmlToElements(trimmed)
    for( let i in nodes){
        let el = nodes[i]
        if (el.tagName == 'OPTION') {
            let e = el
            let dataValue = e.getAttribute('data-value')
            let click = `multiOptionSelector.selected(this, '${e.getAttribute('onclick') }');`

            e = util.htmlToElement(`<div class="option"> ${e.innerHTML} </div>`)
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
                    e = util.htmlToElement(`<div class="option"> ${e.outerHTML} </div>`)
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

    options += `<invisible-input class="lui-select-value webhmi-num-value" style="display:none" value="${context}" ${dataVarName?'data-var-name="' + dataVarName +'"':''} ></invisible-input>`

    args.children = options
    let inner = WidgetColumns( context, args)
    return `
<div class="${classList.join(' ')}">${inner}</div>    
    ` 
}