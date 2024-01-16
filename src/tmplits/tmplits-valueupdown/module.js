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

/* Example Value Up Down Usage
{{tmplit 'ValueUpDown' data-var-name='<var>' increment=2}}

Options:
    data-var-name: ANY_INT cannot roll over 
    increment: optional argument that defaults to 1
    buttonStyle: optional argument
    inputStyle: optional argument
    max: optional argument defaults to 100
    min: optional argument defaults to 0
*/

import * as util from "../tmplits-utilities/module.js"

export function TmplitValueUpDown(context, args) {
    let {
        style = '',
            ['data-var-name']: dataVarName,
            increment = 1,
            min = 0,
            max = 100,
            buttonStyle = '',
            inputStyle = '',
            ..._args
    } = args.hash

    //Get cleaned values
    let {
        classList,
        attr
    } = util.cleanArgs(_args)
    classList = classList.concat(['lui-increment-scope', 'tmplit-valueupdown-container'])
    let innerClassList = ['lui-increment-value', 'tmplit-valueupdown-field']
    if (dataVarName) {
        innerClassList.push('lux-num-value')
    }
    let inner = '';
    if (args.children) {
        inner = `<input class='${innerClassList.join(' ')}' style='display:none' ${dataVarName?'data-var-name="' + dataVarName +'"':''}' min='${min}' max='${max}' />`
        inner += args.children
    } else {
        inner = `<input class='${innerClassList.join(' ')}' style='${inputStyle}' ${dataVarName?'data-var-name="' + dataVarName +'"':''}' min='${min}' max='${max}' />`
    }

    return `
    <div class="${classList.join(' ')}" style='${style}'>
        <span class='glyphicon glyphicon-chevron-down lui-increment tmplit-valueupdown-button' increment=${-increment} min=${min} style="${buttonStyle}"></span>
            ${inner}
        <span class='glyphicon glyphicon-chevron-up lui-increment tmplit-valueupdown-button' increment=${increment} max=${max} style="${buttonStyle}"></span>
    </div>

`
}