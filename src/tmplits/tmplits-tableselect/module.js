/*
 * File: module.js
 * Copyright (c) 2023 Loupe
 * https://loupe.team
 * 
 * This file is part of tmplits, licensed under the MIT License.
 * 
 */

//DO NOT DELETE THIS FILE 
//- Doing so will cause 404 errors on the client side which will not break anything, but will throw errors in the console.

//This file will get loaded as a javascript module, meaning you can import other modules from here.
//You can also export functions from here, which will be available to the client side.

//import * from "./module2.js"//Import relative to this file inside node_modules/this-module-name/
//import * from "../tmplits-some-other/module.js"//Import relative to this file inside node_modules/tmplits-some-other/
//import * from "/somewhere.js"//Import from the root of the project

//Define your tmplit functions here and export them to make them globally available
//export function TmplitHelloWorld(context, args){
//    return `Hello ${context[0]}!`
//}

import * as util from "../tmplits-utilities/module.js"

export function TmplitTableSelect(context, args) {

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
    } = util.cleanArgs(args.hash)
    style = 'margin:auto;' + style;
    classList = classList.concat(['input-group'])

    let trimmed = args.children.trim()

    let field = ''
    let index = 0
    let dropdown = 'missing &lt;dropdown&gt;'
    let children = ''
    let nodes = util.htmlToElements(trimmed)

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
            index = util.updateSelectOptions(el, index)
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
        field = `<input ${dataVarNameField ? 'data-var-name="' + dataVarNameField + '"' : '' } class='${set ?"":' noset'} lui-select-text${dataVarNameField ? ' lux-text-value' : ''} list-viewer-selected-file-name'>`
    }
    if( dataVarName ){
        field += `<invisible-input class='lux-num-value lui-select-value list-viewer-selected-file-name' style='display:none' data-var-name='${dataVarName}' ></invisible-input>`
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
        <div class="input-group" style="width:100%">
            ${field} 
            <button type="button" 
                ${willOpenButton}
                class="input-group-addon dropdown-toggle${willOpenPV ? " lux-btn-set" : ''} list-viewer-refresh-button" ${willOpenPV ? "data-var-name='" + willOpenPV +"'" : ''} data-toggle="dropdown" aria-hidden="true">
                <span class="glyphicon glyphicon-refresh"></span>
            </button>
        </div>
    </div>
    ${children}
</div>    
`
}