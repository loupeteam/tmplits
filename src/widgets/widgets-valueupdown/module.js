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

export function WidgetValueUpDown(context, args) {
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
    classList = classList.concat(['lui-increment-scope'])
    style = 'display:inline-flex; grid-template-columns: auto 1fr auto; border-style:solid; border-radius: 40px;width:fit-content;height:fit-content;' + style;
    buttonStyle = ';padding:20px; font-size:20px;' + buttonStyle
    inputStyle = `;padding: 1px;margin: -1px;text-align: center;width: 100px;font-size: 20px;font-weight: bold;border-width: 1px;` + inputStyle
    let innerClassList = ['lui-increment-value']
    if (dataVarName) {
        innerClassList.push('webhmi-num-value')
    }
    let inner = '';
    if (args.children) {
        inner = `<input class='${innerClassList.join(' ')}' style='display:none' ${dataVarName?'data-var-name="' + dataVarName +'"':''}' />`
        inner += args.children
    } else {
        inner = `<input class='${innerClassList.join(' ')}' style='${inputStyle}' ${dataVarName?'data-var-name="' + dataVarName +'"':''}' />`
    }

    return `
    <div class="${classList.join(' ')}" style='${style}'>
    <span class='glyphicon glyphicon-chevron-down lui-increment' increment=${-increment} min=${min} style="${buttonStyle}"></span>
    ${inner}
    <span class='glyphicon glyphicon-chevron-up lui-increment' increment=${increment} max=${max} style="${buttonStyle}"></span>
    </div>
`
}