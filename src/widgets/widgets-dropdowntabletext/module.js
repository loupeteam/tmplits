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

export function WidgetDropdownTableText(context, args) {

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
    } = util.cleanArgs(args.hash)
    style = 'margin:auto;' + style;
    classList = classList.concat(['input-group'])

    let trimmed = args.children.trim()
    let field = ''
    let options = ''
    let index = 0
    let children = ''

    let nodes = util.htmlToElements(trimmed)

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
                e = util.htmlToElement(`<tr><td> ${e.innerHTML} </td></tr>`)
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
                        e = util.htmlToElement(`<tr><td> ${e.outerHTML} </td></tr>`)
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